import React from 'react';
import Button from '../atoms/Button';
import Tag from '../atoms/Tag';
import LinkCard from '../atoms/LinkCard';
import '../../styles/components/ProfileSummaryCard.css';

// 사이트별 아이콘 자동 매핑
const getIconByTypeOrUrl = (type, url) => {
  if (type === 'github' || (url && url.includes('github.com')))
    return <img src="/github.svg" alt="GitHub" />;
  if (type === 'notion' || (url && url.includes('notion.so')))
    return <img src="/notion.svg" alt="Notion" />;
  if (type === 'portfolio' || (url && url.includes('portfolio')))
    return <img src="/portfolio.svg" alt="Portfolio" />;
  // 이 외 추가 가능 예시: velog, youtube 등
  return null; // 또는 기본 아이콘 JSX
};

const ProfileSummaryCard = ({
  profile: {
    name, avatar, school, major, gpa,
    wishJob, wishArea, keywords = [],
    github, notion, portfolioLinks = []
  },
  onClose = () => {},
  isFavorite = false,
  onContact, onToggleFavorite,
}) => (
  <div className="profile-summary-wrap">
    {/* 상단 프로필 타이틀 */}
    <div className="profile-header-row">
      <span className="profile-title">프로필</span>
      <button className="close-btn" onClick={onClose}>
        <img src="/close.svg" alt="닫기" />
      </button>
    </div>

    {/* 메인 Row: 좌측 이미지/우측 정보 */}
    <div className="profile-main-row">
      {/* 프로필 이미지 */}
      <div className="profile-img-box">
        <img
          src={avatar || '/profile-default.svg'}
          alt="profile"
          className="profile-avatar"
        />
      </div>

      {/* 정보 컬럼 */}
      <div className="profile-detail-col">
        {/* 이름 + 소속 + 전공 + 성적 + [연락/별] Row */}
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
            <Button onClick={onContact}>연락하기</Button>
            <span
              className={`star-btn${isFavorite ? ' active' : ''}`}
              onClick={onToggleFavorite}
            >
              ★
            </span>
          </div>
        </div>

        {/* 희망 분야/직무 row */}
        <div className="profile-wishinfo-row">
          <span className="wish-label">희망 분야</span>
          <span className="wish-value">{wishArea || wishJob}</span>
        </div>

        {/* 링크 카드 리스트 - 아이콘 자동 분기 */}
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

        {/* 키워드/태그 리스트 */}
        <div className="profile-keywords-row">
          {keywords.map((kw, i) => (
            <Tag key={i}>{kw}</Tag>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSummaryCard;
