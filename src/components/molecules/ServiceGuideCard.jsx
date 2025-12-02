import React from 'react';
import '../../styles/components/ServiceGuideCard.css';

// 가이드 내용 상수 정의
const GUIDE_CONTENTS = {
  company: {
    title: "기업 / 회사",
    content: (
<>
        <p><strong>1. 인재 검색</strong></p>
        <p>원하는 조건을 문장으로 검색하여 딱 맞는 인재를 찾으세요.</p>
        <br/>
        
        <p><strong>2. 포트폴리오 검토</strong></p>
        <p>상세 프로젝트 내용과 첨부파일을 뷰어로 바로 확인하세요.</p>
        <br/>
        
        <p><strong>3. 인재 관리</strong></p>
        <p>관심 인재를 즐겨찾기하고 검토해보세요.</p>
      </>
    )
  },
  student: {
    title: "학생 / 구직자",
    content: (
      <>
        <p><strong>1. 포트폴리오 작성</strong></p>
        <p>프로젝트, 수상 경력, 자격증 등 나의 경험을 손쉽게 기록하세요.</p>
        <br/>
        
        <p><strong>2. 나만의 프로필</strong></p>
        <p>깔끔한 프로필 페이지로 나의 역량을 한눈에 보여주세요.</p>
        <br/>
        
        <p><strong>3. 더 넓은 기회</strong></p>
        <p>작성된 포트폴리오를 통해 기업들에게 나를 알리세요.</p>
      </>
    )
  },
  search: {
    title: "검색 가이드",
    content: (
      <>
        <p><strong>💡 이렇게 검색해보세요!</strong></p>
        <br/>
        <p><strong>1. 자연어 검색</strong></p>
        <p>"Java와 Spring Boot 프로젝트 경험이 있는 백엔드 개발자 찾아줘" 처럼 대화하듯 검색하세요.</p>
        <br/>
        
        <p><strong>2. 핵심 키워드 활용</strong></p>
        <p>"React, TypeScript, Node.js" 등 필요한 기술 스택을 입력해 보세요.</p>
        <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
          ※ 기술 스택이나 전문 용어는 영어로 작성하면 정확도가 올라갑니다.
        </p>
        <br/>
        
        <p><strong>3. 상세 조건 검색</strong></p>
        <p>"정보처리기사 취득, 금오공과대학교 학생" 등 구체적인 조건도 가능합니다.</p>
      </>
    )
  }
};


/**
 * 서비스 이용 가이드 카드 컴포넌트
 * @param {string} type - 'company' | 'student' (내용을 결정)
 * @param {string} title - (옵션) 직접 제목을 넣고 싶을 때 사용 (type보다 우선)
 * @param {ReactNode} children - (옵션) 직접 내용을 넣고 싶을 때 사용 (type보다 우선)
 */
const ServiceGuideCard = ({ 
  type,
  title, 
  children, 
  style = {},
  boxStyle = {}
}) => {
  // type에 맞는 데이터 가져오기 (없으면 빈 객체)
  const guideData = GUIDE_CONTENTS[type] || {};
  
  // props로 전달된 title/children이 있으면 그걸 쓰고, 없으면 type에 맞는 내용 사용
  const displayTitle = title || guideData.title;
  const displayContent = children || guideData.content;

  return (
    <div className="service-guide-card" style={style}>
      {displayTitle && <h3 className="service-guide-title">{displayTitle}</h3>}
      
      <div className="service-guide-box" style={boxStyle}>
        <div className="guide-content-wrapper">
          {displayContent}
        </div>
      </div>
    </div>
  );
};

export default ServiceGuideCard;