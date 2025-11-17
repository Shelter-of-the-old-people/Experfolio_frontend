import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button } from '../../components/atoms';
import { SignupSuccessModal } from '../../components/molecules';
import { routes } from '../../routes';
// 메인 페이지의 레이아웃 스타일 재사용
import '../../styles/pages/HomePage.css';

const StudentSignupPage = () => {
  const navigate = useNavigate();

  // 1. 폼 데이터 상태
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    authCode: ''
  });

  // 2. 에러 상태 (유효성 검사 시뮬레이션용)
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // 3. 인증 버튼 상태 관리 ('request' | 'check' | 'complete')
  const [authStatus, setAuthStatus] = useState('request');

  // 모달 표시 여부 상태 추가
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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
      setAuthStatus('check'); // 다음 단계(인증확인)로 변경

    } else if (authStatus === 'check') {
      // (2) 인증 확인 단계
      if (!formData.authCode) {
        alert('인증번호를 입력해주세요.');
        return;
      }
      console.log(`인증번호 확인 요청: ${formData.authCode}`);
      // 여기서 실제 API로 인증번호 검증 로직이 들어감
      alert('인증이 완료되었습니다.');
      setAuthStatus('complete'); // 최종 단계(인증완료)로 변경
    }
  };

  // 폼 제출 (회원가입) 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사 예시
    if (!formData.email.includes('@')) {
      setErrors(prev => ({ ...prev, email: '이메일 형식이 올바르지 않습니다.' }));
      return;
    }

    if (authStatus !== 'complete') {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    
    console.log('최종 회원가입 요청 데이터:', formData);
    // TODO: 실제 회원가입 API 호출 -> 성공 시 로그인 페이지 등으로 이동
    
    // 모달 표시
    setShowModal(true);
  };

  // 인증 버튼 텍스트 및 스타일 결정
  const getAuthButtonProps = () => {
    switch (authStatus) {
      case 'request':
        return { text: '인증요청', disabled: false, variant: 'black' };
      case 'check':
        return { text: '인증확인', disabled: false, variant: 'black' }; // 혹은 다른 색상
      case 'complete':
        return { text: '인증완료', disabled: true, variant: 'default' }; // 비활성화 스타일
      default:
        return { text: '인증요청', disabled: false, variant: 'black' };
    }
  };

  const authBtnProps = getAuthButtonProps();

  // 모달 버튼 클릭 핸들러
  const handleModalConfirm = () => {
    setShowModal(false);
    navigate(routes.PORTFOLIO); // 학생은 포트폴리오 페이지로 이동
  };

  return (
    <div className='home-wrap'>
    <div className="home-container">
      
      {/* === 좌측 섹션 (학생 전용) === */}
      <section className="main-section">
        <h1 className="main-title">Experfolio</h1>
        <div className="divider"></div>
        
        <div className="service-intro-area">
          <h2 className="section-label" style={{ fontSize: '24px' }}>학생</h2>
        </div>

        <div className="guide-area" style={{ justifyContent: 'center', paddingTop: '100px' }}>
          <div className="guide-box" style={{ width: '100%', maxWidth: '600px' }}>
            학생 사용자 서비스 이용 가이드
          </div>
        </div>
      </section>


      {/* === 우측 사이드바 (회원가입 폼) === */}
      <aside className="login-sidebar">
        <div className='sidebar-title-area'>
            <h2 className="sidebar-title">Experfolio</h2>
        </div>

        <div className="login-form-container">
          
          {/* 헤더: 회원가입 + 뒤로가기 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%', 
            marginBottom: '20px' 
          }}>
            <h3 className="login-label" style={{ fontSize: '18px' }}>회원가입</h3>
            <button 
              type="button"
              onClick={() => navigate(routes.SIGNUP)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#888', 
                fontSize: '13px', 
                cursor: 'pointer',
                fontFamily: 'Pretendard Variable'
              }}
            >
              ← 뒤로가기
            </button>
          </div>
          
          {/* 입력 폼 리스트 */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            
            <TextInput
              label="이름"
              placeholder="이름"
              value={formData.name}
              onChange={handleInputChange('name')}
            />

            <TextInput
              label="이메일" // 실제 값은 email
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="이메일"
              error={!!errors.email} 
              errorMessage={errors.email}
              // 인증 완료 후에는 이메일 수정 불가능하게 막으려면:
              disabled={authStatus === 'complete'}
            />

            {/* --- 인증 번호 입력 섹션 (가로 배치) --- */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <TextInput
                  label="인증 번호"
                  placeholder="인증번호"
                  value={formData.authCode}
                  onChange={handleInputChange('authCode')}
                  // 인증 완료 시 입력창도 비활성화 (선택사항)
                  disabled={authStatus === 'complete'}
                />
              </div>
              {/* 인증 상태 변경 버튼 */}
              <div style={{ width: '80px', height: '42px', paddingBottom:'1px' }}> {/* TextInput 높이에 맞춤 조절 */}
                <Button
                  type="button"
                  variant={authBtnProps.variant}
                  size="full" // 부모 div(80px)를 채움
                  onClick={handleAuthClick}
                  disabled={authBtnProps.disabled}
                  style={{ 
                    height: '100%', 
                    fontSize: '13px', 
                    padding: '0',
                    // 인증완료 시 스타일 커스텀 (회색 배경 등)
                    backgroundColor: authStatus === 'complete' ? '#ccc' : undefined,
                    color: authStatus === 'complete' ? '#666' : undefined,
                    cursor: authStatus === 'complete' ? 'default' : 'pointer'
                  }}
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

            <PasswordInput
              label="비밀번호 재확인"
              placeholder="비밀번호 재확인"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              showPasswordToggle={false}
            />

            {/* 하단 회원가입(폼 전송) 버튼 */}
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
      {/* 5. 모달 컴포넌트 렌더링 (Overlay이므로 어디에 둬도 상관없지만 최상단 추천) */}
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