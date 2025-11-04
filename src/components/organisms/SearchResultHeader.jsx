import React from 'react';
// SearchResultCard의 CSS를 재사용합니다.
import '../../styles/components/SearchResultCard.css'; 

/**
 * 정렬 헤더 (organism)
 * @param {object} sortConfig - 현재 정렬 상태 { key, direction }
 * @param {function(string)} onSort - 정렬할 키(key)를 전달하는 콜백
 */
const SearchResultHeader = ({ sortConfig, onSort }) => {
  
  const renderSortableHeader = (key, label) => {
    const isActive = sortConfig.key === key;
    // --- [수정] 1. '정확도'의 키(key)도 'matchScore'에서 'accuracy'로 변경합니다. ---
    // (CSS 클래스와 데이터 키를 일치시킴)
    const arrow = isActive ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▼';
    
    return (
      <button 
        type="button" 
        // .summary-item 클래스를 재사용하고, .sortable을 추가합니다.
        // `key` 변수(예: 'grade', 'awards', 'accuracy')가 클래스명이 됩니다.
        className={`summary-item ${key} sortable ${isActive ? 'active' : ''}`}
        onClick={() => onSort(key)}
      >
        {label}
        <span className="sort-arrow">{arrow}</span>
      </button>
    );
  };

  return (
    <div className="search-card-summary header-only">
      <div className="summary-icon-placeholder" />
      
      <span className="summary-item name">이름</span>
      <span className="summary-item school">학교</span>
      <span className="summary-item dept">학과</span>
      
      {renderSortableHeader('grade', '성적')}
      {renderSortableHeader('awards', '수상이력')}
      
      {/* --- [수정] 2. key 값을 'matchScore' -> 'accuracy'로 변경 --- */}
      {/* 이제 이 버튼은 .summary-item.accuracy.sortable 클래스를 갖게 됩니다. */}
      {renderSortableHeader('accuracy', '정확도')}
      
      <div className="summary-button-placeholder" />
    </div>
  );
};

export default SearchResultHeader;