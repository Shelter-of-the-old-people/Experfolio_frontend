import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { SearchResultCard, SearchResultHeader } from '../../components/organisms';
import '../../styles/pages/SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); 

  const [searchResult, setSearchResult] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  
  const [sortConfig, setSortConfig] = useState({ 
    key: 'matchScore', 
    direction: 'descending'
  });
  
  useEffect(() => {
    if (!query) {
      setLoading(false);
      setError('검색어가 없습니다.');
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ 실제 API 호출 (백엔드 엔드포인트에 맞게 수정)
        const response = await api.post('/v1/search/portfolios', { query });
        setSearchResult(response.data.data); // 정규화된 응답에서 data 추출
        
      } catch (err) {
        setError(err.message || '검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]); 
  
  const sortedCandidates = useMemo(() => {
    if (!searchResult?.candidates) return [];
    
    const sortableCandidates = [...searchResult.candidates]; 
    
    sortableCandidates.sort((a, b) => {
      const aInfo = a.userInfo || {};
      const bInfo = b.userInfo || {};

      let aValue, bValue;

      if (sortConfig.key === 'grade') {
        aValue = aInfo.gpa || 0;
        bValue = bInfo.gpa || 0;
      } else if (sortConfig.key === 'awards') {
        aValue = aInfo.awardsCount || 0;
        bValue = bInfo.awardsCount || 0;
      } else { 
        aValue = a.matchScore || 0;
        bValue = b.matchScore || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableCandidates;
  }, [searchResult, sortConfig]); 

  const handleSort = (key) => {
    setSortConfig(currentConfig => {
      const direction = currentConfig.key === key && currentConfig.direction === 'ascending'
        ? 'descending'
        : 'ascending';
      return { key, direction };
    });
  };

  return (
    <div className="search-results-page">
      <h1>검색 결과</h1>
      
      {loading && <p>AI 인재를 검색 중입니다...</p>}
      {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
      
      {searchResult && !loading && (
        <>
          <div className="search-summary">
            <p>
              <span className="query-highlight">"{query}"</span>에 대한 
              총 {searchResult.totalResults}명의 인재를 찾았습니다.
            </p>
          </div>

          <SearchResultHeader 
            sortConfig={sortConfig} 
            onSort={handleSort} 
          />

          <div className="search-results-list">
            {sortedCandidates.map((candidate) => (
              <SearchResultCard 
                key={candidate.userId} 
                candidate={candidate} 
              />
            ))}
          </div>
          
          {sortedCandidates.length === 0 && (
            <p>"{query}"에 대한 검색 결과가 없습니다.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;