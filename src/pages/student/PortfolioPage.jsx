import React from 'react';
import { ProfileBasicInfoForm } from '../../components/organisms';

const PortfolioPage = () => {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // TODO: API 호출 등 추가 로직 구현
  };

  return (
    <div className="portfolio-page">
      <h1>내 포트폴리오</h1>
      <div className="portfolio-content">
        <ProfileBasicInfoForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default PortfolioPage;