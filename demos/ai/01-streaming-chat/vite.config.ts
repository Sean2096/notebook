import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 前端 /api 请求代理到本地 Express 后端（8787），避免跨域
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
