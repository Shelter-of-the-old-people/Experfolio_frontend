import React from 'react';
import Button from '../atoms/Button';
// import Tag from '../atoms/Tag'; // <-- 1. 키워드가 없므로 Tag 임포트 제거
import LinkCard from '../atoms/LinkCard';
import '../../styles/components/ProfileSummaryCard.css';

const getIconByTypeOrUrl = (type, url) => {
  if (type === 'github' || (url && url.includes('github.com')))
    return <img src="/github.svg" alt="GitHub" />;
  if (type === 'notion' || (url && url.includes('notion.so')))
    return <img src="/notion.svg" alt="Notion" />;
  if (type === 'portfolio' || (url && url.includes('portfolio')))
    return <img src="/portfolio.svg" alt="Portfolio" />;
  return null; 
};

const getLabelFromUrl = (url) => {
  if (!url) return '페이지 링크';
  try {
    const urlObj = new URL(url);
    const { hostname, pathname } = urlObj;

    if (hostname.includes('github.com')) {
      const parts = pathname.split('/').filter(Boolean);
      // [수정] parts[0]은 유저명, parts[1]은 레포지토리명입니다.
      // 레포지토리명이 있으면 parts[1]만 반환합니다.
      if (parts.length >= 2) return parts[1];
      // 레포지토리명이 없으면(프로필 링크 등) 마지막 경로(유저명)를 반환합니다.
      return parts[parts.length - 1] || 'GitHub Repository';
    }

    if (hostname.includes('notion')) {
      return 'Notion Page';
    }

    return hostname;
  } catch (e) {
    return url;
  }
};

const MyProfileSummaryCard = ({
  profile: {
    name, avatar, school, major, gpa,
    wishJob, wishArea, 
    github, notion, portfolioLinks = []
  },
  onEdit 
}) => (
  <div className="profile-summary-wrap">
    
    <div className="profile-header-row"> 
      <span className="profile-title">프로필</span>
    </div>

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

          <div className="profile-actions-inline">
            <Button 
              onClick={onEdit}
              variant="black"
            >
              수정
            </Button>
          </div>
        </div>

        <div className="profile-wishinfo-row">
          <span className="wish-label">희망 분야</span>
          <span className="wish-value">{wishArea || wishJob}</span>
        </div>

        <div className="profile-links-row">
          {github &&
            <LinkCard
              icon={getIconByTypeOrUrl('github', github)}
              label={getLabelFromUrl(github)} // [수정] 하드코딩 제거 및 동적 라벨 적용
              url={github}
            />}
          {notion &&
            <LinkCard
              icon={getIconByTypeOrUrl('notion', notion)}
              label={getLabelFromUrl(notion)} // [수정] 하드코딩 제거 및 동적 라벨 적용
              url={notion}
            />}
          {portfolioLinks.map(link =>
            <LinkCard
              key={link.url}
              icon={getIconByTypeOrUrl(link.icon, link.url)}
              label={link.label || getLabelFromUrl(link.url)} // label이 없으면 URL에서 추출
              url={link.url}
            />
          )}
        </div>

      </div>
    </div>
  </div>
);

export default MyProfileSummaryCard;