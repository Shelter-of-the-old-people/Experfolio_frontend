import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * 인재 프로필 상세 페이지
 * 경로: /talent/:id
 * 
 * 채용담당자가 검색 결과에서 특정 인재를 선택했을 때 보여지는 상세 페이지입니다.
 */
const SearchProfilePage = () => {
  // URL 파라미터에서 :id 값을 가져옵니다.
  const { id } = useParams();

  // TODO: 이 id를 사용하여 API를 호출하여 상세 정보를 가져옵니다.
  // 예: GET /v1/portfolios/{id}

  return (
    <div className="search-profile-page" style={{ padding: '24px' }}>
      <h1>인재 프로필 상세</h1>
      <p>
        요청된 인재 ID: <strong>{id}</strong>
      </p>
      <p style={{ color: '#666', marginTop: '16px' }}>
        (구현 예정) 이 페이지에서는 선택된 인재의 상세 포트폴리오 정보를 표시합니다.
      </p>
      
      {/* 
        TODO: 다음 API를 호출하여 데이터를 가져옵니다:
        - GET /v1/portfolios/{id}
        
        표시할 정보:
        - 기본 정보 (이름, 학교, 전공, 성적)
        - 학력 정보
        - 경력 정보
        - 기술 스택
        - 자격증
        - 프로젝트
        - 수상 이력
        - 어학 점수
        - 포트폴리오 링크
      */}
    </div>
  );
};

export default SearchProfilePage;