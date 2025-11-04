import React, { useState } from 'react';
import { TextInput, PasswordInput, Button } from '../../components/atoms';
import { useAuth } from '../../contexts/AuthContext'; // 1. useAuth 훅 임포트
import { useNavigate } from 'react-router-dom'; // 2. useNavigate 임포트

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // 3. AuthContext에서 login 함수 가져오기
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 4. 하드코딩된 로그인 로직 실행
    //    (실제 API 연동 시 이 부분을 api.post('/api/v1/auth/login')으로 변경)
    try {
      // MOCK_STUDENT_USER로 로그인 실행
      await login({ email, password }); 
      
      // 로그인 성공 시 MOCK_STUDENT_USER의 기본 페이지로 이동
      navigate('/portfolio/edit'); 
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>로그인</h1>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="이메일"
            variant="email"
            value={email}
            onChange={setEmail}
            placeholder="이메일을 입력하세요"
            required
          />
          <PasswordInput
            label="비밀번호"
            value={password}
            onChange={setPassword}
            placeholder="비밀W번호를 입력하세요"
            required
          />
          <Button type="submit" variant="black" size="full">
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;