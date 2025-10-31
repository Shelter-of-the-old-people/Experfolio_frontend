import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- 테스트를 위한 임시 사용자 객체 ---
const MOCK_STUDENT_USER = {
  id: 999,
  email: 'test@student.com',
  name: '테스트 학생',
  role: 'STUDENT' 
};
// ---

export const AuthProvider = ({ children }) => {
  // --- 수정된 부분: useState의 초기값을 MOCK_STUDENT_USER로 변경 ---
  const [user, setUser] = useState(MOCK_STUDENT_USER); // null -> MOCK_STUDENT_USER
  
  // --- 수정된 부분: 로딩 상태를 false로 즉시 설정 ---
  const [loading, setLoading] = useState(false); // true -> false

  // 로컬스토리지에서 토큰 확인 (테스트 중에는 이 로직을 비활성화)
  useEffect(() => {
    // const token = localStorage.getItem('token');
    // const userData = localStorage.getItem('userData');
    
    // if (token && userData) {
    //   setUser(JSON.parse(userData));
    // }
    // setLoading(false);
    
    // 하드코딩된 유저를 사용하므로 로컬스토리지 로직 주석 처리
  }, []);

  const login = async (credentials) => {
    // (기존 로그인 로직은 지금 사용되지 않음)
    try {
      const mockResponse = {
        user: MOCK_STUDENT_USER,
        token: 'mock-jwt-token'
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
    // 로그아웃 시 MOCK_STUDENT_USER로 되돌아가지 않도록 null로 설정
    setUser(null); 
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // (테스트 후 원복 시 setUser(null)을 MOCK_STUDENT_USER로 다시 변경해야 함)
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
      {children}
    </AuthContext.Provider>
  );
};