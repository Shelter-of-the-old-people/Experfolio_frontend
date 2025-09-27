import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// CSS 로드 순서: 토큰 → 리셋 → 컴포넌트
import './styles/tokens/primitives.css'  // 1. 변수 정의
import './styles/base/reset.css'        // 2. 리셋 + 변수 사용
import './styles/components/button.css' // 3. 컴포넌트
import './styles/components/textinput.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
