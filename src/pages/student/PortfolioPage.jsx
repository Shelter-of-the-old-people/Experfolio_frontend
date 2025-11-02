import React from 'react';
import { ProfileBasicInfoForm, AwardListSection, CertificateListSection, LanguageListSection, ProfileCareerCards } from '../../components/organisms';
import ProfileSummaryCard from '../../components/organisms/ProfileSummaryCard';

const PortfolioPage = () => {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // TODO: API 호출 등 추가 로직 구현
  };

  return (
    <div className="portfolio-page">
      <div className="portfolio-content">
        <ProfileBasicInfoForm onSubmit={handleSubmit} />
      </div>
      <AwardListSection />
      <div>
        <CertificateListSection />
        </div>
        <LanguageListSection />
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
        <ProfileCareerCards
  awards = {[
  {
    id: 1,               // (필수, 편집/삭제용)
    prize: '대상',
    title: '소프트웨어 경진대회',
    year: '2024',
    month: '5',
  },
  {
    id: 2,
    prize: '장려상',
    title: '캡스톤 디자인 경진대회',
    year: '2023',
    month: '10',
  },
  {
    id: 3,
    prize: '최우수상',
    title: 'AI 해커톤',
    year: '2022',
    month: '12',
  },
]}
  certificates={[
    { name: '정보처리기사', year: '2023' },
    { name: 'SQLD', year: '2024' },
  ]}
  languages={[
    { score: '900', testName: 'TOEIC', year: '2024' },
    { score: '6.5', testName: 'IELTS', year: '2023' }
  ]}
/>

    </div>
  );
};

export default PortfolioPage;