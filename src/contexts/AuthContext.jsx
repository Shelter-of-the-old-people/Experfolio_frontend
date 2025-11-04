// shelter-of-the-old-people/experfolio_frontend/Experfolio_frontend-kmh/src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- ▼ 1. Postman에서 받은 실제 데이터로 이 부분을 교체합니다. ▼ ---
const REAL_USER_INFO = {
    "userId": "7464f463-f105-41bf-b589-f5a7a6620897",
    "email": "user2@example.com",
    "name": "김민호",
    "phoneNumber": "010-1010-1010",
    // (중요) 백엔드(JOB_SEEKER)와 프론트(STUDENT) 역할 이름이 달라 강제 수정
    "role": "STUDENT", 
    "createdAt": "2025-11-04T16:08:33.940217"
};
const REAL_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMkBleGFtcGxlLmNvbSIsInJvbGUiOiJKT0JfU0VFS0VSIiwidXNlcklkIjoiNzQ2NGY0NjMtZjEwNS00MWJmLWI1ODktZjVhN2E2NjIwODk3IiwidG9rZW5UeXBlIjoiQUNDRVNTIiwiaWF0IjoxNzYyMjQwMjU1LCJleHAiOjE3NjIyNDIwNTV9.Y8SONDuvbDlVFwuV5PY_LPGTUbSnmUBfdKujX9Im22k";
// --- ▲ 교체 완료 ▲ ---


export const AuthProvider = ({ children }) => {
  // 2. 초기 상태를 'null'이나 'MOCK'이 아닌 실제 유저 정보로 설정
  const [user, setUser] = useState(REAL_USER_INFO); 
  const [loading, setLoading] = useState(false);

  // 3. (핵심) 앱 로드 시 localStorage에 실제 토큰과 유저 정보를 저장
  //    api.js가 이 'token'을 읽어 헤더에 사용합니다.
  useEffect(() => {
    localStorage.setItem('token', REAL_ACCESS_TOKEN);
    localStorage.setItem('userData', JSON.stringify(REAL_USER_INFO));
    setUser(REAL_USER_INFO); // 상태도 다시 한번 확인
  }, []); // 앱 실행 시 1회만

  const login = async (credentials) => {
    // (실제 로그인 기능 구현 시, 이 부분을 API 호출로 변경)
    try {
      const mockResponse = {
        user: REAL_USER_INFO,
        token: REAL_ACCESS_TOKEN
      };

      setUser(mockResponse.user);
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('userData', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    } catch (error) {
      throw new Error('로그인에 실패했습니다.');
    }
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

  // 4. isStudent가 "STUDENT"를 기준으로 판단
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
      {children}
    </AuthContext.Provider>
  );
};