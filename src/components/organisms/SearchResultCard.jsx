import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { KeywordTag, Button } from '../atoms';
import '../../styles/components/SearchResultCard.css';

const formatPercent = (decimal) => {
  return `${(decimal * 100).toFixed(0)}%`;
};
/**
 * 검색 결과 인재 카드 (organism)
 */
const SearchResultCard = ({ candidate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // --- [수정] 1. API 응답 구조에 맞게 비구조화 할당을 수정합니다. ---
  const {
    userId,
    matchScore,
    keywords,
    matchReason,
    userInfo // userInfo 객체를 통째로 가져옵니다.
  } = candidate;

  // --- [수정] 2. userInfo 내부의 값들을 추출합니다. (기본값 처리 포함) ---
  const {
    name = "(이름 없음)",
    schoolName = "(학교 정보 없음)",
    gpa = 0.0,
    major = "(학과 정보 없음)",
    awardsCount = 0
  } = userInfo || {}; // userInfo가 null이나 undefined일 경우 대비
  // ---

  // matchScore는 API에서 0.9와 같은 값으로 오므로 formatPercent를 사용합니다.
  const accuracy = formatPercent(matchScore);

  // --- [추가] 3. gpa와 awardsCount 표시 형식 포맷팅 ---
  // gpa는 소수점 둘째 자리까지 (예: 4.0 -> 4.00)
  const displayGrade = typeof gpa === 'number' ? gpa.toFixed(2) : '-';
  // awardsCount는 "N회" (예: 3 -> 3회)
  const displayAwards = typeof awardsCount === 'number' ? `${awardsCount}회` : '-';
  // ---

  const handleProfileView = (e) => {
    e.stopPropagation();
    navigate(routes.TALENT_DETAIL.replace(':id', userId));
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
        
        {/* --- [수정] 4. 포맷팅된 변수를 사용합니다. --- */}
        <span className="summary-item name">{name}</span>
        <span className="summary-item school">{schoolName}</span>
        <span className="summary-item dept">{major}</span>
        <span className="summary-item grade">{displayGrade}</span>
        <span className="summary-item awards">{displayAwards}</span>
        {/* --- */}
        
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

      {/* 4. 상세 정보 섹션 */}
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