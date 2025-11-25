/* 수정 파일: shelter-of-the-old-people/experfolio_frontend/Experfolio_frontend-kmh/src/pages/company/SearchResultsPage.jsx */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { SearchResultCard, SearchResultHeader } from '../../components/organisms';
import useSearchStore from '../../stores/useSearchStore'; // [추가] 스토어 임포트
import '../../styles/pages/SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); 

  // [추가] Zustand 스토어에서 상태와 함수 가져오기
  const { lastQuery, cachedResults, setSearchCache } = useSearchStore();

  // [수정] 캐시된 검색어와 현재 검색어가 같으면 캐시된 데이터를 초기값으로 사용
  const hasCache = query && query === lastQuery && cachedResults;

  const [searchResult, setSearchResult] = useState(hasCache ? cachedResults : null); 
  const [loading, setLoading] = useState(!hasCache); // 캐시가 있으면 로딩 안 함
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

    // [추가] 캐시된 데이터가 있고 검색어가 같으면 API 호출 생략
    if (query === lastQuery && cachedResults) {
      setSearchResult(cachedResults);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/v1/search', { query });
        
        const data = response.data.data;
        setSearchResult(data);
        
        // [추가] 성공 시 스토어에 검색어와 결과 저장
        setSearchCache(query, data);
        
      } catch (err) {
        setError(err.message || '검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, lastQuery, cachedResults, setSearchCache]); // 의존성 배열 업데이트
  
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
      
      {loading && (
        <div>
          <p>AI 인재를 검색 중입니다...</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            AI 기반 검색은 최대 60초 정도 소요될 수 있습니다.
          </p>
        </div>
      )}
      
      {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
      
      {searchResult && !loading && (
        <>
          <div className="search-summary">
            <p>
              <span className="query-highlight">"{query}"</span>에 대한 
              총 {searchResult.totalResults}명의 인재를 찾았습니다.
            </p>
            {searchResult.searchTime && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                검색 시간: {searchResult.searchTime}
              </p>
            )}
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