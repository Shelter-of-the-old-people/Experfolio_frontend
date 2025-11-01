import React from 'react';
import IconButton from '../atoms/IconButton';
import '../../styles/components/AwardItemCard.css';

const AwardItemCard = ({ award, onEdit, onDelete }) => (
  <div className="award-item-card">
    <span className="card-prize">{award.prize}</span>
    <span className="card-title">{award.title}</span>
    <span className="card-actions">
      <IconButton icon="edit" ariaLabel="편집" onClick={() => onEdit(award.id)} />
      <IconButton icon="delete" ariaLabel="삭제" onClick={() => onDelete(award.id)} />
    </span>
    <span className="card-date">{award.year}년 {award.month}월</span>
  </div>
);
export default AwardItemCard;
