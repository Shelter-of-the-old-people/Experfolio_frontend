import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

import '../../styles/components/SearchQueryIndicator.css'; 

const NewSearchButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(routes.SEARCH);
  };

  return (
    <button 
      type="button" 
      className="sidebar-nav-link inactive"
      onClick={handleClick}
    >
      <div className='icon-container'><img src="/search.svg" className="sidebar-icon" /></div>
      <span className="indicator-text">새 검색</span>
    </button>
  );
};

export default NewSearchButton;