import React from 'react';
import '../../styles/components/SaveStatusIndicator.css';

const SaveStatusIndicator = ({ status }) => {
  const getStatusContent = () => {
    switch (status) {
      case 'saving':
        return { icon: '⧖', text: '저장 중...' };
      case 'saved':
        return { icon: '✓', text: '모든 변경 사항이 저장되었습니다.' };
      case 'error':
        return { icon: '✗', text: '저장에 실패했습니다.' };
      case 'idle':
      default:
        return { icon: '', text: '' };
    }
  };

  const { icon, text } = getStatusContent();

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={`save-status-indicator ${status}`}>
      <span className="save-status-icon">{icon}</span>
      <span className="save-status-text">{text}</span>
    </div>
  );
};

export default SaveStatusIndicator;