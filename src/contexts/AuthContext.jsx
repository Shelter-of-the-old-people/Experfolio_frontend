import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- 1. 하드코딩할 로그인 정보를 이곳에 입력합니다 ---

// (필수) 백엔드(Spring Boot)에서 발급받은 유효한 JWT 토큰을 여기에 붙여넣으세요.
const MOCK_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyM0BleGFtcGxlLmNvbSIsInJvbGUiOiJKT0JfU0VFS0VSIiwidXNlcklkIjoiODNjNjI5NzAtMDdiYi00YjkzLWI1YWYtNDQwMmE3YzA2ZDMwIiwidG9rZW5UeXBlIjoiQUNDRVNTIiwiaWF0IjoxNzYyMjU5OTM4LCJleHAiOjE3NjIyNjE3Mzh9.0BRXwWTkT9N3YIudiUjNI5H0GdMlQbjfjAKHPoi14gw";

// (필수) 프론트엔드 UI에 표시될 사용자 정보입니다.
const MOCK_STUDENT_USER = {
  id: "999", // 이 ID는 UI에서만 사용됩니다.
  email: "user3@example.com",
  name: '테스트 학생',
  role: 'STUDENT' // 'STUDENT' 역할이어야 포트폴리오 페이지 접근이 가능합니다.
};
// ---

export const AuthProvider = ({ children }) => {
  // 2. 앱의 UI 상태를 MOCK_STUDENT_USER로 즉시 설정
  const [user, setUser] = useState(MOCK_STUDENT_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 3. (핵심) 앱 로드 시 localStorage에 하드코딩된 토큰을 즉시 설정합니다.
    //    이 토큰을 src/services/api.js가 읽어서 API 요청 헤더에 사용합니다.
    if (MOCK_AUTH_TOKEN) {
      localStorage.setItem('token', MOCK_AUTH_TOKEN);
    }
    // 사용자 정보도 localStorage에 저장 (페이지 새로고침 대비)
    localStorage.setItem('userData', JSON.stringify(MOCK_STUDENT_USER));
    
  }, []); // 앱 실행 시 한 번만 실행

  const login = async (credentials) => {
    // LoginPage에서 login을 호출해도 하드코딩된 값으로 덮어씌웁니다.
    setUser(MOCK_STUDENT_USER);
    localStorage.setItem('token', MOCK_AUTH_TOKEN);
    localStorage.setItem('userData', JSON.stringify(MOCK_STUDENT_USER));
    return { user: MOCK_STUDENT_USER, token: MOCK_AUTH_TOKEN };
  };

  const logout = () => {
    setUser(null); 
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isCompany: user?.role === 'COMPANY',
    isStudent: user?.role === 'STUDENT'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};