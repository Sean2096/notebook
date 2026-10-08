import fs from 'node:fs/promises'
import path from 'node:path'

export interface DocumentChunk {
  id: string
  text: string
  source: string
  heading: string
  score?: number
}

interface IndexedChunk extends DocumentChunk {
  vector: number[]
}

const VECTOR_SIZE = 128

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function hashToken(token: string) {
  let hash = 0
  for (const char of token) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash % VECTOR_SIZE
}

// Toy embedding：用哈希词袋把文本转成固定维度向量。
// 它只用于演示 RAG 链路，不等价于生产中的 embedding 模型。
function embedText(text: string) {
  const vector = Array.from({ length: VECTOR_SIZE }, () => 0)
  for (const token of tokenize(text)) {
    vector[hashToken(token)] += 1
  }

  const length = Math.hypot(...vector) || 1
  return vector.map(value => value / length)
}

function cosineSimilarity(a: number[], b: number[]) {
  return a.reduce((sum, value, index) => sum + value * b[index], 0)
}

export async function buildIndex() {
  const source = 'company-handbook.md'
  const filePath = path.resolve('docs', source)
  const content = await fs.readFile(filePath, 'utf8')

  // 当前样例按 Markdown 二级标题切 chunk；生产环境还要处理长段落切分和 overlap。
  const sections = content.split(/\n(?=## )/g).filter(section => section.startsWith('## '))

  return sections.map((section, index): IndexedChunk => {
    const [headingLine = '', ...bodyLines] = section.trim().split('\n')
    const heading = headingLine.replace(/^##\s*/, '')
    const text = bodyLines.join('\n').trim()

    return {
      id: `${source}#${index + 1}`,
      source,
      heading,
      text,
      vector: embedText(`${heading}\n${text}`),
    }
  })
}

export function retrieve(question: string, index: IndexedChunk[], topK = 3, minScore = 0): DocumentChunk[] {
  const queryVector = embedText(question)

  // 用余弦相似度排序，并通过阈值和 topK 控制返回结果。
  return index
    .map(chunk => ({
      ...chunk,
      score: cosineSimilarity(queryVector, chunk.vector),
    }))
    .filter(chunk => chunk.score > minScore)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, topK)
}

export function formatContext(chunks: DocumentChunk[]) {
  // 为每个 chunk 加入稳定的来源编号，供模型回答时引用。
  return chunks
    .map((chunk, index) => [
      `[${index + 1}] 来源: ${chunk.source} / ${chunk.heading}`,
      chunk.text,
    ].join('\n'))
    .join('\n\n')
}
