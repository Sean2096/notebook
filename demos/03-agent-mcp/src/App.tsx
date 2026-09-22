import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, isTextUIPart, isToolUIPart } from 'ai'

export default function App() {
  const [input, setInput] = useState('')

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="app">
      <header>AI 学习助教 · Agent + MCP</header>

      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className={`msg ${message.role}`}>
            {/* 渲染一条消息的所有 parts：文本 part + 工具 part 可能同时存在 */}
            {message.parts.map((part, i) => {
              // 文本 part：demo 01 已掌握
              if (isTextUIPart(part)) {
                return <p key={i}>{part.text}</p>
              }

              // 工具 part：按 AI SDK v7 的状态机渲染调用中、成功和失败三种状态。
              if (isToolUIPart(part)) {
                const toolName = part.type.slice('tool-'.length)
                switch(part.state) {
                  case 'input-streaming':
                  case 'input-available':
                    return <div key={i} className="tool tool-pending">
                      调用工具 {toolName} （{JSON.stringify(part.input ?? {})}）
                    </div>
                  case 'output-error':
                    return <div key={i} className="tool tool-error">{toolName} 失败：{part.errorText}</div>
                  default:
                    return <div key={i} className="tool tool-done">
                      {toolName} {"->"} {JSON.stringify(part.output)}
                    </div>
                }
              }
              return null
            })}
          </div>
        ))}
      </div>

      {error && <div className="error-bar">请求失败：{error.message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="试试：北京天气怎么样？如果下雨帮我订把伞，顺便算下 387 乘 46"
        />
        <button type="submit" disabled={status !== 'ready'}>
          {status !== 'ready' ? '生成中' : '发送'}
        </button>
      </form>
    </div>
  )
}
