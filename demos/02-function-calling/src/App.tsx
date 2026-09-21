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
      <header>AI 学习助教 · Function Calling</header>

      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className={`msg ${message.role}`}>
            {/* 渲染一条消息的所有 parts：文本 part + 工具 part 可能同时存在 */}
            {message.parts.map((part, i) => {
              // 文本 part：demo 01 已掌握
              if (isTextUIPart(part)) {
                return <p key={i}>{part.text}</p>
              }

              // ============================================================
              // TODO: 渲染工具 part（isToolUIPart）
              // 静态工具 part 的结构（v7）：
              //   part.type 形如 'tool-getWeather'（工具名编码在 type 里）
              //   part.state 状态机：
              //     'input-streaming'  模型还在生成参数
              //     'input-available'  参数已完整，工具执行中…
              //     'output-available' 执行完成，结果在 part.output
              //     'output-error'     执行失败，错误在 part.errorText
              //   part.input  是模型给出的参数（如 { city: '北京' }）
              //
              // 要求：
              // 1. 用 isToolUIPart(part) 判断
              // 2. 工具名 = part.type.slice('tool-'.length)
              // 3. 按状态渲染（className 已在 index.css 备好）：
              //    - input-streaming / input-available：
              //        <div className="tool tool-pending">
              //          调用工具 {工具名}（{JSON.stringify(part.input ?? {})}）…
              //        </div>
              //    - output-available：
              //        <div className="tool tool-done">
              //          {工具名} → {JSON.stringify(part.output)}
              //        </div>
              //    - output-error：
              //        <div className="tool tool-error">
              //          {工具名} 失败：{part.errorText}
              //        </div>
              // 提示：状态是可辨识联合，直接 switch (part.state) 即可窄化类型
              // ============================================================
              if (isToolUIPart(part)) {
                const toolName = part.type.slice('tool-'.length)
                switch(part.state) {
                  case 'input-streaming':
                  case 'input-available':
                    return <div className="tool tool-pending">
                      调用工具 {toolName} （{JSON.stringify(part.input ?? {})}）
                    </div>
                  case 'output-error':
                    return <div className="tool tool-error">{toolName} 失败：{part.errorText}</div>
                  default:
                    return <div className="tool tool-done">
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
          placeholder="试试：北京今天天气怎么样？"
        />
        <button type="submit" disabled={status !== 'ready'}>
          {status !== 'ready' ? '生成中' : '发送'}
        </button>
      </form>
    </div>
  )
}
