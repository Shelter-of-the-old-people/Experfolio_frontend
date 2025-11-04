import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '../../routes';
import '../../styles/components/SearchQueryIndicator.css';

/**
 * 현재 페이지 위치에 따라 상태가 변하는 인디케이터 (molecule)
 * '/search' 경로에서 비활성화(흰색)됩니다.
 */
const SearchQueryIndicator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- [수정] 1. '/search' 페이지인지 확인하는 변수 ---
  const isSearchPage = location.pathname === routes.SEARCH;
  
  // --- [수정] 2. 논리를 반대로 뒤집습니다. ---
  // '/search' 페이지면 'inactive' (흰색), 그 외에는 'active' (검은색)
  const stateClassName = isSearchPage ? 'inactive' : 'active';
  
  // --- [수정] 3. 텍스트도 조건에 맞게 뒤집습니다. ---
  // '/search' 페이지면 '검색창', 그 외에는 '대시보드'
  const displayText = isSearchPage ? '검색창' : '대시보드';
  
  const iconSrc = "/icons/dashboard-grid.svg"; 

  const handleClick = () => {
    // --- [수정] 4. 클릭 시 로직도 변경 ---
    if (isSearchPage) {
      // (검색창) 이미 /search이므로 아무것도 안 하거나, 검색을 실행할 수 있습니다.
      // 여기서는 우선 /search 경로를 유지하도록 합니다.
      navigate(routes.SEARCH);
    } else {
      // (대시보드) 홈(/)으로 이동합니다.
      navigate(routes.HOME);
    }
  };

  return (
    <button 
      type="button" 
      className={`search-query-indicator ${stateClassName}`}
      onClick={handleClick}
    >
      <img src={iconSrc} alt="" className="indicator-icon" />
      <span className="indicator-text">{displayText}</span>
    </button>
  );
};

export default SearchQueryIndicator;