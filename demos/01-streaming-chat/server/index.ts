import express from 'express'
import { createOpenAI } from '@ai-sdk/openai'
import {
  streamText,
  convertToModelMessages,
  pipeUIMessageStreamToResponse,
  type UIMessage,
} from 'ai'

// DeepSeek 提供 OpenAI 兼容接口：baseURL 指向 DeepSeek，模型名用 deepseek-chat
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  // 前端发来的是 UIMessage[]（parts 结构），需要转成模型认识的 messages
  const { messages }: { messages: UIMessage[] } = req.body
  
  const result = streamText({
    model: deepseek('deepseek-chat'),

    // TODO 1: 加一段 system prompt，让模型扮演"AI 学习助教"，回答简洁（3 句话以内）
    system: '你是AI 学习助教，你的作用是回答用户提出的问题。',

    // TODO 2: 把前端的 UIMessage[] 转成 ModelMessage[] 传入
    // 提示：上面已经 import 了 convertToModelMessages
    messages: await convertToModelMessages(messages),
  })

  // TODO 3: 把 UI 消息流通过 HTTP 响应返回给前端
  // 提示：result.toUIMessageStream() 得到流，用 pipeUIMessageStreamToResponse(流, res) 写出
  // v7 签名：单参数对象 { response, stream }
  return pipeUIMessageStreamToResponse({
    stream: result.toUIMessageStream(),
    response: res,
  })
})

app.listen(8787, () => {
  console.log('API server: http://localhost:8787')
})
