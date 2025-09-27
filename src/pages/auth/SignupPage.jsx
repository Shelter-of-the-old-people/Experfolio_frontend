import React from 'react';

const SignupPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>회원가입</h1>
        <p>가입하실 계정 유형을 선택해주세요</p>
        <div className="signup-options">
          <a href="/signup/student" className="signup-card">
            <h3>학생</h3>
            <p>포트폴리오를 등록하고 기업에 어필하세요</p>
          </a>
          <a href="/signup/company" className="signup-card">
            <h3>기업</h3>
            <p>AI 검색으로 최적의 인재를 찾아보세요</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;