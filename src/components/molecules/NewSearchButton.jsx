import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

import '../../styles/components/SearchQueryIndicator.css'; 

const NewSearchButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(routes.SEARCH);
  };
  const iconSrc = "/search.svg"; 

  return (
    <button 
      type="button" 
      className="search-query-indicator inactive"
      onClick={handleClick}
    >
      <img src={iconSrc} alt="" className="indicator-icon" />
      <span className="indicator-text">새 검색</span>
    </button>
  );
};

export default NewSearchButton;