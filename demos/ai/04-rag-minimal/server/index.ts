import express from 'express'
import { createOpenAI } from '@ai-sdk/openai'
import {
  streamText,
  convertToModelMessages,
  pipeUIMessageStreamToResponse,
  type UIMessage,
  createUIMessageStream,
} from 'ai'
import { buildIndex, formatContext, retrieve } from './rag.js'

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

const app = express()
app.use(express.json())

const index = await buildIndex()

app.get('/api/chunks', (_req, res) => {
  res.json({
    chunks: index.map(({ vector: _vector, ...chunk }) => chunk),
  })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages }: { messages: UIMessage[] } = req.body
    const lastUserMessage = [...messages].reverse().find(message => message.role === 'user')
    const question = lastUserMessage?.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('\n')
      .trim()

    if (!question) {
      return res.status(400).json({ error: 'missing question' })
    }

    const chunks = retrieve(question, index, 3)
    if (chunks.length === 0) {
      const stream = createUIMessageStream({
        execute({ writer }) {
          const textId = 'retrieval-refusal'
          writer.write({ type: 'text-start', id: textId })
          writer.write({ type: 'text-delta', id: textId, delta: '知识库中没有找到相关信息。' })
          writer.write({ type: 'text-end', id: textId })
        }
      })

      return pipeUIMessageStreamToResponse({
        stream,
        response: res,
      })
    }
    const context = formatContext(chunks)

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: [
        '你是企业内部知识库问答助手。',
        '必须只基于 <context> 中的信息回答。',
        '如果上下文没有相关内容，直接说“知识库中没有找到相关信息”。',
        '回答最后必须列出来源，格式为“来源：[1] 标题”。',
        '',
        '<context>',
        context,
        '</context>',
      ].join('\n'),
      messages: await convertToModelMessages(messages),
    })

    return pipeUIMessageStreamToResponse({
      stream: result.toUIMessageStream(),
      response: res,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    })
  }
})

app.listen(8788, () => {
  console.log('API server: http://localhost:8788')
  console.log(`RAG index ready: ${index.length} chunks`)
})
