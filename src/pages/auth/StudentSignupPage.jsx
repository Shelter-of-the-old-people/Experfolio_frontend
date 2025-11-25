import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button } from '../../components/atoms';
import { SignupSuccessModal, ServiceGuideCard } from '../../components/molecules';
import { routes } from '../../routes';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/pages/HomePage.css';

const StudentSignupPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  // 1. 폼 데이터 상태
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '', // 전화번호 추가
    email: '',
    password: '',
    confirmPassword: '',
    authCode: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [authStatus, setAuthStatus] = useState('request'); // 'request' | 'check' | 'complete'
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // --- [추가] 비밀번호 일치 여부 확인 ---
  const isPasswordMismatch = 
    formData.password && 
    formData.confirmPassword && 
    formData.password !== formData.confirmPassword;

  // 폼 유효성 검사: 모든 필드가 채워지고, 비밀번호가 일치하며, 인증이 완료되어야 함
  const isFormValid = 
    formData.name.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    !isPasswordMismatch && // [추가] 비밀번호 일치 조건
    authStatus === 'complete';

  // 인증 버튼 핸들러
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

  // 회원가입 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.includes('@')) {
      setErrors(prev => ({ ...prev, email: '이메일 형식이 올바르지 않습니다.' }));
      return;
    }

    if (authStatus !== 'complete') {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    // [추가] 비밀번호 불일치 시 차단
    if (isPasswordMismatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      // API 요청 데이터 구성
      const requestBody = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        role: "JOB_SEEKER",
        passwordMatching: formData.password === formData.confirmPassword
      };

      console.log('학생 회원가입 요청:', requestBody);

      // 1. 회원가입 요청
      const response = await api.post('/v1/auth/signup', requestBody);

      if (response.data.success) {
        // 2. 가입 성공 시 자동 로그인 시도
        try {
          await auth.login({ 
            email: formData.email, 
            password: formData.password 
          });
          // 로그인까지 성공하면 모달 표시
          setShowModal(true);
        } catch (loginError) {
          console.error("자동 로그인 실패:", loginError);
          alert("회원가입은 완료되었으나 자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다.");
          navigate(routes.LOGIN);
        }
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '회원가입 중 오류가 발생했습니다.';
      
      if (errorMsg.includes('이미 존재')) {
        setErrors(prev => ({ ...prev, email: '이미 존재하는 이메일입니다.' }));
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // 인증 버튼 UI 상태 관리
  const getAuthButtonProps = () => {
    switch (authStatus) {
      case 'request': return { text: '인증요청', disabled: false, variant: 'black' };
      case 'check': return { text: '인증확인', disabled: false, variant: 'black' };
      case 'complete': return { text: '인증완료', disabled: true, variant: 'default' };
      default: return { text: '인증요청', disabled: false, variant: 'black' };
    }
  };
  const authBtnProps = getAuthButtonProps();

  // 모달 확인 버튼 클릭 시 이동
  const handleModalConfirm = () => {
    setShowModal(false);
    navigate(routes.PORTFOLIO); // 학생 -> 포트폴리오 페이지
  };

  return (
    <div className='home-wrap'>
      <div className="home-container">
        {/* 좌측 섹션 */}
        <section className="main-section">
          <h1 className="main-title">Experfolio</h1>
          <div className="divider"></div>
          <div className="service-intro-area">
            <h2 className="section-label" style={{ fontSize: '24px' }}>학생</h2>
          </div>
          <div className="guide-area" style={{ justifyContent: 'center', paddingTop: '100px' }}>
            <ServiceGuideCard style={{ width: '100%', maxWidth: '600px', flex: 'none' }}>
              학생 사용자 서비스 이용 가이드
            </ServiceGuideCard>
          </div>
        </section>

        {/* 우측 회원가입 폼 */}
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
                style={{ background: 'none', border: 'none', color: '#888', fontSize: '13px', cursor: 'pointer', fontFamily: 'Pretendard Variable' }}
              >
                ← 뒤로가기
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              <TextInput 
                label="이름" 
                placeholder="이름" 
                value={formData.name} 
                onChange={handleInputChange('name')} 
              />
              
              <TextInput 
                label="전화번호" 
                placeholder="010-1234-5678" 
                value={formData.phoneNumber} 
                onChange={handleInputChange('phoneNumber')} 
              />

              <TextInput 
                label="이메일" 
                value={formData.email} 
                onChange={handleInputChange('email')} 
                placeholder="이메일" 
                error={!!errors.email} 
                errorMessage={errors.email} 
                disabled={authStatus === 'complete'} 
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
                <div style={{ width: '80px', height: '42px', paddingBottom:'1px' }}>
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

              <PasswordInput 
                label="비밀번호" 
                placeholder="비밀번호" 
                value={formData.password} 
                onChange={handleInputChange('password')} 
                showPasswordToggle={false} 
                error={!!errors.password} 
                errorMessage={errors.password} 
              />
              
              {/* --- [수정] 비밀번호 확인 필드에 에러 표시 연결 --- */}
              <PasswordInput 
                label="비밀번호 재확인" 
                placeholder="비밀번호 재확인" 
                value={formData.confirmPassword} 
                onChange={handleInputChange('confirmPassword')} 
                showPasswordToggle={false} 
                // 에러 상태 전달
                error={!!isPasswordMismatch} 
                errorMessage="비밀번호가 일치하지 않습니다."
              />

              <div style={{ marginTop: '10px' }}>
                <Button 
                  type="submit" 
                  variant="black" 
                  size="full" 
                  disabled={!isFormValid || loading} // 유효성 검사 실패 시 비활성화
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
          buttonText="포트폴리오 페이지로 이동" 
          onButtonClick={handleModalConfirm} 
        />
      </div>
    </div>
  );
};

export default StudentSignupPage;