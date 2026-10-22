---
type: reference
domain: AI
topic: AI 技术岗位与求职定位
created: 2026-10-22
research_date: 2026-10-22
tags:
  - 求职
  - 岗位调研
---

# AI 技术岗位调研

## 结论与适用范围

对已有 TypeScript、React、Node.js 背景的前端工程师，建议主攻 **AI（Artificial Intelligence，人工智能）应用前端／Agent（智能体）产品工程**，次选 AI 全栈与大模型应用开发。理由是这些方向可复用既有产品交付能力，再补模型交互、工具编排、检索、评测和服务端工程。该优先级是针对个人背景的判断，不是岗位数量或录用概率排名。

研究以中国大陆社会招聘为主，海外公司作为能力要求的对照。检索与读取日期为 2026-10-22；城市、学历、工作年限、薪资预期及每周可投入时间尚未确认。配套方案见 [[AI 零基础求职课程]] 与 [[AI 项目设计]]。

## 术语速查

- LLM（Large Language Model，大语言模型）：生成和理解语言的模型。
- RAG（Retrieval-Augmented Generation，检索增强生成）：先检索资料，再基于资料生成回答。
- MCP（Model Context Protocol，模型上下文协议）：应用与工具／资源服务交换上下文的协议。
- Function Calling（函数调用）：模型提出结构化工具调用，由应用校验并执行。
- Embedding（嵌入向量）：把文本等内容编码成可比较的数值向量。
- Prompt Engineering（提示词工程）：设计输入、任务约束与示例，并用评测验证效果。
- FDE（Forward Deployed Engineer，前线部署工程师）：深入客户场景完成技术方案和应用交付的工程师。
- SSE（Server-Sent Events，服务器推送事件）：服务端向客户端持续推送事件的机制。
- Schema（数据结构约束）：约定字段、类型与合法值的规则。
- Infra（Infrastructure，基础设施）；RL（Reinforcement Learning，强化学习）。
- PyTorch：常用深度学习框架；LangChain：大模型应用框架；Electron／Tauri：桌面端应用技术。

## 方法与证据边界

本次读取了 **11 个具体岗位正文**：字节跳动 2 个、腾讯及其子公司 3 个、Anthropic 4 个、猎聘猎头职位 1 个、企查查转载职位 1 个。前 9 个来自雇主官方招聘页或官方链接指向的招聘系统；后 2 个用于补充，来源等级较低。这是目的性样本，偏向大模型应用及前端转型，不代表整体 AI 就业市场。

记录岗位页面中的职责和硬条件；区分雇主原文、跨来源共性、个人路线建议。不同页面未必披露发布日期，查询日不等于发布日期，页面可访问也不保证岗位仍有实际招聘名额。未将搜索摘要当作已核实岗位正文，未用聚合页条数估算市场需求。

证据标签：`[CONFIRMED]` 表示核心判断得到至少三个独立雇主或发布主体支持；`[MAJORITY]` 表示多个来源支持但不足三个独立主体；`[SINGLE-SOURCE]` 表示单个来源的岗位事实。课程中的课时、题量和验收线均为教学设计，不是招聘统计。

## 岗位方向对照

| 方向 | 主要产出 | 需要补的能力 | 个人优先级 | 岗位依据 |
| --- | --- | --- | --- | --- |
| AI 应用前端／Agent 前端 | 对话、任务状态、工具结果、引用、人工确认等产品界面 | 流式协议、长任务状态、上下文、异常恢复、模型输出校验 | P0 立刻做：最直接复用前端经验 | 字节 Aime、富兰瓦时 [cite:1][cite:11] |
| AI 全栈／产品工程 | 从界面到服务端、数据与权限的完整产品 | 数据库、鉴权、后台任务、观测、部署与评测 | P0 主线的扩展：提高作品完整度 | Anthropic Full-stack；猎聘应用岗 [cite:6][cite:10] |
| 大模型应用／Agent 后端 | 检索问答、工具编排、企业系统集成 | Python 或岗位指定后端语言、检索评测、调度、状态持久化 | P1 近期：有条件扩展岗位池 | 字节泛抖音、腾讯 Agent 服务岗、猎聘 [cite:2][cite:3][cite:10] |
| AI 解决方案／FDE | 客户需求拆解、试点、上线和业务价值验证 | 端到端交付、客户沟通、场景评测、培训与部署 | P1 条件路线：适合喜欢业务沟通且已有交付经验者 | 腾讯云智、Anthropic Applied AI [cite:4][cite:7] |
| AI 应用评测／质量工程 | 任务测试集、失败分析、回归评测与质量报告 | 标注、指标、实验设计、评测自动化 | P1 作为必修能力；独立转岗需另查应用层岗位 | 腾讯 Agent 岗内评测职责；模型评测岗作边界对照 [cite:3][cite:8] |
| 模型算法／研究工程 | 预训练、后训练、模型实验与能力优化 | 深度学习、数学、PyTorch、论文实验与训练经验 | P2 进阶：当前学习材料不足以支撑此路线 | Anthropic Pre-training [cite:9] |
| AI 训练／推理基础设施 | 分布式训练、推理性能、资源调度和底层优化 | 系统编程、训练框架源码、硬件与分布式计算 | P2 进阶：需独立课程及项目 | 腾讯训练与强化学习基础设施岗 [cite:5] |

这里的“应用评测”与“模型研究评测”不是同一岗位。为自己的问答应用建测试集，是应用工程必修；评估大型模型训练过程还要求更深的机器学习与实验背景。[cite:3][cite:8]

## 招聘样本及可核实要求

每行是 `[SINGLE-SOURCE]` 的岗位事实；“对求职的意义”属于分析。

| 编号 | 公司／岗位／地点 | 正文明确的门槛或职责 | 对求职的意义 |
| --- | --- | --- | --- |
| 1 | 字节：AI应用前端工程师-Aime；杭州 | 本科及以上；JavaScript/TypeScript、React/Vue；复杂任务界面、流式输出、异常恢复；Electron/Tauri 等桌面端经验；AI 交互、MCP 等作为优先经验 [cite:1] | 前端基础可以迁移，但这一具体岗位的桌面端要求需要额外准备 |
| 2 | 字节：Agent开发工程师（前端）-泛抖音；北京／成都 | 本科及以上；熟练 Python、完整 Agent 独立开发落地经验、LangChain、向量检索、规划和记忆 [cite:2] | 标题写前端，职责仍偏应用编排；仅 TypeScript 项目不覆盖其明确要求 |
| 3 | 腾讯：策略算法工程师；深圳 | 本科及以上、三年以上；Go/Python 至少一种；Agent 调度、状态、异常恢复；任务成功率、成本、延迟及失败分析 [cite:3] | 标题写算法，但有明显的应用工程职责；需继续核实面试是否包含模型训练 |
| 4 | 腾讯云智：AI前线部署工程师；武汉 | 本科及以上；3 年以上企业项目交付、2 年以上大模型深度应用；至少 2 个完整 Agent、1 个生产级检索知识库；精通 Python [cite:4] | 属子公司编制，经验门槛明显；两个学习项目不能替代生产交付年限 |
| 5 | 腾讯：微信-AI Infra工程师-大模型训练与RL方向；北京 | Python、系统编程；分布式训练原理；训练框架源码开发和定制、强化学习基础设施 [cite:5] | 与应用开发的能力树明显不同 |
| 6 | Anthropic：Senior Software Engineer, Full-stack；美国多城市 | 至少 6 年实用全栈经验；React/TypeScript；复杂产品、性能、可靠性、跨团队交付 [cite:6] | 说明模型公司也需要产品工程；不能把资深岗位当作转型入门门槛 |
| 7 | Anthropic：Applied AI Engineer, Enterprise Tech；美国多城市 | 4 年以上技术经验；Python 或 TypeScript；生产级大模型应用、Agent、评测、MCP、客户沟通 [cite:7] | TypeScript 有明确适用岗位；客户交付与模型应用工程同样重要 |
| 8 | Anthropic：Research Engineer, Post-Training Model Evaluations；美国 | 大规模模型评测设计与分析、Python、生产系统；统计与实验设计为加分 [cite:8] | 模型评测研究岗不能与普通应用测试混同 |
| 9 | Anthropic：Research Engineer/Research Scientist, Pre-training；美国 | 招聘 Qualifications 列出相关硕士或博士、Python/PyTorch、大规模机器学习与科学实验；页尾通用教育字段另允许同等经验 [cite:9] | 页面教育表述存在层级差异，但研究与训练经验要求清晰 |
| 10 | 猎聘：AI Agent／大模型应用开发工程师；北京，猎头发布 | Python 或 Java 后端；工具调用、检索、效果评估与部署；React/TypeScript 为加分；明确接受部分个人项目经验 [cite:10] | 能作为转型岗位线索；用人企业未明确，需核实招聘主体 |
| 11 | 富兰瓦时：前端高级工程师（AI Agent方向）；深圳，企查查转载 | 本科、5 年以上前端；React/TypeScript；流式交互、工具可视化、人工确认、中断、上下文和失败模式 [cite:11] | 是大厂之外的前端转型样本；原始招聘入口及有效性仍待核实 |

猎聘样本存在字段冲突：页面头部写“5–10 年、学历不限”，正文写“原则上 2 年以上、大专及以上，可放宽”。这条只能作为线索，不能直接按宽松正文判断自己满足条件。[cite:10]

## 从岗位要求到能力结论

### 应用岗位重视完整交付

`[CONFIRMED]` 在字节、腾讯及 Anthropic 三个独立雇主的样本中，要求均超出模型接口调用，涉及完整应用、稳定性、评测或产品交付。[cite:1][cite:3][cite:7]

因此，作品应能回答：服务如何处理失败？工具调用如何控制？检索结果是否支持答案？如何记录质量、耗时和成本？仅展示一段成功的聊天截图，难以覆盖这些职责。

### 前端价值包含过程交互

`[MAJORITY]` 字节 Aime 和富兰瓦时样本共同强调流式输出、工具过程展示、人工确认和中断，而非只有最终文本。[cite:1][cite:11] Anthropic 全栈岗另外强调产品体验、性能、可访问性和可靠性，但不能据此推断其每个团队都要求同一套 Agent 界面。[cite:6]

课程应保留 React 状态管理、浏览器性能和工程化训练，增加任务进度、取消、失败恢复和可追溯结果。桌面端、本地系统操作作为职位指定分支。

### Python 的优先级随岗位变化

`[CONFIRMED]` 语言条件存在岗位差异：字节泛抖音和腾讯 Agent 服务岗明确要求 Python 或 Go，Anthropic Applied AI 明确接受 Python 或 TypeScript。[cite:2][cite:3][cite:7]

针对前端主线，先用 TypeScript 完成作品；针对明确要求 Python 的职位，再完成 Python 服务与编排分支。不能用“AI 一定要 Python”或“TypeScript 足够所有岗位”代替阅读职位正文。

### 评测既是要求，也是作品证据

`[CONFIRMED]` 腾讯、Anthropic Applied AI 和猎聘应用岗均明确涉及评测或输出质量优化。[cite:3][cite:7][cite:10] OpenAI 官方评测指南也建议按任务设计测试、结合人工判断、持续评估，并反对“感觉能用”的验收方式。[cite:12]

教学项目要用真实文档标注问题，分别评估检索、答案、拒答和工具任务结果。小测试集只证明在该集合上的行为，不能包装成生产质量或全市场通用标准。

## 当前学习基础与项目计划

旧版四个 Demo 及项目复盘已清空。以下概念卡状态来自仓库记录，本次研究没有重新考核学习者。

| 学习基础 | 当前记录 | 下一步 |
| --- | --- | --- |
| [[RAG 全链路]] | 状态“需复习”，曾混淆教学实现与完整链路 | 闭卷说明实际实现、缺失项及设计理由 |
| [[RAG 应用评估]]、[[结构化输出与 Schema 校验]]、[[上下文管理与窗口预算]] | 状态“学习中” | 实践与费曼验收，不能按已掌握排课 |
| [[AI 项目设计]] | 三个概念实验与一个综合作品尚未实现 | 按课程顺序创建，达到里程碑后再写项目复盘 |

最优先任务是从 `01-llm-behavior-lab` 开始建立可重复实验，再逐步进入检索、工具和综合作品。现有卡片状态保持原记录；本次岗位调研不能作为费曼通过或工程验收。

## 求职定位与选岗规则

建议简历定位为“前端工程师，具备大模型应用开发能力”，突出原有工程经验与可展示的 AI 作品。AI 全栈版简历须补充真实服务端、数据库、评测和部署实践。个人项目应明确标注“个人项目”，不要写成生产系统经历。

优先搜索：AI 应用前端、AI Agent 前端、智能体前端、AI 全栈、AI 产品工程师、大模型应用开发。再按职位正文筛选：

1. **先筛硬条件**：工作地点、学历、年限、编制与工作方式。
2. **再筛核心职责**：产品界面、应用编排、客户交付、模型研究或基础设施。
3. **最后映射作品**：每条关键职责能否给出代码、演示、测量结果和设计解释。

“熟悉”与“加分”不必逐条全满；“精通指定语言”“已有生产交付”“训练框架源码开发”则不能靠聊天演示替代。课程应随实际目标职位调整。

## 研究未解决的问题

没有代表性岗位数量统计，因此不作“哪类岗位最多”“哪类最好找”的结论。未建立同城市、同年限的薪资对照，故不估计个人可获得薪资。样本集中于文本大模型应用，未深入覆盖计算机视觉、语音、机器人和传统机器学习岗位。

下一轮定位最需要补充：前端工作年限、学历、目标城市、期望投递时间及每周学习时长。现阶段按国内社招、保留前端优势、每周 10–12 小时设计课程。

## 来源

以下链接均在 2026-10-22 读取正文。文中编号为本报告的来源登记号。

- <a id="cite-1"></a>[cite:1] [字节跳动：AI应用前端工程师-Aime](https://jobs.bytedance.com/experienced/position/detail/7650040731169081605)，官方岗位页。
- <a id="cite-2"></a>[cite:2] [字节跳动：Agent开发工程师（前端）-泛抖音](https://jobs.bytedance.com/experienced/position/7233297105849665849/detail)，官方岗位页。
- <a id="cite-3"></a>[cite:3] [腾讯：策略算法工程师，Agent 工程方向](https://hr.tencent.com/m/jobdesc.html?postId=1915242132004782080)，官方岗位页，正文更新于 2026-10-13。
- <a id="cite-4"></a>[cite:4] [腾讯云智：AI前线部署工程师](https://hr.tencent.com/jobdesc.html?postId=2041772169679241216)，官方岗位页，正文更新于 2026-10-08。
- <a id="cite-5"></a>[cite:5] [腾讯：微信-AI Infra工程师-大模型训练与RL方向](https://hr.tencent.com/jobdesc.html?postId=2037411500376879104)，官方岗位页，正文更新于 2026-10-12。Infra 为 Infrastructure（基础设施），RL 为 Reinforcement Learning（强化学习）。
- <a id="cite-6"></a>[cite:6] [Anthropic：Senior Software Engineer, Full-stack](https://job-boards.greenhouse.io/anthropic/jobs/5174743008)，官方招聘系统。
- <a id="cite-7"></a>[cite:7] [Anthropic：Applied AI Engineer, Enterprise Tech](https://job-boards.greenhouse.io/anthropic/jobs/5057647008)，官方招聘系统。
- <a id="cite-8"></a>[cite:8] [Anthropic：Research Engineer, Post-Training Model Evaluations](https://job-boards.greenhouse.io/anthropic/jobs/5198255008)，官方招聘系统。
- <a id="cite-9"></a>[cite:9] [Anthropic：Research Engineer/Research Scientist, Pre-training](https://job-boards.greenhouse.io/anthropic/jobs/4616971008)，官方招聘系统。
- <a id="cite-10"></a>[cite:10] [猎聘：AI Agent／大模型应用开发工程师](https://www.liepin.com/a/80416507.shtml)，猎头发布，招聘主体及条件冲突待核实。
- <a id="cite-11"></a>[cite:11] [企查查：富兰瓦时前端高级工程师（AI Agent方向）](https://m.qcc.com/jobdetail/25648be2a74db4779eaa06e33bdece78.html)，转载页，显示 2026-07-28。
- <a id="cite-12"></a>[cite:12] [OpenAI：Evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices)，官方应用评测指南。
