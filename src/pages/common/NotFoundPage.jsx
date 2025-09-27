import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <a href="/" className="btn btn-black">홈으로 돌아가기</a>
    </div>
  );
};

export default NotFoundPage;