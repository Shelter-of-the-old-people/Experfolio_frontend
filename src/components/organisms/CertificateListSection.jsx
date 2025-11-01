import React, { useState } from 'react';
import CertificateItemCard from '../molecules/CertificateItemCard';
import CertificateInputForm from '../molecules/CertificateInputForm';

const CertificateListSection = () => {
  const [certs, setCerts] = useState([]);
  const handleAdd = cert => setCerts(prev => [...prev, { ...cert, id: Date.now() }]);
  const handleEdit = id => { /* 편집 모달 등 구현 */ };
  const handleDelete = id => setCerts(prev => prev.filter(c => c.id !== id));
  return (
    <div>
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
      <CertificateInputForm onAdd={handleAdd} />
    </div>
  );
};
export default CertificateListSection;
