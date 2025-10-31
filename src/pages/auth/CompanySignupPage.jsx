import React, { useState } from 'react';
import { TextInput, PasswordInput, NumberInput, Button } from '../../components/atoms';

const CompanySignupPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    representative: '',
    email: '',
    bizNum1: '',
    bizNum2: '',
    bizNum3: '',
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
    console.log('기업 회원가입:', formData);
  };

  const getCompanyNameError = () => {
    if (!formData.companyName) return "상호명은 필수 입력 항목입니다";
    return null;
  };

  const getRepresentativeError = () => {
    if (!formData.representative) return "대표자명은 필수 입력 항목입니다";
    return null;
  };

  const getEmailError = () => {
    if (!formData.email) return "이메일은 필수 입력 항목입니다";
    if (formData.email && !formData.email.includes('@')) return "이메일 형식이 올바르지 않습니다";
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

  const getBizNumberError = () => {
    if (!formData.bizNum1 || !formData.bizNum2 || !formData.bizNum3) return "사업자 번호는 필수 입력 항목입니다";
    return null;
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>회원가입</h1>
        
        <form onSubmit={handleSubmit}>
          <TextInput
            label="상호명"
            variant="text"
            value={formData.companyName}
            onChange={handleInputChange('companyName')}
            placeholder="상호명을 입력하세요"
            error={!!getCompanyNameError()}
            errorMessage={getCompanyNameError()}
            required
          />

          <TextInput
            label="대표자명"
            variant="text"
            value={formData.representative}
            onChange={handleInputChange('representative')}
            placeholder="대표자명을 입력하세요"
            error={!!getRepresentativeError()}
            errorMessage={getRepresentativeError()}
            required
          />

          {/* 사업자 번호 분할 입력 */}
          <div className="number-group">
            <label>사업자 번호를 입력해 주세요</label>
            <div className="number-inputs">
              <NumberInput
                value={formData.bizNum1}
                onChange={handleInputChange('bizNum1')}
                placeholder="000"
              />
              <span>-</span>
              <NumberInput
                value={formData.bizNum2}
                onChange={handleInputChange('bizNum2')}
                placeholder="00"
              />
              <span>-</span>
              <NumberInput
                value={formData.bizNum3}
                onChange={handleInputChange('bizNum3')}
                placeholder="00000"
              />
            </div>
            {getBizNumberError() && (
              <div className="error-message">
                {getBizNumberError()}
              </div>
            )}
            <div className="error-message">
              사업자 등록 번호와 정확히 일치시켜 주세요.
            </div>
          </div>

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

export default CompanySignupPage;