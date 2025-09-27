import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로컬스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // TODO: 실제 API 호출로 교체
      const mockResponse = {
        user: {
          id: 1,
          email: credentials.email,
          name: '테스트 사용자',
          role: 'STUDENT' // 또는 'COMPANY'
        },
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
      {children}
    </AuthContext.Provider>
  );
};