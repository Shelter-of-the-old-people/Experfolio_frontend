import React, { useState } from 'react';
import AwardInputForm from '../molecules/AwardInputForm';
import AwardItemCard from '../molecules/AwardItemCard';
// 1. 필요한 CSS 파일을 임포트합니다.
import '../../styles/components/AwardInputForm.css';

const AwardListSection = () => {
  const [awards, setAwards] = useState([]);

  const handleAdd = (award) => setAwards((prev) => [...prev, { ...award, id: Date.now() }]);
  const handleEdit = (id) => { /* 모달/폼으로 편집 로직 */ };
  const handleDelete = (id) => setAwards((prev) => prev.filter(a => a.id !== id));

  return (
    <div className="award-section">
      
      <div className='awards-list-section'>
        <h3 className="award-title">수상경력</h3>
        <div className="awards-list">
          {awards.map(item => (
            <AwardItemCard
              key={item.id}
              award={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <div className='award-input-section'>
        <div className="award-section-header">
          <span className="award-title">수상경력</span>
          <span className="award-desc">수상경력을 추가해주세요.</span>
        </div>
        <AwardInputForm onAdd={handleAdd} />
      </div>

    </div>
  );
};

export default AwardListSection;