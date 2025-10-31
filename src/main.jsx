import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// CSS 로드 순서: 토큰 → 리셋 → 전역 → 타이포그래피 → 컴포넌트
import './styles/tokens/primitives.css'     // 1. 변수 정의
import './styles/base/reset.css'           // 2. 브라우저 기본값 리셋
import './styles/base/global.css'          // 3. 전역 기본 설정
import './styles/base/typography.css'      // 4. 타이포그래피 스타일
import './styles/components/button.css'    // 5. 컴포넌트
import './styles/components/textinput.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
