import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes';
import '../../styles/components/BookmarkSection.css';

const BookmarkSection = ({ talents = [] }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bookmark-section">
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

      {isOpen && (
        <ul className="bookmark-list">
          {talents.length > 0 ? (
            talents.map((talent) => (
              <li key={talent.id} className="bookmark-item">
                <Link 
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