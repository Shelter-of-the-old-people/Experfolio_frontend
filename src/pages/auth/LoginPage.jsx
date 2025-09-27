import React, { useState } from 'react';
import { TextInput, PasswordInput, Button } from '../../components/atoms';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인:', { email, password });
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
            placeholder="비밀번호를 입력하세요"
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