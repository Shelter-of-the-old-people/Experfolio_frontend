import React from 'react';
import IconButton from '../atoms/IconButton';
import '../../styles/components/AwardItemCard.css';

const AwardItemCard = ({ award, onEdit, onDelete }) => (
  <div className="award-item-card">
    <span className="card-prize">{award.prize}</span>
    <span className="card-title">{award.title}</span>
    <span className="card-actions">
      <IconButton
    icon={<img src="/edit.svg" alt="편집"/>}
    ariaLabel="편집"
    onClick={() => onEdit(award.id)}
  />
      <IconButton
    icon={<img src="/delete.svg" alt="삭제"/>}
    ariaLabel="삭제"
    onClick={() => onDelete(award.id)}
  />
    </span>
    <span className="card-date">{award.year}년 {award.month}월</span>
  </div>
);
export default AwardItemCard;
