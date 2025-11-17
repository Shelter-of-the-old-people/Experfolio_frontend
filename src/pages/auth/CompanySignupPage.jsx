import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, BusinessNumberInput } from '../../components/atoms';
import { SignupSuccessModal } from '../../components/molecules';
import { routes } from '../../routes';
import '../../styles/pages/HomePage.css'; // 스타일 공유

const CompanySignupPage = () => {
  const navigate = useNavigate();

  // 1. 폼 데이터 상태
  const [formData, setFormData] = useState({
    companyName: '',
    representative: '',
    // 사업자 번호는 객체로 관리하거나, 각각 관리 (여기서는 BusinessNumberInput prop에 맞춤)
    bizNum1: '',
    bizNum2: '',
    bizNum3: '',
    email: '',
    password: '',
    confirmPassword: '',
    authCode: ''
  });

  // 2. 에러 상태
  const [errors, setErrors] = useState({
    companyName: '',
    email: '',
    password: ''
  });

  // 3. 인증 버튼 상태 관리 ('request' | 'check' | 'complete')
  const [authStatus, setAuthStatus] = useState('request');

  // 모달 상태 추가
  const [showModal, setShowModal] = useState(false);

  // 입력 핸들러
  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // 사업자 번호 변경 핸들러 (BusinessNumberInput용)
  const handleBizNumChange = (values) => {
    setFormData(prev => ({
      ...prev,
      bizNum1: values.part1,
      bizNum2: values.part2,
      bizNum3: values.part3
    }));
  };

  // 인증 버튼 클릭 핸들러
  const handleAuthClick = () => {
    if (authStatus === 'request') {
      // (1) 인증 요청 단계
      if (!formData.email) {
        alert('이메일을 먼저 입력해주세요.');
        return;
      }
      console.log(`인증번호 발송 요청: ${formData.email}`);
      alert('인증번호가 발송되었습니다. (테스트)');
      setAuthStatus('check'); // -> 인증확인 단계로

    } else if (authStatus === 'check') {
      // (2) 인증 확인 단계
      if (!formData.authCode) {
        alert('인증번호를 입력해주세요.');
        return;
      }
      console.log(`인증번호 확인 요청: ${formData.authCode}`);
      // TODO: API 검증 로직
      alert('인증이 완료되었습니다.');
      setAuthStatus('complete'); // -> 인증완료 단계로
    }
  };

  // 폼 제출 (회원가입) 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사 예시
    if (!formData.companyName) {
      setErrors(prev => ({ ...prev, companyName: '상호명을 입력해주세요.' }));
      return;
    }

    if (authStatus !== 'complete') {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    console.log('기업 회원가입 요청:', formData);
    // TODO: API 호출 -> 성공 시 로그인 페이지 이동
    
    // 2. 성공 시 모달 표시
    setShowModal(true);
  };

  // 인증 버튼 속성 결정
  const getAuthButtonProps = () => {
    switch (authStatus) {
      case 'request':
        return { text: '인증요청', disabled: false, variant: 'black' };
      case 'check':
        return { text: '인증확인', disabled: false, variant: 'black' };
      case 'complete':
        return { text: '인증완료', disabled: true, variant: 'default' }; // 비활성 스타일
      default:
        return { text: '인증요청', disabled: false, variant: 'black' };
    }
  };
  
  const authBtnProps = getAuthButtonProps();

  // 모달 버튼 클릭 핸들러 (기업용 경로)
  const handleModalConfirm = () => {
    setShowModal(false);
    navigate(routes.SEARCH); // 기업은 검색 페이지로 이동
  };

  return (
    <div className='home-wrap'>
    <div className="home-container">
      
      {/* === 좌측 섹션 (기업 전용) === */}
      <section className="main-section">
        <h1 className="main-title">Experfolio</h1>
        
        <div className="divider"></div>

        <div className="service-intro-area">
          <h2 className="section-label" style={{ fontSize: '24px' }}>기업 / 회사</h2>
        </div>

        <div className="guide-area" style={{ justifyContent: 'center', paddingTop: '100px' }}>
          <div className="guide-box" style={{ width: '100%', maxWidth: '600px' }}>
            기업 / 회사 사용자 서비스 이용 가이드
          </div>
        </div>
      </section>


      {/* === 우측 사이드바 (기업 회원가입 폼) === */}
      <aside className="login-sidebar">
        <div className='sidebar-title-area'>
            <h2 className="sidebar-title">Experfolio</h2>
        </div>

        <div className="login-form-container">
          
          {/* 헤더: 회원가입 + 뒤로가기 */}
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

            {/* 사업자 번호 입력 (컴포넌트 활용) */}
            <BusinessNumberInput
              label="사업자 번호"
              value={{ 
                part1: formData.bizNum1, 
                part2: formData.bizNum2, 
                part3: formData.bizNum3 
              }}
              onChange={handleBizNumChange}
              // 필요시 API 검증 로직(`onValidate`) 연결 가능
              showValidationButton={false} // 여기서는 입력만 받음 (선택 사항)
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
            />

            {/* --- 인증 번호 & 버튼 (가로 배치) --- */}
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
                  style={{ 
                    height: '100%', 
                    fontSize: '13px', 
                    padding: '0',
                    backgroundColor: authStatus === 'complete' ? '#ccc' : undefined,
                    color: authStatus === 'complete' ? '#666' : undefined,
                    cursor: authStatus === 'complete' ? 'default' : 'pointer'
                  }}
                >
                  {authBtnProps.text}
                </Button>
              </div>
            </div>

            {/* 하단 회원가입 버튼 */}
            <div style={{ marginTop: '10px' }}>
              <Button 
                type="submit" 
                variant="black" 
                size="full" 
                style={{ height: '48px', fontSize: '14px', fontWeight: '700' }}
              >
                회원가입
              </Button>
            </div>

          </form>
        </div>
      </aside>
      {/* 모달 렌더링 */}
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