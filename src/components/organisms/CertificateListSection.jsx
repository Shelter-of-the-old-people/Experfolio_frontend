import React, { useState } from 'react';
import CertificateItemCard from '../molecules/CertificateItemCard';
import CertificateInputForm from '../molecules/CertificateInputForm';
// Award 폼 CSS를 임포트하여 섹션 스타일 재사용
import '../../styles/components/AwardInputForm.css'; 

const CertificateListSection = () => {
  const [certs, setCerts] = useState([]);
  const handleAdd = cert => setCerts(prev => [...prev, { ...cert, id: Date.now() }]);
  const handleEdit = id => { /* 편집 모달 등 구현 */ };
  const handleDelete = id => setCerts(prev => prev.filter(c => c.id !== id));
  
  return (
    // 1. Award 섹션과 동일한 래퍼 클래스 적용
    <div className="award-section"> 
      
      {/* 2. 목록 상단에 타이틀 추가 */}
      <div className='awards-list-section'>
        <h3 className="award-title">자격증</h3>
        <div className="certs-list">
          {certs.map(item => (
            <CertificateItemCard
              key={item.id}
              cert={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* 3. 입력 폼 상단에 헤더(타이틀+설명) 추가 */}
      <div className='award-input-section'>
        <div className="award-section-header">
          <span className="award-title">자격증</span>
          <span className="award-desc">자격증을 추가해주세요.</span>
        </div>
        <CertificateInputForm onAdd={handleAdd} />
      </div>

    </div>
  );
};
export default CertificateListSection;