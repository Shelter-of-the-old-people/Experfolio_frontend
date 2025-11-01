import React from 'react';
import IconButton from '../atoms/IconButton';

const AwardItemCard = ({ award, onEdit, onDelete }) => {
  return (
    <div
      className="award-item-card"
      onMouseEnter={() => {/* hover 스타일 적용 */}}
      onMouseLeave={() => {/* hover 해제 */}}
    >
      <div className="award-item-main">
        <div className="award-title">{award.title}</div>
        <div className="award-date">{award.date}</div>
      </div>
      <div className="award-item-meta">
        <div className="award-prize">{award.prize}</div>
        <div className="award-desc">{award.description}</div>
      </div>
      <div className="award-card-actions">
        <IconButton icon="edit" ariaLabel="편집" onClick={() => onEdit(award.id)} />
        <IconButton icon="delete" ariaLabel="삭제" onClick={() => onDelete(award.id)} />
      </div>
    </div>
  );
};

export default AwardItemCard;
