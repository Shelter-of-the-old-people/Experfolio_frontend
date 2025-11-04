import React, { useState } from 'react';
import { TextInput, PasswordInput, Button } from '../../components/atoms';

const StudentSignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    email2: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('학생 회원가입:', formData);
  };

  const getNameError = () => {
    if (!formData.name) return "이름은 필수 입력 항목입니다";
    return null;
  };

  const getEmailError = () => {
    if (!formData.email) return "이메일은 필수 입력 항목입니다";
    if (formData.email && !formData.email.includes('@')) return "이메일 형식이 올바르지 않습니다";
    return null;
  };

  const getEmail2Error = () => {
    if (!formData.email2) return "이메일은 필수 입력 항목입니다";
    if (formData.email2 && !formData.email2.includes('@')) return "이메일 형식이 올바르지 않습니다";
    return null;
  };

  const getPasswordError = () => {
    if (!formData.password) return "비밀번호는 필수 입력 항목입니다";
    return null;
  };

  const getConfirmPasswordError = () => {
    if (!formData.confirmPassword) return "비밀번호 재확인은 필수 입력 항목입니다";
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) return "비밀번호가 일치하지 않습니다";
    return null;
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>회원가입</h1>
        
        <form onSubmit={handleSubmit}>
          <TextInput
            label="이름"
            variant="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="이름을 입력하세요"
            error={!!getNameError()}
            errorMessage={getNameError()}
            required
          />

          <TextInput
            label="이메일"
            variant="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder="이메일을 입력하세요"
            error={!!getEmailError()}
            errorMessage={getEmailError()}
            required
          />

          <TextInput
            label="이메일"
            variant="email"
            value={formData.email2}
            onChange={handleInputChange('email2')}
            placeholder="이메일을 입력하세요"
            error={!!getEmail2Error()}
            errorMessage={getEmail2Error()}
            required
          />

          <PasswordInput
            label="비밀번호"
            value={formData.password}
            onChange={handleInputChange('password')}
            placeholder="비밀번호를 입력하세요"
            error={!!getPasswordError()}
            errorMessage={getPasswordError()}
            required
          />

          <PasswordInput
            label="비밀번호 재확인"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            placeholder="비밀번호를 다시 입력하세요"
            error={!!getConfirmPasswordError()}
            errorMessage={getConfirmPasswordError()}
            required
          />

          <Button type="submit" variant="black" size="full">
            인증요청
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StudentSignupPage;