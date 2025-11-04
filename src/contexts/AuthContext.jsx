import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; 

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/v1/auth/login', credentials);
      
      // 정규화된 응답: response.data = { success, message, data, timestamp }
      const loginData = response.data.data;

      if (!loginData || !loginData.accessToken || !loginData.userInfo) {
        throw new Error('로그인 응답 형식이 올바르지 않습니다.');
      }

      const { accessToken, refreshToken, userInfo } = loginData;

      setUser(userInfo);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userData', JSON.stringify(userInfo));

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return response.data;

    } catch (error) {
      throw new Error(error.message || '로그인에 실패했습니다.');
    }
  };

  const logout = () => {
    setUser(null); 
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); 
    localStorage.removeItem('userData');
    delete api.defaults.headers.common['Authorization'];
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
    isCompany: user?.role === 'RECRUITER', 
    isStudent: user?.role === 'JOB_SEEKER'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;