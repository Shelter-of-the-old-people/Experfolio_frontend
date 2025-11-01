import React, { useState } from 'react';
import LanguageItemCard from '../molecules/LanguageItemCard';
import LanguageInputForm from '../molecules/LanguageInputForm';

const LanguageListSection = () => {
  const [langs, setLangs] = useState([]);
  const handleAdd = lang => setLangs(prev => [...prev, { ...lang, id: Date.now() }]);
  const handleEdit = id => { /* 편집 로직 */ };
  const handleDelete = id => setLangs(prev => prev.filter(l => l.id !== id));
  return (
    <div>
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
      <LanguageInputForm onAdd={handleAdd} />
    </div>
  );
};
export default LanguageListSection;
