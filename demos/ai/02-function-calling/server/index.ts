import express from 'express'
import { createOpenAI } from '@ai-sdk/openai'
import {
  streamText,
  convertToModelMessages,
  pipeUIMessageStreamToResponse,
  tool,
  stepCountIs,
  type UIMessage,
} from 'ai'
import { z } from 'zod'

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

const app = express()
app.use(express.json())

// ============================================================================
// TODO 1: 定义 getWeather 工具
// 用 tool({...}) 定义，三个字段：
//   - description: 告诉模型"什么场景该调这个工具"，写清楚（模型靠它选工具）
//   - inputSchema: z.object({ city: z.string().describe('城市名，如：北京') })
//                  —— 这就是概念卡里说的"参数 schema 校验"，
//                     模型给出的参数不匹配时 SDK 直接拦截，不会进 execute
//   - execute: async ({ city }) => { ... }
//                  学习项目不接真实天气 API，直接 mock 返回：
//                  { city, temperatureC: 26, condition: '晴', humidity: 40 }
//
// 注意：真实项目里 execute 内还要做鉴权（当前用户能不能查）、错误分类处理，
// 本 demo 先省略，但你要知道这是应用层责任，不是模型的责任。
// ============================================================================
const getWeather = tool({
  description: '查询指定城市的当前天气（温度、天气状况、湿度）。当用户询问某城市天气时使用。', // TODO
  inputSchema: z.object({
    // TODO: city 字段
    city: z.string().describe('城市名, 如：北京')
  }),
  // TODO: execute
  execute: async ({ city }) => ({
    city, temperatureC: 26, condition: '晴', humidity: 40
  })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages }: { messages: UIMessage[] } = req.body

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system:
        '你是 AI 学习助教。用户问天气时必须调用 getWeather 工具，基于工具返回的数据回答，不要编造天气。',

      messages: await convertToModelMessages(messages),

      // ====================================================================
      // TODO 2: 注册工具并开启"工具循环"
      //   tools: { getWeather },
      //   stopWhen: stepCountIs(2),
      //
      // 为什么是 2？v7 默认 stepCountIs(1)：模型调完工具拿到结果就停，
      // 不会生成最终自然语言回复。设成 2 = 允许"第 1 步调工具 → 第 2 步生成回答"。
      // ====================================================================
      tools: { getWeather },
      stopWhen: stepCountIs(2),
    })

    return pipeUIMessageStreamToResponse({
      stream: result.toUIMessageStream(),
      response: res,
    })
  } catch (error) {
    // TODO 3: 错误处理（demo 01 欠下的债，这个 demo 强制要求）
    // 用 console.error 打印 error
    // 用 res.status(500).json({ error: '...' }) 返回错误，
    // 前端 useChat 才能在 onError 里收到，而不是拿到一个挂掉的流
    console.error(error)
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
})

app.listen(8787, () => {
  console.log('API server: http://localhost:8787')
})
