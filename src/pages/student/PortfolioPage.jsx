import React from 'react';
import { ProfileBasicInfoForm, AwardListSection, CertificateListSection, LanguageListSection } from '../../components/organisms';
import ProfileSummaryCard from '../../components/organisms/ProfileSummaryCard';

const PortfolioPage = () => {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // TODO: API 호출 등 추가 로직 구현
  };

  return (
    <div className="portfolio-page">
      {/* <h1>내 포트폴리오</h1>
      <div className="portfolio-content">
        <ProfileBasicInfoForm onSubmit={handleSubmit} />
      </div>
      <AwardListSection />
      <div>
        <CertificateListSection />
        </div>
        <LanguageListSection /> */}
        <ProfileSummaryCard profile={{
          name: "홍길동",
          avatar: "",
          school: "서울대학교",
          major: "컴퓨터공학",
          gpa: "4.5",
          wishJob: "프론트엔드 개발자",
          wishArea: "서울",
          keywords: ["React", "JavaScript", "CSS"],
          github: "https://github.com/example",
          notion: "https://www.notion.so/example",
          portfolioLinks: [
            { icon: "portfolio", label: "내 포트폴리오", url: "https://portfolio.example.com" }
          ]
        }} />
    </div>
  );
};

export default PortfolioPage;