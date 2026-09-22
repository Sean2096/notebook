import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({
  name: 'demo-calculator',
  version: '1.0.0',
})

// calculator 是 MCP Server 暴露给 AI SDK MCP Client 的标准工具。
// 除零时返回 isError: true，而不是抛异常中断 MCP server。
server.tool(
  'calculator',
  '执行精确的四则运算。需要计算加、减、乘、除时使用，避免模型心算出错。',
  {
    a: z.number().describe('第一个数'),
    b: z.number().describe('第二个数'),
    operator: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('运算类型'),
  },
  async ({ a, b, operator }) => {
    let result = a + b
    if (operator === 'subtract') {
      result = a - b
    } else if (operator === 'multiply') {
      result = a * b
    } else if (operator === 'divide') {
if (b === 0) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'divisor should not be zero' }) }],
          isError: true
        }
      }
      result = a / b
    }

    return {
      content: [{ type: 'text', text: JSON.stringify({ result }) }],
    }
  }
)

// 接入 stdio transport，开始监听
const transport = new StdioServerTransport()
await server.connect(transport)
