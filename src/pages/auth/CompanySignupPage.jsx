import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, BusinessNumberInput } from '../../components/atoms';
import { SignupSuccessModal, ServiceGuideCard } from '../../components/molecules';
import { useLazyApi } from '../../hooks/useApi';
import { BusinessNumberAPIService } from '../../services/BusinessNumberAPIService';
import { routes } from '../../routes';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/pages/HomePage.css';

const apiKey = import.meta.env.VITE_BUSINESS_API_KEY;
const businessNumberService = new BusinessNumberAPIService(apiKey);

const validateApi = (businessNumber) => {
  if (!apiKey) {
    return Promise.reject(new Error("API 키가 설정되지 않았습니다."));
  }
  return businessNumberService.validateBusinessNumber(businessNumber);
};

const CompanySignupPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    companyName: '',
    representative: '',
    bizNum1: '',
    bizNum2: '',
    bizNum3: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    authCode: ''
  });

  const [errors, setErrors] = useState({
    companyName: '',
    email: '',
    password: ''
  });

  const [authStatus, setAuthStatus] = useState('request');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { 
    data: validationData, 
    loading: isValidating, 
    error: validationError,
    execute: executeValidation,
    reset: resetValidation
  } = useLazyApi(validateApi);

  const isBizValid = validationData?.isValid;
  const validationMsg = validationError 
    ? (validationError.message || '검증 오류') 
    : (validationData?.getStatusMessage() || '');

  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleBizNumChange = (values) => {
    setFormData(prev => ({
      ...prev,
      bizNum1: values.part1,
      bizNum2: values.part2,
      bizNum3: values.part3
    }));

    const fullNumber = `${values.part1}${values.part2}${values.part3}`;

    if (fullNumber.length === 10) {
      console.log('10자리 입력 완료 -> 자동 검증 실행:', fullNumber);
      executeValidation(fullNumber);
    } else {
      if (validationData || validationError) {
        resetValidation();
      }
    }
  };

  const isPasswordMismatch = 
    formData.password && 
    formData.confirmPassword && 
    formData.password !== formData.confirmPassword;

  const isFormValid = 
    formData.companyName.trim() !== '' &&
    formData.representative.trim() !== '' &&
    formData.bizNum1.trim() !== '' &&
    formData.bizNum2.trim() !== '' &&
    formData.bizNum3.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    !isPasswordMismatch && 
    authStatus === 'complete' &&
    isBizValid === true; 

  const handleAuthClick = () => {
    if (authStatus === 'request') {
      if (!formData.email) {
        alert('이메일을 먼저 입력해주세요.');
        return;
      }
      console.log(`인증번호 발송 요청: ${formData.email}`);
      alert('인증번호가 발송되었습니다. (테스트)');
      setAuthStatus('check');
    } else if (authStatus === 'check') {
      if (!formData.authCode) {
        alert('인증번호를 입력해주세요.');
        return;
      }
      console.log(`인증번호 확인 요청: ${formData.authCode}`);
      alert('인증이 완료되었습니다.');
      setAuthStatus('complete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyName) {
      setErrors(prev => ({ ...prev, companyName: '상호명을 입력해주세요.' }));
      return;
    }

    if (authStatus !== 'complete') {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (!isBizValid) {
      alert('유효한 사업자 등록번호를 입력해주세요.');
      return;
    }
    if (isPasswordMismatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.representative,
        phoneNumber: formData.phoneNumber,
        role: "RECRUITER",
        passwordMatching: formData.password === formData.confirmPassword
      };

      const response = await api.post('/v1/auth/signup', requestBody);

      if (response.data.success) {
        try {
          await auth.login({ 
            email: formData.email, 
            password: formData.password 
          });
          setShowModal(true);
        } catch (loginError) {
          console.error("자동 로그인 실패:", loginError);
          alert("회원가입 완료. 로그인 페이지로 이동합니다.");
          navigate(routes.LOGIN);
        }
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '오류가 발생했습니다.';
      
      if (errorMsg.includes('이미 존재')) {
        setErrors(prev => ({ ...prev, email: '이미 존재하는 이메일입니다.' }));
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAuthButtonProps = () => {
    switch (authStatus) {
      case 'request': return { text: '인증요청', disabled: false, variant: 'black' };
      case 'check': return { text: '인증확인', disabled: false, variant: 'black' };
      case 'complete': return { text: '인증완료', disabled: true, variant: 'default' };
      default: return { text: '인증요청', disabled: false, variant: 'black' };
    }
  };
  const authBtnProps = getAuthButtonProps();

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate(routes.SEARCH);
  };

  return (
    <div className='home-wrap'>
      <div className="home-container">
        <section className="main-section">
          <h1 className="main-title">Experfolio</h1>
          <div className="divider"></div>
          <div className="service-intro-area">
            <h2 className="section-label" style={{ fontSize: '24px' }}>기업 / 회사</h2>
          </div>
          <div className="guide-area" style={{ justifyContent: 'center', paddingTop: '100px' }}>
            <ServiceGuideCard style={{ width: '100%', maxWidth: '600px', flex: 'none' }}>
              기업 / 회사 사용자 서비스 이용 가이드
            </ServiceGuideCard>
          </div>
        </section>

        <aside className="login-sidebar">
          <div className='sidebar-title-area'>
            <h2 className="sidebar-title">Experfolio</h2>
          </div>

          <div className="login-form-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
              <h3 className="login-label" style={{ fontSize: '18px' }}>회원가입</h3>
              <button 
                type="button" 
                onClick={() => navigate(routes.SIGNUP)} 
                style={{ background: 'none', border: 'none', color: '#888', fontSize: '13px', cursor: 'pointer' }}
              >
                ← 뒤로가기
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              <TextInput 
                label="상호명" 
                placeholder="상호명" 
                value={formData.companyName} 
                onChange={handleInputChange('companyName')} 
                error={!!errors.companyName} 
                errorMessage={errors.companyName} 
              />
              
              <TextInput 
                label="대표자명" 
                placeholder="대표자 이름" 
                value={formData.representative} 
                onChange={handleInputChange('representative')} 
              />
              
              <BusinessNumberInput 
                label="사업자 번호" 
                value={{ part1: formData.bizNum1, part2: formData.bizNum2, part3: formData.bizNum3 }} 
                onChange={handleBizNumChange} 
                
                showValidationButton={false}
                isValidating={isValidating}
                isValid={isBizValid}
                validationMessage={validationMsg}
                companyName={validationData?.companyName}
              />
              
              <TextInput 
                label="전화번호" 
                placeholder="010-1234-5678" 
                value={formData.phoneNumber} 
                onChange={handleInputChange('phoneNumber')} 
              />

              <TextInput 
                label="이메일" 
                variant="email" 
                value={formData.email} 
                onChange={handleInputChange('email')} 
                placeholder="이메일" 
                disabled={authStatus === 'complete'} 
              />
              
              <PasswordInput 
                label="비밀번호" 
                placeholder="비밀번호" 
                value={formData.password} 
                onChange={handleInputChange('password')} 
                showPasswordToggle={false} 
              />
              
              <PasswordInput 
                label="비밀번호 재확인" 
                placeholder="비밀번호 재확인" 
                value={formData.confirmPassword} 
                onChange={handleInputChange('confirmPassword')} 
                showPasswordToggle={false}
                error={!!isPasswordMismatch} 
                errorMessage="비밀번호가 일치하지 않습니다."
              />

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <TextInput 
                    label="인증 번호" 
                    placeholder="인증번호" 
                    value={formData.authCode} 
                    onChange={handleInputChange('authCode')} 
                    disabled={authStatus === 'complete'} 
                  />
                </div>
                <div style={{ width: '80px', height: '42px', paddingBottom: '1px' }}>
                  <Button 
                    type="button" 
                    variant={authBtnProps.variant} 
                    size="full" 
                    onClick={handleAuthClick} 
                    disabled={authBtnProps.disabled} 
                    style={{ height: '100%', fontSize: '13px', padding: '0', backgroundColor: authStatus === 'complete' ? '#ccc' : undefined, color: authStatus === 'complete' ? '#666' : undefined, cursor: authStatus === 'complete' ? 'default' : 'pointer' }}
                  >
                    {authBtnProps.text}
                  </Button>
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <Button 
                  type="submit" 
                  variant="black" 
                  size="full" 
                  disabled={!isFormValid || loading} 
                  style={{ height: '48px', fontSize: '14px', fontWeight: '700' }}
                >
                  {loading ? '처리중...' : '회원가입'}
                </Button>
              </div>
            </form>
          </div>
        </aside>

        <SignupSuccessModal 
          isOpen={showModal} 
          buttonText="검색 페이지로 이동" 
          onButtonClick={handleModalConfirm} 
        />
      </div>
    </div>
  );
};

export default CompanySignupPage;