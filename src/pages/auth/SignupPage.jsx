import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/atoms';
import { routes } from '../../routes';
// HomePage의 스타일을 공유하여 레이아웃 일관성 유지
import { ServiceGuideCard } from '../../components/molecules';
import '../../styles/pages/HomePage.css'; 

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div className='home-wrap'>
    <div className="home-container">
      {/* === 좌측 메인 콘텐츠 (HomePage와 동일) === */}
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
          <div className="guide-column"> {/* 만약 레이아웃 유지를 위해 guide-column이 필요하다면 남겨두셔도 됩니다 */}
            <ServiceGuideCard type="company" />
          </div>

          <div className="guide-column">
            <ServiceGuideCard type="student" />
          </div>
        </div>
      </section>

      {/* === 우측 회원가입 사이드바 (변경됨) === */}
      <aside className="login-sidebar">
        <h2 className="sidebar-title">Experfolio</h2>
        
        <div className="login-form-container" style={{ gap: '20px' }}>
          <h3 className="login-label" style={{ fontSize: '16px' }}>회원가입</h3>
          
          {/* 학생 회원가입 버튼 */}
          <Button 
            type="button" 
            variant="black" 
            size="full"
            style={{ height: '48px' }}
            onClick={() => navigate(routes.SIGNUP_STUDENT)}
          >
            학생
          </Button>

          {/* 기업 회원가입 버튼 */}
          <Button 
            type="button" 
            variant="black" 
            size="full"
            style={{ height: '48px' }}
            onClick={() => navigate(routes.SIGNUP_COMPANY)}
          >
            기업
          </Button>

          {/* 뒤로가기 링크 */}
          <button 
            type="button"
            onClick={() => navigate(routes.HOME)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#666', 
              fontSize: '14px', 
              cursor: 'pointer',
              marginTop: '10px',
              alignSelf: 'flex-end' // 우측 정렬
            }}
          >
            ← 뒤로가기
          </button>
        </div>
      </aside>
    </div>
    </div>
  );
};

export default SignupPage;