import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts';
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
      
      {/* <Route path={routes.SIGNUP_COMPANY} element={
        <PublicLayout>
          <CompanySignupPage />
        </PublicLayout>
      } /> */}
      
      {/* <Route path={routes.SIGNUP_STUDENT} element={
        <PublicLayout>
          <StudentSignupPage />
        </PublicLayout>
      } /> */}
      
      {/* Company Routes */}
      <Route path={routes.SEARCH} element={
        <ProtectedRoute requiredRole="COMPANY" currentUser={currentUser}>
          <AuthenticatedLayout userRole="COMPANY">
            <SearchPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      {/* Student Routes */}
      {/* <Route path={routes.PORTFOLIO} element={
        <ProtectedRoute requiredRole="STUDENT" currentUser={currentUser}>
          <AuthenticatedLayout userRole="STUDENT">
            <PortfolioPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } /> */}

        <Route path={routes.PORTFOLIO} element={
        <PublicLayout>
          <PortfolioPage />
        </PublicLayout>
      } />
      
      <Route path={routes.PORTFOLIO_EDIT} element={
        <ProtectedRoute requiredRole="STUDENT" currentUser={currentUser}>
          <AuthenticatedLayout userRole="STUDENT">
            <PortfolioEditPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />



      {/* <Route path={routes.PROFILE_EDIT} element={
        <ProtectedRoute requiredRole="STUDENT" currentUser={currentUser}>
          <AuthenticatedLayout userRole="STUDENT">
            <ProfileEditPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } /> */}

      <Route path={routes.PROFILE_EDIT} element={
        <PublicLayout>
          <ProfileEditPage />
        </PublicLayout>
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