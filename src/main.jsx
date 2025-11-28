import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './styles/tokens/primitives.css'  
import './styles/base/reset.css'          
import './styles/base/global.css'        
import './styles/base/typography.css'   

import './styles/layouts/Layout.css'
import './styles/components/button.css'    
import './styles/components/textinput.css'
import './styles/components/BusinessNumberInput.css'
import './styles/components/TextEditor.css' 
import './styles/components/FileUpload.css' 
import './styles/components/PortfolioSection.css' 
import './styles/components/profileimageupload.css'
import './styles/components/linkcard.css'
import './styles/components/LayoutSelector.css'
import './styles/components/PortfolioEditor.css'
import './styles/components/SaveStatusIndicator.css'

import './styles/components/NewSearchButton.css'
import './styles/components/BookmarkSection.css'
import './styles/components/CompanySidebar.css'
import './styles/components/SearchQueryIndicator.css'
import './styles/components/SearchBar.css'
import './styles/components/KeywordTag.css'
import './styles/components/SearchResultCard.css'
import './styles/pages/SearchResultsPage.css'
import './styles/pages/SearchPage.css'
import './styles/pages/SearchProfilePage.css'; 

import './styles/pages/PortfolioEditPage.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)