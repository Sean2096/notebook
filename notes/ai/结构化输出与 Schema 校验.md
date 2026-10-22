---
tags:
  - 概念卡
type: concept
domain: AI
topic: Structured Output
status: 学习中 # 学习中 / 已理解 / 已考核 / 需复习
created: 2026-10-12
source: ""
---

# 结构化输出与 Schema 校验

## 一句话定义
> 结构化输出（Structured Output，让模型返回严格符合预定义 schema 的 JSON 而非自由文本）= **用 schema 在协议层约束生成 + 在应用层用 zod 校验兜底**的双保险机制；核心心智是「生成」和「解析校验」是两个独立环节，schema 不是模型的自觉，是你和模型之间的**合同**。

## 为什么需要
- 解决的问题：下游是代码、数据库、UI 组件，它们要的是**类型安全的数据**，不是文本。自由文本 → 正则抠 JSON → `JSON.parse` 随机炸。
- 没有它会怎样：
  - 模型在 JSON 前后加"好的，以下是结果："或套 ` ```json ` 代码围栏 → 解析失败；
  - 字段名漂移（`user_id` vs `userId`）、枚举乱填、尾逗号 → 下游静默出错；
  - Agent 场景里工具参数不合法 → 直接报错或越权；
  - 前端按字段渲染卡片，缺字段就得整块崩或显示 `undefined`。

## 原理 / 流程：约束强度四档（务必按强弱排序记）

| 档 | 手段 | 保证什么 | 不保证什么 |
| --- | --- | --- | --- |
| 1 最弱 | Prompt 里写"只返回 JSON" + few-shot 示例 | 大概率听话 | 什么也不保证，纯概率 |
| 2 | JSON Mode（OpenAI 系：`response_format: { type: 'json_object' }`） | **输出是合法 JSON** | 不保证字段符合你的结构 |
| 3 | Structured Outputs / JSON Schema 约束（`strict` 模式） | **语法层面符合 schema** | 不保证内容是对的事实 |
| 4 兜底 | 应用层 `zod.parse()` | 你的合同真正生效的那一刻 | —（这层不能省） |

第 3 档为什么能做到：底层是 **constrained decoding（受限解码）**——采样时把不符合当前语法状态的 token 概率屏蔽掉，模型物理上"写不出"非法 JSON；部分实现是服务端生成后校验重试。

**关键区分：schema 管格式，不管真假。** 结构 100% 合法 + 内容完全编造，是最危险的组合，因为代码毫无怨言地把它写进了数据库。内容对错要靠第 4 档的业务校验和 [[RAG 应用评估]]。

## 本项目栈怎么用（Vercel AI SDK）

> ⚠️ 你 Demo 里装的是 `ai@7.0.x`。**v6 起 `generateObject()` / `streamObject()` 已被标记 deprecated（Legacy）并将移除**，网上大量教程仍写旧 API，照抄会踩。新写法把结构化输出挂到 `generateText` / `streamText` 的 `output` 参数上。

```ts
import { generateText, streamText, Output } from 'ai'
import { z } from 'zod'

const schema = z.object({
  title: z.string().describe('提取的标题'),
  confidence: z.number().min(0).max(1),
})

// 非流式：output 的 TS 类型由 zod schema 自动推断
const { output } = await generateText({
  model: deepseek('deepseek-chat'),
  prompt: '...',
  output: Output.object({ schema }),
  maxRetries: 2, // 文档只说明它是重试次数上限（默认 2），未列明覆盖哪些错误
})
// ⚠️ schema 校验失败（模型输出无法解析/不符合 schema）时，文档口径是抛
// NoObjectGeneratedError（错误对象上带原始 text、finishReason、cause）。
// 「maxRetries 是否会重试这一类失败」官方文档没写，属推断——
// 别背结论，实测：故意用一个必然产生坏 JSON 的 prompt，看日志里请求了几次。

// 流式：逐字段增量渲染，中间态保证是可解析的 JSON
const { partialOutputStream } = streamText({
  model: deepseek('deepseek-chat'),
  prompt: '...',
  output: Output.object({ schema }),
})
for await (const partial of partialOutputStream) {
  // partial 可能是 { title: '', confidence: 0 } 这种半成品，UI 要能渲染它
}
```

旧 API 对照（读老教程时认得出来就行，别在新代码里用）：
`const { object } = await generateObject({ model, schema, output: 'object' })`

v6+ 的额外好处：结构化输出可以和 tool calling（工具调用）在同一个请求里结合使用。

## 关键 API / 参数
| 名称 | 作用 | 注意点 / 默认值 |
| --- | --- | --- |
| zod schema | 定义输出契约 | `.describe()` 是给模型看的说明文字，直接影响填写质量；嵌套过深会降低生成质量 |
| `Output.object({ schema })` / `Output.array` | AI SDK v6+ 结构化输出入口 | 挂在 `generateText`/`streamText` 上（官方文档已确认两者都存在）；可与工具调用同请求 |
| `NoObjectGeneratedError` | 结构化输出失败错误 | 模型没生成 / 无法解析 / 校验不过时抛出，带 `text`（原始输出）、`finishReason`（如 `length` 截断）、`cause`；文档页面标题写作 `AI_NoObjectGeneratedError`，**import 时的实际导出名以类型提示为准**（本地没装依赖无法从 `.d.ts` 确认）；必须 catch，别假设会被自动重试 |
| `response_format` / strict | 协议层 schema 约束 | strict 模式通常要求字段全部 required + 关闭额外属性；**第三方 OpenAI 兼容实现可能静默忽略该参数**（DeepSeek 等），必须靠本地 zod 兜底 |
| `maxRetries` | 自动重试次数 | 文档原文只有"Maximum number of retries. Set to 0 to disable retries."，**默认 2**；文档**没有**写明它覆盖哪类错误。"只重试传输层（限流/超时/5xx）、不重试 schema 校验失败"是社区通行说法与 SDK 内部 `isRetryable` 行为的推断，属**待实测**，别当官方口径背 |
| `partialOutputStream` | 流式部分对象 | 中间态字段可能为空/数组为 0 项，不要把中间态当最终值提交 |
| `finish_reason: 'length'` | 输出被截断 | JSON 被截断 = 解析必炸；长数组输出要预留足够 max tokens |

## 踩过的坑
- [ ] 用正则从自由文本里抠 JSON → 模型加一句客套话或套代码围栏就炸
- [ ] 把 JSON Mode 当 schema 约束 → 结果是合法 JSON，但字段名和枚举值照样乱来
- [ ] 信任模型输出直接进 DB / 权限判断 → 参数幻觉导致越权（校验必须在应用层）
- [ ] 以为 schema 约束 = 答案正确 → 格式完美、内容编造，是最危险的失败形态
- [ ] schema 设计成深层嵌套 + 超长数组 → 模型生成质量下降且容易被长度截断
- [ ] 照搬 GPT 的 strict structured output 代码到 DeepSeek 等兼容层 → 参数被忽略，静默退回自由文本
- [ ] 流式场景等完整 JSON 才渲染（丢体验），或拿中间态直接落库（丢数据）
- [ ] 没写校验失败分支 → 用户看到空白卡片，日志里什么都没有（会抛 NoObjectGeneratedError 这类错误，必须自己 catch + 降级；别指望 `maxRetries` 替你兜——它是否覆盖这类失败官方未写明，见上表）

## 前端视角类比
<!-- TODO（你来填，这是你的主场）：把"schema 是合同、模型输出是不可信的外部输入"翻译成前端概念。
     给自己三个引导问题，别抄我的答案：
     1) 模型返回的数据和你调用的第三方 REST API 响应，在"可信度"上有什么共同点？你平时怎么防？
     2) partialOutputStream 的中间态，像前端里的什么状态？（提示：受控表单的 onChange 逐字符累积）
     3) strict 模式"所有字段必须 required"这个限制，和 TS 里什么设计约束最像？ -->
- 类比：

## 面试追问
<!-- 答案留给你：下次费曼验收时口头作答，我再评分并把正确答案追加到「费曼问答记录」 -->
- **Q：怎么让模型稳定返回可直接使用的 JSON？请说清你用了哪几层保障。**
  **A：** TODO
- **Q：schema 约束能保证模型不胡说吗？举一个"格式完美但内容错误"的例子和你怎么拦住它。**
  **A：** TODO
- **Q：流式 + 结构化输出（边生成边渲染字段）要注意什么？**
  **A：** TODO
- **Q：工具调用的参数校验和结构化输出是什么关系？**
  **A：** TODO

## 待核实
- 官方文档已确认：`output: Output.object({ schema })` 写法、`generateObject`/`streamObject` 已标 deprecated、流式中间态走 `partialOutputStream`、`maxRetries` 默认 2。
- 官方文档**未确认**：`maxRetries` 到底覆盖哪些错误（不重试 schema 校验失败只是社区通行说法 + SDK 内部 `isRetryable` 行为推断）；错误对象的实际导出符号名（`NoObjectGeneratedError` 还是带 `AI_` 前缀）。
- 两个实测就能定：① 用必然产生坏 JSON 的 prompt 数请求次数；② 装好依赖后看 `import { ` 的自动补全 / 类型提示。你本地 `demos/*/node_modules` 当前不存在，我无法替你从类型定义确认。

## 关联
- 上位概念：[[LLM 核心心智模型]]
- 相关概念：[[Function Calling]]、[[对话消息结构]]、[[RAG 应用评估]]、[[Agent 与 MCP]]、[[Prompt 工程与指令遵循]]、[[上下文管理与窗口预算]]
- 项目实践：[[AI 项目设计]]（01 LLM Behavior Lab、03 Tool Agent Runtime）

## 费曼问答记录
<!-- 每次费曼验收的题目和正确答案追加到此，格式：Q: / A: -->

## 费曼验收
- [ ] 不看笔记能给外行讲清楚
- [ ] 能徒手写出最小可运行 demo
- [ ] 模拟面试中能答出追问
