import React from 'react'; 
import LanguageItemCard from '../molecules/LanguageItemCard';
import LanguageInputForm from '../molecules/LanguageInputForm';
import '../../styles/components/AwardInputForm.css';

const LanguageListSection = ({ langs = [], onAdd, onDelete, onEdit = () => {} }) => {
  const handleAdd = lang => onAdd(lang);
  const handleEdit = id => onEdit(id);
  const handleDelete = id => onDelete(id);
  
  return (
    <div className="award-section">
      
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