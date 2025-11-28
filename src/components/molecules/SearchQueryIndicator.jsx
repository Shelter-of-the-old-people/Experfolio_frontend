import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '../../routes';
import '../../styles/components/SearchQueryIndicator.css';

const SearchQueryIndicator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchPage = location.pathname === routes.SEARCH;
  const stateClassName = isSearchPage ? 'inactive' : 'active';
  const displayText = isSearchPage ? '검색창' : '대시보드';
  
  const iconSrc = "/icons/dashboard-grid.svg"; 

  const handleClick = () => {
    if (isSearchPage) {
      navigate(routes.SEARCH);
    } else {
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