import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// CSS 로드 순서: 토큰 → 리셋 → 전역 → 타이포그래피 → 컴포넌트 → 페이지
import './styles/tokens/primitives.css'     // 1. 변수 정의
import './styles/base/reset.css'           // 2. 브라우저 기본값 리셋
import './styles/base/global.css'          // 3. 전역 기본 설정
import './styles/base/typography.css'      // 4. 타이포그래피 스타일

// 5. 컴포넌트 스타일
import './styles/components/button.css'    
import './styles/components/textinput.css'
import './styles/components/BusinessNumberInput.css'
import './styles/components/TextEditor.css' 
import './styles/components/FileUpload.css' 
import './styles/components/PortfolioSection.css' 
import './styles/components/LayoutSelector.css'
import './styles/components/PortfolioEditor.css'

// 6. 페이지별 스타일
import './styles/pages/PortfolioEditPage.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)