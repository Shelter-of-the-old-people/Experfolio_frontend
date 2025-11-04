import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // 방금 수정한 파일에서 AuthContext를 가져옵니다.

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};