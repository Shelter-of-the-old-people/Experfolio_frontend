import React, { useState } from 'react';
import '../../styles/components/SearchBar.css';

/**
 * 폼 제출(Enter 또는 클릭) 시 onSearch 콜백을 호출하는 검색창 (molecule)
 * @param {function(string)} onSearch - 검색어가 
 * @param {string} placeholder - placeholder 텍스트
 * @param {boolean} disabled - 비활성화 여부
 */
const SearchBar = ({ onSearch, placeholder, disabled = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSearch(query);
    }
  };

  return (
    // 폼으로 감싸 Enter 키로 제출 가능하게 함
    <form onSubmit={handleSubmit} className="search-bar-wrapper">
      <input
        type="text"
        className="search-bar-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button 
        type="submit" 
        className="search-bar-button" 
        disabled={disabled}
        aria-label="검색"
      >
        {/* (아이콘 경로는 public/icons/search.svg 라고 가정합니다) */}
        <img src="/icons/search.svg" alt="검색" />
      </button>
    </form>
  );
};

export default SearchBar;