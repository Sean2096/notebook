import { useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, isTextUIPart } from 'ai'

interface ChunkPreview {
  id: string
  text: string
  source: string
  heading: string
}

export default function App() {
  const [input, setInput] = useState('')
  const [chunks, setChunks] = useState<ChunkPreview[]>([])

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  useEffect(() => {
    fetch('/api/chunks')
      .then(response => response.json())
      .then(data => setChunks(data.chunks ?? []))
      .catch(() => setChunks([]))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="app">
      <header>AI 学习助教 · RAG 最小链路</header>

      <aside className="knowledge">
        <h2>知识库 chunks</h2>
        {chunks.map(chunk => (
          <section key={chunk.id} className="chunk">
            <h3>{chunk.heading}</h3>
            <p>{chunk.text}</p>
            <span>{chunk.source}</span>
          </section>
        ))}
      </aside>

      <main className="chat">
        <div className="messages">
          {messages.map(message => (
            <div key={message.id} className={`msg ${message.role}`}>
              {message.parts.map((part, index) => {
                if (isTextUIPart(part)) {
                  return <p key={index}>{part.text}</p>
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
            placeholder="试试：错误码 E1024 怎么解决？"
          />
          <button type="submit" disabled={status !== 'ready'}>
            {status !== 'ready' ? '生成中' : '发送'}
          </button>
        </form>
      </main>
    </div>
  )
}
