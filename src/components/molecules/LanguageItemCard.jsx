import React from 'react';
import IconButton from '../atoms/IconButton';
import '../../styles/components/LanguageItemCard.css';

const LanguageItemCard = ({ lang, onEdit, onDelete }) => (
  <div className="item-card">
    <span className="item-title">{lang.testName}</span>
    <span className="item-score">{lang.score}점</span>
    <span className="item-actions">
      <IconButton icon={<img src="/icons/edit.svg" alt="편집" />} ariaLabel="편집" onClick={() => onEdit(lang.id)} />
      <IconButton icon={<img src="/icons/delete.svg" alt="삭제" />} ariaLabel="삭제" onClick={() => onDelete(lang.id)} />
    </span>
    <span className="item-date">{lang.year}년 {lang.month}월</span>
  </div>
);

export default LanguageItemCard;
