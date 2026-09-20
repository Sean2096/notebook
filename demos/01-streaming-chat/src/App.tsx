import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, isTextUIPart } from 'ai'

export default function App() {
  const [input, setInput] = useState('')

  // TODO 1: 调用 useChat
  // - transport: new DefaultChatTransport({ api: '/api/chat' })
  // - 能解构出 messages（消息列表）、sendMessage（发送）、status（状态：ready / submitted / streaming）
  const { messages, sendMessage, status } = useChat({ transport: new DefaultChatTransport({ api: '/api/chat' }) })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    // TODO 2: 发送消息。v7 的签名是 sendMessage({ text: input })，发送后清空输入框
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="app">
      <header>AI 学习助教 · Streaming Chat</header>

      <div className="messages">
        {/* TODO 3: 渲染 messages
            每条 message 有 role（'user' | 'assistant'）和 parts 数组。
            用 isTextUIPart(part) 过滤出文本片段，拼接 part.text 显示。
            className 用 `msg ${message.role}`。 */}
        {messages.map(message => {

          return (
            <div key={message.id} className={`msg ${message.role}`}>
              <p>{message.parts.filter(isTextUIPart).map(part => part.text).join('')}</p>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="问点什么，观察逐字流式输出…"
        />
        {/* TODO 4（加分项）：streaming 时禁用发送按钮，文案改为"生成中…" */}
        <button type="submit" disabled={status !== 'ready'}>{ status !== 'ready' ? '生成中'  : '发送' }</button>
      </form>
    </div>
  )
}
