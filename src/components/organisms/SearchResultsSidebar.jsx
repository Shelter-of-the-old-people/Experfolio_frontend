import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { KeywordTag } from '../atoms';
import useSearchStore from '../../stores/useSearchStore';
import '../../styles/components/SearchResultsSidebar.css';

const formatPercent = (decimal) => {
  return `${(decimal * 100).toFixed(0)}%`;
};

const SearchResultsSidebar = ({ currentUserId }) => {
  const navigate = useNavigate();
  const { cachedResults, setSelectedUserId } = useSearchStore();
  
  const [openCards, setOpenCards] = useState({});

  // ⭐ 현재 선택된 카드는 자동으로 펼침
  useEffect(() => {
    if (currentUserId) {
      setOpenCards(prev => ({
        ...prev,
        [currentUserId]: true
      }));
    }
  }, [currentUserId]);

  if (!cachedResults || !cachedResults.candidates) {
    return (
      <div className="search-sidebar">
        <div className="sidebar-empty">
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>
    );
  }

  const { candidates } = cachedResults;

  const handleCardClick = (candidate) => {
    setSelectedUserId(candidate.userId);
    
    navigate(routes.TALENT_DETAIL.replace(':id', candidate.userId), {
      state: { searchKeywords: candidate.keywords }
    });
  };

  const handleToggleClick = (e, userId) => {
    e.stopPropagation();
    setOpenCards(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="search-sidebar">
      <div className="sidebar-header">
        <h3>검색 결과</h3>
        <span className="result-count">{candidates.length}명</span>
      </div>

      <div className="sidebar-list">
        {candidates.map((candidate) => {
          const { userId, matchScore, keywords, matchReason, userInfo } = candidate;
          const { name, schoolName, major, gpa } = userInfo || {};
          const accuracy = formatPercent(matchScore);
          const isSelected = userId === currentUserId;
          const isOpen = openCards[userId] || false;

          return (
            <div
              key={userId}
              className={`sidebar-card ${isSelected ? 'selected' : ''} ${isOpen ? 'open' : ''}`}
            >
              <div
                className="card-summary"
                onClick={() => handleCardClick(candidate)}
                role="button"
                tabIndex={0}
              >
                <div className="card-header">
                  <div className="card-info">
                    <span className="card-name">{name}</span>
                    <span className="card-school">{schoolName}</span>
                  </div>
                  <span className="card-accuracy">{accuracy}</span>
                  <button
                    className="card-toggle-btn"
                    onClick={(e) => handleToggleClick(e, userId)}
                    aria-label={isOpen ? '분석 결과 접기' : '분석 결과 펼치기'}
                    >
                    {isOpen ? '▲' : '▼'}
                </button>
                </div>

                <div className="card-meta">
                  <span className="card-major">{major}</span>
                  <span className="card-gpa">{gpa?.toFixed(2)}</span>
                </div>


              </div>

              

              {isOpen && (
                <div className="card-details">
                  <div className="detail-section">
                    <div className="card-keywords">
                        {keywords?.slice(0, 3).map((kw, idx) => (
                            <KeywordTag key={idx}>{kw}</KeywordTag>
                        ))}
                        {keywords?.length > 3 && (
                            <span className="more-keywords">+{keywords.length - 3}</span>
                        )}
                    </div>
                    <span className="detail-label">분석 근거</span>
                    <p className="detail-reason">
                      {matchReason || '분석 결과가 없습니다.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResultsSidebar;