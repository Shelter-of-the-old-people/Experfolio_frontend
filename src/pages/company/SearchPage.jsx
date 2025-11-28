import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { SearchBar } from '../../components/molecules';

const SearchPage = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`${routes.SEARCH_RESULTS}?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="search-page">
      <div className='search-guide'>
        <h1>서비스 이용 가이드</h1>
      </div>
      <div className='search-bar'>
        <h1>인재 검색</h1>
        <p>AI 기반 자연어 검색으로 원하는 인재를 찾아보세요.</p>
        
        <SearchBar
          onSearch={handleSearch}
          placeholder="어떤 인재를 찾고 계세요?"
      />
      </div>
    </div>
  );
};

export default SearchPage;