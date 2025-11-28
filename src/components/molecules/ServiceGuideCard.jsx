import React from 'react';
import '../../styles/components/ServiceGuideCard.css'; 

const ServiceGuideCard = ({ 
  title, 
  children, 
  style = {},
  boxStyle = {}
}) => {
  return (
    <div className="service-guide-card" style={style}>
      {title && <h3 className="service-guide-title">{title}</h3>}
      
      <div className="service-guide-box" style={boxStyle}>
        {children}
      </div>
    </div>
  );
};

export default ServiceGuideCard;