import React from 'react';
import AwardInputForm from '../molecules/AwardInputForm';
import AwardItemCard from '../molecules/AwardItemCard';
import '../../styles/components/AwardInputForm.css';

const AwardListSection = ({ awards = [], onAdd, onDelete, onEdit = () => {} }) => {
  const handleAdd = (award) => onAdd(award); 
  const handleDelete = (id) => onDelete(id);
  const handleEdit = (id) => onEdit(id);

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