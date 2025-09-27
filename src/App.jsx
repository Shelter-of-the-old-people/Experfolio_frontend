import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts';
import { PublicLayout, AuthenticatedLayout } from './layouts';
import ProtectedRoute from './components/ProtectedRoute';
import { routes } from './routes';
import StyleGuide from './pages/dev/StyleGuide';

// 임시 페이지 컴포넌트들
const HomePage = () => (
  <div className="home-page">
    <div className="hero-section">
      <h1>AI 기반 채용 플랫폼</h1>
      <p>학생과 기업을 연결하는 스마트한 채용 솔루션</p>
      <div className="cta-buttons">
        <a href="/signup/student" className="btn btn-black">학생 회원가입</a>
        <a href="/signup/company" className="btn btn-trans">기업 회원가입</a>
      </div>
    </div>
  </div>
);

const LoginPage = () => (
  <div className="login-page">
    <div className="login-container">
      <h1>로그인</h1>
      <p>로그인 폼이 여기에 표시됩니다.</p>
    </div>
  </div>
);

const SignupPage = () => (
  <div className="signup-page">
    <div className="signup-container">
      <h1>회원가입</h1>
      <p>가입하실 계정 유형을 선택해주세요</p>
      <div className="signup-options">
        <a href="/signup/student" className="signup-card">
          <h3>학생</h3>
          <p>포트폴리오를 등록하고 기업에 어필하세요</p>
        </a>
        <a href="/signup/company" className="signup-card">
          <h3>기업</h3>
          <p>AI 검색으로 최적의 인재를 찾아보세요</p>
        </a>
      </div>
    </div>
  </div>
);

const SearchPage = () => (
  <div className="search-page">
    <h1>인재 검색</h1>
    <div className="search-container">
      <p>검색 인터페이스가 여기에 표시됩니다.</p>
    </div>
  </div>
);

const PortfolioPage = () => (
  <div className="portfolio-page">
    <h1>내 포트폴리오</h1>
    <div className="portfolio-content">
      <p>포트폴리오 내용이 표시됩니다.</p>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="error-page">
    <h1>404</h1>
    <p>페이지를 찾을 수 없습니다.</p>
    <a href="/" className="btn btn-black">홈으로 돌아가기</a>
  </div>
);

function AppRoutes() {
  const [currentUser, setCurrentUser] = useState(null);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={routes.HOME} element={
        <PublicLayout>
          <HomePage />
        </PublicLayout>
      } />
      
      <Route path={routes.LOGIN} element={
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      } />
      
      <Route path={routes.SIGNUP} element={
        <PublicLayout>
          <SignupPage />
        </PublicLayout>
      } />
      
      <Route path={routes.SIGNUP_COMPANY} element={
        <PublicLayout>
          <div>기업 회원가입 페이지 (구현 예정)</div>
        </PublicLayout>
      } />
      
      <Route path={routes.SIGNUP_STUDENT} element={
        <PublicLayout>
          <div>학생 회원가입 페이지 (구현 예정)</div>
        </PublicLayout>
      } />
      
      {/* Company Routes */}
      <Route path={routes.SEARCH} element={
        <ProtectedRoute requiredRole="COMPANY" currentUser={currentUser}>
          <AuthenticatedLayout userRole="COMPANY">
            <SearchPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      {/* Student Routes */}
      <Route path={routes.PORTFOLIO} element={
        <ProtectedRoute requiredRole="STUDENT" currentUser={currentUser}>
          <AuthenticatedLayout userRole="STUDENT">
            <PortfolioPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      {/* Common Profile Route */}
      <Route path={routes.PROFILE} element={
        <ProtectedRoute currentUser={currentUser}>
          <AuthenticatedLayout userRole={currentUser?.role}>
            <div>
              {currentUser?.role === 'COMPANY' ? 
                '기업 정보 수정 페이지' : 
                '학생 정보 수정 페이지'
              }
            </div>
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      {/* Dev Routes */}
      <Route path={routes.STYLE_GUIDE} element={<StyleGuide />} />
      
      {/* Error Routes */}
      <Route path={routes.NOT_FOUND} element={
        <PublicLayout>
          <NotFoundPage />
        </PublicLayout>
      } />
      
      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to={routes.NOT_FOUND} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;