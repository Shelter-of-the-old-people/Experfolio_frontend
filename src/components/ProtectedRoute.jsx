import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, currentUser }) => {
  // 로그인 체크
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // 역할 기반 접근 제어
  if (requiredRole && currentUser.role !== requiredRole) {
    const defaultPages = {
      'RECRUITER': '/search',
      'JOB_SEEKER': '/portfolio'
    };
    return <Navigate to={defaultPages[currentUser.role] || '/'} replace />;
  }
  
  return children;
};

export default ProtectedRoute;