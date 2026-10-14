import express from 'express'
import path from 'node:path'
import { createOpenAI } from '@ai-sdk/openai'
import {
  streamText,
  convertToModelMessages,
  pipeUIMessageStreamToResponse,
  tool,
  stepCountIs,
  type UIMessage,
} from 'ai'
import { createMCPClient } from '@ai-sdk/mcp'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { z } from 'zod'

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

// ============================================================================
// 本地工具 1：getWeather（从 demo 02 复用，mock 数据）
// ============================================================================
const getWeather = tool({
  description: '查询指定城市的当前天气（温度、天气状况、湿度）。当用户询问某城市天气时使用。',
  inputSchema: z.object({
    city: z.string().describe('城市名, 如：北京'),
  }),
  execute: async ({ city }) => ({
    city,
    temperatureC: 26,
    // 为了让 demo 能演示"下雨 → 订伞"分支，你可以把 condition 改成 'rain' 观察效果
    condition: 'rain',
    humidity: 88,
  }),
})

// 本地工具 2：orderUmbrella（订伞），用于演示 Agent 多步工具串联。
const orderUmbrella = tool({
  description: '为指定城市订购一把雨伞。当用户所在城市正在下雨，且用户需要雨伞时使用。',
  inputSchema: z.object({
    city: z.string().describe('收货城市'),
  }),
  execute: async ({ city }) => {
    return { orderId: `UMB-${Date.now()}`, city, status: 'ordered' }
  }
})

// ============================================================================
// MCP 接入：启动时连接我们自己写的 MCP server（stdio 子进程）
// ============================================================================
let mcpTools: Awaited<ReturnType<Awaited<ReturnType<typeof createMCPClient>>['tools']>>

async function connectMcp() {
  // stdio transport：spawn 一个子进程跑 mcp-server/index.ts
  const transport = new StdioClientTransport({
    // 直接用项目里的 tsx 可执行文件，避免依赖全局 npx
    command: path.resolve('node_modules/.bin/tsx'),
    args: ['mcp-server/index.ts'],
  })

  // 对照概念：MCP = USB-C。这里 client 不需要提前知道 server 有什么工具，
  // client.tools() 会"发现"并转换——server 以后加新工具，这里代码不用改。
  const client = await createMCPClient({ transport })
  mcpTools = await client.tools()
}

await connectMcp()

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const { messages }: { messages: UIMessage[] } = req.body

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: [
        '你是 AI 学习助教。',
        '- 问天气：调用 getWeather。',
        '- 天气为 rain 且用户需要伞：调用 orderUmbrella 帮用户订购。',
        '- 需要精确计算：调用 calculator 工具，不要自己心算。',
        '- 每一步工具结果都要先读取，再决定下一步。',
      ].join('\n'),

      messages: await convertToModelMessages(messages),

      tools: {
        getWeather,
        orderUmbrella,
        ...mcpTools,
      },
      stopWhen: stepCountIs(5)
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

app.listen(8787, () => {
  console.log('API server: http://localhost:8787')
})
