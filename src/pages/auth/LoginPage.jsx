import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button } from '../../components/atoms';
import { useAuth } from '../../hooks/useAuth'; // ../../contexts' -> '../../hooks/useAuth'
import { routes } from '../../routes'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // AuthContext의 login 함수 호출
      const response = await auth.login({ email, password });

      // 로그인 성공 시, 응답 데이터에서 사용자 역할 확인
      const userRole = response?.data?.userInfo?.role;

      // 역할에 따라 적절한 페이지로 리디렉션
      if (userRole === 'JOB_SEEKER') {
        navigate(routes.PORTFOLIO); // 학생은 포트폴리오 수정 페이지로
      } else if (userRole === 'RECRUITER') {
        navigate(routes.SEARCH); // 기업은 인재 검색 페이지로
      } else {
        navigate(routes.HOME); // 예외 상황 시 홈으로
      }

    } catch (err) {
      // AuthContext의 login 함수에서 throw된 에러 메시지 사용
      setError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>로그인</h1>
        
        {/* 에러 메시지 표시 */}
        {error && (
          <div style={{ color: 'var(--color-error)', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="이메일"
            variant="email"
            value={email}
            onChange={(val) => setEmail(val)} // atoms 컴포넌트 시그니처에 맞춤
            placeholder="이메일을 입력하세요"
            required
            disabled={loading}
          />
          <PasswordInput
            label="비밀번호"
            value={password}
            onChange={(val) => setPassword(val)} // atoms 컴포넌트 시그니처에 맞춤
            placeholder="비밀번호를 입력하세요"
            required
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="black" 
            size="full" 
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;