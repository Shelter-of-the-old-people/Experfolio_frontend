import React from 'react';
import '../../styles/components/ServiceGuideCard.css';

// 가이드 내용 상수 정의
const GUIDE_CONTENTS = {
  company: {
    title: "기업 / 회사",
    content: (
      <>
        <p><strong>1. AI 인재 검색</strong></p>
        <p>"React 잘하는 프론트엔드 개발자 찾아줘" 처럼 자연어로 검색하세요.</p>
        <br/>
        <p><strong>2. 맞춤 인재 추천</strong></p>
        <p>직무와 기술 스택 분석을 통해 우리 회사에 딱 맞는 인재를 추천받으세요.</p>
        <br/>
        <p><strong>3. 간편한 인재 관리</strong></p>
        <p>관심 있는 인재를 즐겨찾기하고 프로필을 손쉽게 검토하세요.</p>
      </>
    )
  },
  student: {
    title: "학생 / 구직자",
    content: (
      <>
        <p><strong>1. 손쉬운 포트폴리오 관리</strong></p>
        <p>프로젝트, 수상 경력, 자격증 등 나의 경험을 체계적으로 정리하세요.</p>
        <br/>
        <p><strong>2. 나만의 커리어 브랜딩</strong></p>
        <p>깔끔한 디자인의 프로필 페이지로 나의 역량을 효과적으로 보여주세요.</p>
        <br/>
        <p><strong>3. 채용 기회 연결</strong></p>
        <p>작성한 포트폴리오를 통해 더 많은 기업에게 나의 가능성을 알리세요.</p>
      </>
    )
  },
  search: {
    title: "검색 가이드",
    content: (
      <>
        <p><strong>💡 이렇게 검색해보세요!</strong></p>
        <br/>
        <p><strong>• 자연스러운 문장으로</strong></p>
        <p>"서울에 사는 3년차 자바 개발자 찾아줘"</p>
        <br/>
        <p><strong>• 구체적인 기술 스택으로</strong></p>
        <p>"Spring Boot와 AWS 경험이 있는 백엔드 개발자"</p>
        <br/>
        <p><strong>• 특정 조건을 포함해서</strong></p>
        <p>"정보처리기사 자격증이 있고 학점이 3.5 이상인 사람"</p>
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