import React, { useState } from 'react';
import LanguageItemCard from '../molecules/LanguageItemCard';
import LanguageInputForm from '../molecules/LanguageInputForm';
// Award 폼 CSS를 임포트하여 섹션 스타일 재사용
import '../../styles/components/AwardInputForm.css';

const LanguageListSection = () => {
  const [langs, setLangs] = useState([]);
  const handleAdd = lang => setLangs(prev => [...prev, { ...lang, id: Date.now() }]);
  const handleEdit = id => { /* 편집 로직 */ };
  const handleDelete = id => setLangs(prev => prev.filter(l => l.id !== id));
  
  return (
    // 1. Award 섹션과 동일한 래퍼 클래스 적용
    <div className="award-section">
      
      {/* 2. 목록 상단에 타이틀 추가 */}
      <div className='awards-list-section'>
        <h3 className="award-title">언어</h3>
        <div className="langs-list">
          {langs.map(item => (
            <LanguageItemCard
              key={item.id}
              lang={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* 3. 입력 폼 상단에 헤더(타이틀+설명) 추가 */}
      <div className='award-input-section'>
        <div className="award-section-header">
          <span className="award-title">언어 능력</span>
          <span className="award-desc">언어 관련 시험 결과를 추가해주세요.</span>
        </div>
        <LanguageInputForm onAdd={handleAdd} />
      </div>

    </div>
  );
};
export default LanguageListSection;