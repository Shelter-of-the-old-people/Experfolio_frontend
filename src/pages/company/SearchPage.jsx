import React, { useState } from 'react';
import api from '../../services/api';
import { useLazyApi } from '../../hooks/useApi';
import { TextInput, Button } from '../../components/atoms';
// import { SearchResultCard } from '../../components/organisms'; // (추후 구현 필요)

const SearchPage = () => {
  const [query, setQuery] = useState('');

  // AI 검색 API 호출을 위한 useLazyApi 훅 사용
  // POST /ai/search 엔드포인트 호출 (app/api/routers/search.py)
  const { 
    data: searchResult, 
    loading, 
    error, 
    execute: executeSearch 
  } = useLazyApi((searchQuery) => 
    api.post('/ai/search', { query: searchQuery })
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      executeSearch(query);
    }
  };

  return (
    <div className="search-page">
      <h1>인재 검색</h1>
      <p>AI 기반 자연어 검색으로 원하는 인재를 찾아보세요.</p>
      
      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="search-form-container">
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="예: React와 TypeScript 경험이 있는 프론트엔드 개발자"
          disabled={loading}
        />
        <Button 
          type="submit" 
          variant="black" 
          disabled={loading || !query.trim()}
        >
          {loading ? '검색 중...' : '검색'}
        </Button>
      </form>

      {/* 검색 결과 */}
      <div className="search-results-container">
        {error && (
          <div className="search-error">
            <p>오류가 발생했습니다: {error.message}</p>
          </div>
        )}

        {searchResult && (
          <div className="search-summary">
            <p>
              총 {searchResult.data.totalResults}명의 인재를 찾았습니다. 
              (검색 시간: {searchResult.data.searchTime})
            </p>
          </div>
        )}

        <div className="search-results-list">
          {searchResult?.data.candidates.map((candidate) => (
            // (추후 SearchResultCard 컴포넌트로 교체)
            <div key={candidate.userId} className="search-result-item" style={{border: '1px solid #ddd', padding: '16px', margin: '16px 0'}}>
              <h4>{candidate.userId} (임시)</h4>
              <p><strong>매칭 점수:</strong> {(candidate.matchScore * 100).toFixed(1)}점</p>
              <p><strong>매칭 이유:</strong> {candidate.matchReason}</p>
              <div>
                {candidate.keywords.map((kw, idx) => (
                  <span key={idx} style={{background: '#eee', padding: '4px 8px', borderRadius: '4px', marginRight: '8px'}}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;