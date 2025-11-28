import React from 'react'; 
import CertificateItemCard from '../molecules/CertificateItemCard';
import CertificateInputForm from '../molecules/CertificateInputForm';
import '../../styles/components/AwardInputForm.css'; 

const CertificateListSection = ({ certs = [], onAdd, onDelete, onEdit = () => {} }) => {
  const handleAdd = cert => onAdd(cert);
  const handleEdit = id => onEdit(id);
  const handleDelete = id => onDelete(id);
  
  return (
    <div className="award-section"> 
      
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