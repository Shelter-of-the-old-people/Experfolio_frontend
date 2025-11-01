import React, { useState } from 'react';
import AwardInputForm from '../molecules/AwardInputForm';
import AwardItemCard from '../molecules/AwardItemCard';

const AwardListSection = () => {
  const [awards, setAwards] = useState([]);

  const handleAdd = (award) => setAwards((prev) => [...prev, { ...award, id: Date.now() }]);
  const handleEdit = (id) => { /* 모달/폼으로 편집 로직 */ };
  const handleDelete = (id) => setAwards((prev) => prev.filter(a => a.id !== id));

  return (
    <div>
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
      <AwardInputForm onAdd={handleAdd} />
    </div>
  );
};

export default AwardListSection;