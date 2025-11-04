import React from 'react'; // useState 제거
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// 1. useAuth 훅의 import 경로를 수정합니다.
import { AuthProvider } from './contexts'; 
import { useAuth } from './hooks/useAuth'; 
import { PublicLayout, AuthenticatedLayout } from './layouts';
import ProtectedRoute from './components/ProtectedRoute';
import { routes } from './routes';
import StyleGuide from './pages/dev/StyleGuide';

// 페이지 컴포넌트 임포트
import { HomePage, NotFoundPage } from './pages/common';
import { LoginPage, SignupPage } from './pages/auth';
import { SearchPage } from './pages/company';
import { PortfolioPage, PortfolioEditPage, ProfileEditPage } from './pages/student';


function AppRoutes() {
  const { user: currentUser } = useAuth();
  
  
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

      <Route path={routes.SEARCH} element={
        <ProtectedRoute requiredRole="RECRUITER" currentUser={currentUser}>
          <AuthenticatedLayout userRole="RECRUITER">
            <SearchPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      <Route path={routes.SEARCH_RESULTS} element={
        <ProtectedRoute requiredRole="RECRUITER" currentUser={currentUser}>
          <AuthenticatedLayout userRole="RECRUITER">
            <SearchResultsPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      <Route path={routes.TALENT_DETAIL} element={
        <ProtectedRoute requiredRole="RECRUITER" currentUser={currentUser}>
          <AuthenticatedLayout userRole="RECRUITER">
            <SearchProfilePage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      <Route path={routes.PORTFOLIO} element={
        <PublicLayout>
          <PortfolioPage />
        </PublicLayout>
      } />
      

      {/* Common Profile Route */}
      <Route path={routes.PROFILE} element={
        <ProtectedRoute currentUser={currentUser}>
          <AuthenticatedLayout userRole={currentUser?.role}>
            <div>
              {currentUser?.role === 'RECRUITER' ? 
                '기업 정보 수정 페이지' : 
                '학생 정보 수정 페이지'
              }
            </div>
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      <Route path={routes.PORTFOLIO_EDIT} element={
        <ProtectedRoute requiredRole="JOB_SEEKER" currentUser={currentUser}>
          <AuthenticatedLayout userRole="JOB_SEEKER">
            <PortfolioEditPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      <Route path={routes.PROFILE_EDIT} element={
        <ProtectedRoute requiredRole="JOB_SEEKER" currentUser={currentUser}>
          <AuthenticatedLayout userRole="JOB_SEEKER">
            <ProfileEditPage />
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