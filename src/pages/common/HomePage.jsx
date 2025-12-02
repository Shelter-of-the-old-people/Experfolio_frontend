import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button } from '../../components/atoms';
import { useAuth } from '../../hooks/useAuth';
import { routes } from '../../routes';
import { ServiceGuideCard } from '../../components/molecules';
import '../../styles/pages/HomePage.css';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await auth.login({ email, password });
      const userRole = response?.data?.userInfo?.role;

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
            <section className="main-section">
        <h1 className="main-title">Experfolio</h1>
        
        <div className="divider"></div>

        <div className="service-intro-area">
          <h2 className="section-label">서비스 소개</h2>
          <p className="intro-text">
              Experfolio는 인재와 기업을 잇는 <br />
              AI 기반 스마트 포트폴리오 플랫폼입니다. <br />
              <br />
              복잡한 채용 과정은 이제 그만. <br />
              AI가 당신의 경험을 분석하여 최적의 기회를 연결해 드립니다.
            </p>
        </div>

        <div className="divider"></div>

        <div className="guide-area">
          <ServiceGuideCard type="company" />

          <ServiceGuideCard type="student" />
        </div>
      </section>

      <aside className="login-sidebar">
        <div className='sidebar-title-area'>
        <h2 className="sidebar-title">Experfolio</h2>
        </div>
        <form className="login-form-container" onSubmit={handleLogin}>
          <label className="login-label">로그인</label>
          
          <div className="login-input-row">
            <div className="login-inputs">
              <TextInput 
                placeholder="아이디(이메일)" 
                value={email}
                onChange={setEmail}
                disabled={loading}
                className="input" 
              />
              <PasswordInput 
                placeholder="비밀번호" 
                value={password}
                onChange={setPassword}
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