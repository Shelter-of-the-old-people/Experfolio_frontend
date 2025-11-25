import React, { useState } from 'react';
// --- [추가] 1. Link와 routes를 임포트합니다. ---
import { Link } from 'react-router-dom';
import { routes } from '../../routes';
import '../../styles/components/BookmarkSection.css';

/**
 * 즐겨찾기한 인재 목록을 보여주는 토글 섹션 (molecule)
 * @param {Array} talents - 즐겨찾기한 인재 객체 배열
 */
const BookmarkSection = ({ talents = [] }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bookmark-section">
      {/* 1. 토글 헤더 */}
      <button 
        type="button" 
        className="bookmark-header" 
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className="bookmark-title">즐겨찾기</span>
        <img 
          src="/dropdown-arrow.svg" 
            alt="토글 화살표"
          className={`bookmark-toggle-arrow ${isOpen ? 'open' : ''}`} 
        />
      </button>

      {/* 2. 인재 목록 */}
      {isOpen && (
        <ul className="bookmark-list">
          {talents.length > 0 ? (
            talents.map((talent) => (
              // --- [수정] 2. <li> 태그 안에 <Link>를 추가합니다. ---
              <li key={talent.id} className="bookmark-item">
                <Link 
                  // routes.js의 TALENT_DETAIL 경로('/talent/:id')를 사용합니다.
                  to={routes.TALENT_DETAIL.replace(':id', talent.id)} 
                  className="bookmark-item-link"
                >
                  <img
                    src={talent.avatarUrl || '/profile-default.svg'}
                    alt={talent.name}
                    className="bookmark-item-avatar"
                  />
                  <span className="bookmark-item-name">{talent.name}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="bookmark-item-empty">
              즐겨찾기한 인재가 없습니다.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default BookmarkSection;