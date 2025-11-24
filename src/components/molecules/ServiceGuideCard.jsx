import React from 'react';
import '../../styles/components/ServiceGuideCard.css'; // 2번에서 만들 스타일 파일

/**
 * 서비스 이용 가이드 카드 컴포넌트
 * @param {string} title - 가이드 상단 제목 (옵션, 없으면 박스만 표시)
 * @param {ReactNode} children - 가이드 박스 내부 내용 (텍스트 등)
 * @param {object} style - 최상위 wrapper에 적용할 커스텀 스타일
 * @param {object} boxStyle - 내부 박스(guide-box)에 적용할 커스텀 스타일
 */
const ServiceGuideCard = ({ 
  title, 
  children, 
  style = {},
  boxStyle = {}
}) => {
  return (
    <div className="service-guide-card" style={style}>
      {/* title이 있을 때만 렌더링 (예: 홈페이지에서는 있고, 개별 회원가입 페이지에서는 없음) */}
      {title && <h3 className="service-guide-title">{title}</h3>}
      
      <div className="service-guide-box" style={boxStyle}>
        {children}
      </div>
    </div>
  );
};

export default ServiceGuideCard;