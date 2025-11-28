import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { KeywordTag, Button } from '../atoms';
import '../../styles/components/SearchResultCard.css';

const formatPercent = (decimal) => {
  return `${(decimal * 100).toFixed(0)}%`;
};
const SearchResultCard = ({ candidate }) => {
  console.log('candidate:', candidate);
  console.log('keywords:', candidate.keywords);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const {
    userId,
    matchScore,
    keywords,
    matchReason,
    userInfo 
  } = candidate;

  const {
    name = "(이름 없음)",
    schoolName = "(학교 정보 없음)",
    gpa = 0.0,
    major = "(학과 정보 없음)",
    awardsCount = 0
  } = userInfo || {}; 

  const accuracy = formatPercent(matchScore);

  const displayGrade = typeof gpa === 'number' ? gpa.toFixed(2) : '-';
  const displayAwards = typeof awardsCount === 'number' ? `${awardsCount}회` : '-';

  const handleProfileView = (e) => {
    e.stopPropagation();
    navigate(routes.TALENT_DETAIL.replace(':id', userId),{
      state: { searchKeywords: keywords }
    });
  };


  return (
    <div className={`search-card ${isOpen ? 'open' : ''}`}>
      <div 
        className="search-card-summary"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
      >
        <img src="/profile-default.svg" alt="" className="summary-icon" />
        
        <span className="summary-item name">{name}</span>
        <span className="summary-item school">{schoolName}</span>
        <span className="summary-item dept">{major}</span>
        <span className="summary-item grade">{displayGrade}</span>
        <span className="summary-item awards">{displayAwards}</span>
        
        <span className="summary-item accuracy">{accuracy}</span>
        
        <div className="summary-button-wrapper">
          <Button 
            variant="black" 
            onClick={handleProfileView}
            className="summary-profile-button"
          >
            프로필 조회
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="search-card-details">
          
          <div className="detail-accuracy-section">
            <span className="detail-label">정확도 {accuracy}</span>
            <div className="accuracy-bar-wrapper">
              <div 
                className="accuracy-bar-fill" 
                style={{ width: accuracy }} 
              />
            </div>
          </div>

          <div className="detail-keywords-section">
            <span className="detail-label">분석 근거</span>
            <div className="keywords-list">
              {keywords.map((kw, idx) => (
                <KeywordTag key={idx}>{kw}</KeywordTag>
              ))}
            </div>
          </div>

          <div className="detail-reason-section">
            <span className="detail-label">분석 근거 내용</span>
            <p className="reason-text">
              {matchReason}
            </p>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default SearchResultCard;