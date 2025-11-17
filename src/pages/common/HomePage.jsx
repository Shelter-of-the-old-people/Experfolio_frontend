import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button } from '../../components/atoms';
import { useAuth } from '../../hooks/useAuth'; // LoginPage와 동일한 훅 사용
import { routes } from '../../routes';
import '../../styles/pages/HomePage.css';

const HomePage = () => {
  // --- 1. LoginPage.jsx의 상태 관리 로직 복사 ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // (에러 메시지는 alert로 띄우거나 UI에 표시할 수 있습니다)
  
  const auth = useAuth();
  const navigate = useNavigate();

  // --- 2. LoginPage.jsx의 핸들러 로직 복사 및 수정 ---
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // AuthContext의 login 함수 호출 (LoginPage와 동일)
      const response = await auth.login({ email, password });

      // 사용자 역할 확인
      const userRole = response?.data?.userInfo?.role;

      // 역할에 따른 리다이렉트 (LoginPage와 동일)
      if (userRole === 'JOB_SEEKER') {
        navigate(routes.PORTFOLIO);
      } else if (userRole === 'RECRUITER') {
        navigate(routes.SEARCH);
      } else {
        navigate(routes.PROFILE); 
      }

    } catch (err) {
      console.error(err);
      alert(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='home-wrap'>
    <div className="home-container">
      {/* === 좌측 메인 콘텐츠 === */}
            <section className="main-section">
        <h1 className="main-title">Experfolio</h1>
        
        <div className="divider"></div>

        <div className="service-intro-area">
          <h2 className="section-label">서비스 소개</h2>
          <p className="intro-text">
            서비스 소개글<br/>
            (여기에 서비스에 대한 구체적인 설명이 들어갑니다.)
          </p>
        </div>

        <div className="divider"></div>

        <div className="guide-area">
          <div className="guide-column">
            <h3 className="section-label">기업 / 회사</h3>
            <div className="guide-box">
              기업 / 회사 사용자 서비스 이용 가이드
            </div>
          </div>

          <div className="guide-column">
            <h3 className="section-label">학생</h3>
            <div className="guide-box">
              학생 사용자 서비스 이용 가이드
            </div>
          </div>
        </div>
      </section>

      {/* === 우측 로그인 사이드바 === */}
      <aside className="login-sidebar">
        <div className='sidebar-title-area'>
        <h2 className="sidebar-title">Experfolio</h2>
        </div>
        
        {/* 3. 로그인 폼에 핸들러 연결 */}
        <form className="login-form-container" onSubmit={handleLogin}>
          <label className="login-label">로그인</label>
          
          <div className="login-input-row">
            <div className="login-inputs">
              {/* 이메일 입력창 (상태 연결) */}
              <TextInput 
                placeholder="아이디(이메일)" 
                value={email}
                onChange={setEmail} // LoginPage와 동일하게 값 변경 처리
                disabled={loading}
                className="input" 
              />
              {/* 비밀번호 입력창 (상태 연결) */}
              <PasswordInput 
                placeholder="비밀번호" 
                value={password}
                onChange={setPassword} // LoginPage와 동일하게 값 변경 처리
                showPasswordToggle={false}
                disabled={loading}
                className="input"
              />
            </div>
            
            <div className="login-btn-wrap">
              <Button 
                type="submit" 
                variant="black" 
                size="full" 
                disabled={loading}
              >
                {loading ? '...' : '로그인'}
              </Button>
            </div>
          </div>

          <div className="signup-btn-wrap">
            <div className='signup-btn'>
            {/* 회원가입 페이지로 이동 */}
            <Button 
              type="button" 
              variant="black" 
              size="full"
              onClick={() => navigate(routes.SIGNUP)}
            >
              회원가입
            </Button>
            </div>
          </div>
        </form>
      </aside>
    </div>
    </div>
  );
};

export default HomePage;