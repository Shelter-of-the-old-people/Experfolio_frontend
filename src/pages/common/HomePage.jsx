import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>AI 기반 채용 플랫폼</h1>
        <p>학생과 기업을 연결하는 스마트한 채용 솔루션</p>
        <div className="cta-buttons">
          <a href="/signup/student" className="btn btn-black">학생 회원가입</a>
          <a href="/signup/company" className="btn btn-trans">기업 회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;