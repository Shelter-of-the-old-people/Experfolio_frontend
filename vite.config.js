import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 1. 개발 서버 포트를 3000으로 설정
  server: {
    port: 3000
  }
})