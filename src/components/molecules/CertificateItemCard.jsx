import React from 'react';
import IconButton from '../atoms/IconButton';
import '../../styles/components/CertificateItemCard.css';

const CertificateItemCard = ({ cert, onEdit, onDelete }) => (
  <div className="item-card">
    <span className="item-title">{cert.name}</span>
    <span className="item-actions">
      <IconButton
    icon={<img src="/edit.svg" alt="편집"/>}
    ariaLabel="편집"
    onClick={() => onEdit(cert.id)}
  />
      <IconButton
    icon={<img src="/delete.svg" alt="삭제"/>}
    ariaLabel="삭제"
    onClick={() => onDelete(cert.id)}
  />
    </span>
    <span className="item-date">{cert.year}년{cert.month ? ` ${cert.month}월` : ''}</span>
  </div>
);

export default CertificateItemCard;
