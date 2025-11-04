import React from 'react';
import Button from '../atoms/Button';
// import Tag from '../atoms/Tag'; // <-- 1. 키워드가 없으므로 Tag 임포트 제거
import LinkCard from '../atoms/LinkCard';
// 기존 CSS를 그대로 재사용합니다.
import '../../styles/components/ProfileSummaryCard.css';

// 아이콘 매핑 로직 (변경 없음)
const getIconByTypeOrUrl = (type, url) => {
  if (type === 'github' || (url && url.includes('github.com')))
    return <img src="/github.svg" alt="GitHub" />;
  if (type === 'notion' || (url && url.includes('notion.so')))
    return <img src="/notion.svg" alt="Notion" />;
  if (type === 'portfolio' || (url && url.includes('portfolio')))
    return <img src="/portfolio.svg" alt="Portfolio" />;
  return null; 
};

const MyProfileSummaryCard = ({
  profile: {
    name, avatar, school, major, gpa,
    wishJob, wishArea, 
    // keywords = [], // <-- 2. keywords prop 제거
    github, notion, portfolioLinks = []
  },
  onEdit // '수정' 버튼 클릭 핸들러
}) => (
  <div className="profile-summary-wrap">
    
    {/* --- 3. 헤더 수정: '프로필' 텍스트 추가, 'X' 버튼 없음 --- */}
    <div className="profile-header-row"> 
      <span className="profile-title">프로필</span>
      {/* 'X' 버튼이 없는 헤더입니다. */}
    </div>

    {/* --- 본문 --- */}
    <div className="profile-main-row">
      <div className="profile-img-box">
        <img
          src={avatar || '/profile-default.svg'}
          alt="profile"
          className="profile-avatar"
        />
      </div>

      <div className="profile-detail-col">
        <div className="profile-id-row">
          <div className="profile-meta-group">
            <span className="user-name">{name}</span>
            <span className="user-meta-row">
              <span className="school">{school}</span>
              <span className="major">{major}</span>
              <span className="gpa">{gpa}</span>
            </span>
          </div>

          {/* --- 4. '수정' 버튼 위치 수정 (본문 우측 상단) --- */}
          <div className="profile-actions-inline">
            <Button 
              onClick={onEdit}
              variant="black"
            >
              수정
            </Button>
          </div>
        </div>

        {/* --- 나머지 내용 (변경 없음) --- */}
        <div className="profile-wishinfo-row">
          <span className="wish-label">희망 분야</span>
          <span className="wish-value">{wishArea || wishJob}</span>
        </div>

        <div className="profile-links-row">
          {github &&
            <LinkCard
              icon={getIconByTypeOrUrl('github', github)}
              label="Repository_Name"
              url={github}
            />}
          {notion &&
            <LinkCard
              icon={getIconByTypeOrUrl('notion', notion)}
              label="페이지_이름"
              url={notion}
            />}
          {portfolioLinks.map(link =>
            <LinkCard
              key={link.url}
              icon={getIconByTypeOrUrl(link.icon, link.url)}
              label={link.label}
              url={link.url}
            />
          )}
        </div>

        {/* --- 5. 키워드 섹션(profile-keywords-row) 제거 --- */}
        
      </div>
    </div>
  </div>
);

export default MyProfileSummaryCard;