import React from 'react';
import Button from '../atoms/Button';
import Tag from '../atoms/Tag';
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
    <div className="profile-header-row">
      <span className="profile-title">프로필</span>
      <button className="close-btn" onClick={onClose}>
        <img src="/close.svg" alt="닫기" />
      </button>
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
            <span
              className={`star-btn${isFavorite ? ' active' : ''}`}
              onClick={onToggleFavorite}
              role="button"
              aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
            </span>
            <Button onClick={onContact}>연락하기</Button>
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
