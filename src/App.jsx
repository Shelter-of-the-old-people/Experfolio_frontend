import React from 'react'; // useState 제거
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// 1. useAuth 훅을 임포트합니다.
import { AuthProvider, useAuth } from './contexts'; 
import { PublicLayout, AuthenticatedLayout } from './layouts';
import ProtectedRoute from './components/ProtectedRoute';
import { routes } from './routes';
import StyleGuide from './pages/dev/StyleGuide';

// 페이지 컴포넌트 임포트
import { HomePage, NotFoundPage } from './pages/common';
import { LoginPage, SignupPage } from './pages/auth';
import { SearchPage } from './pages/company';
import { PortfolioPage, PortfolioEditPage } from './pages/student';


function AppRoutes() {
  // 2. AuthContext에서 실제 사용자 정보를 가져옵니다.
  //    (user를 currentUser라는 별칭으로 사용합니다.)
  const { user: currentUser } = useAuth();
  
  // 3. [삭제] App.jsx의 자체적인 로컬 상태를 제거합니다.
  // const [currentUser, setCurrentUser] = useState(null); 
  
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
      
      {/* Company Routes
        (이제 currentUser는 AuthContext의 MOCK_STUDENT_USER입니다) 
      */}
      <Route path={routes.SEARCH} element={
        <ProtectedRoute requiredRole="COMPANY" currentUser={currentUser}>
          <AuthenticatedLayout userRole="COMPANY">
            <SearchPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      {/* Student Routes 
        (currentUser가 MOCK_STUDENT_USER이므로 이 라우트가 정상 동작합니다)
      */}
      <Route path={routes.PORTFOLIO} element={
        <ProtectedRoute requiredRole="STUDENT" currentUser={currentUser}>
          <AuthenticatedLayout userRole="STUDENT">
            <PortfolioPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path={routes.PORTFOLIO_EDIT} element={
        <ProtectedRoute requiredRole="STUDENT" currentUser={currentUser}>
          <AuthenticatedLayout userRole="STUDENT">
            <PortfolioEditPage />
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