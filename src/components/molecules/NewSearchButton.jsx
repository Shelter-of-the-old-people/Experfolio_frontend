import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
// --- [삭제] 1. 전용 CSS파일 임포트를 삭제합니다. ---
// import '../../styles/components/NewSearchButton.css';

// --- [추가] 2. 검색창 인디케이터의 CSS를 함께 사용합니다. ---
// (이 CSS는 main.jsx에 이미 등록되어 있습니다)
import '../../styles/components/SearchQueryIndicator.css'; 

/**
 * '새 검색' 페이지로 이동하는 버튼 (molecule)
 * SearchQueryIndicator와 동일한 디자인(inactive 상태)을 가집니다.
 */
const NewSearchButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(routes.SEARCH);
  };

  // --- [추가] 3. '새 검색' 전용 아이콘 경로 (임의 지정) ---
  // (public/icons/new-search-document.svg 파일이 필요합니다)
  const iconSrc = "/icons/new-search-document.svg"; 

  return (
    // --- [수정] 4. <Button> atom 대신, SearchQueryIndicator와
    // 동일한 HTML 구조와 CSS 클래스를 사용합니다.
    <button 
      type="button" 
      // 'inactive' (흰색 배경) 스타일을 적용합니다.
      className="search-query-indicator inactive"
      onClick={handleClick}
    >
      <img src={iconSrc} alt="" className="indicator-icon" />
      <span className="indicator-text">새 검색</span>
    </button>
  );
};

export default NewSearchButton;