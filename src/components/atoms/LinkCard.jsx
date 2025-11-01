import React from 'react';
import '../../styles/components/LinkCard.css';

const LinkCard = ({
  icon,
  label,
  url,
  onRemove,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`link-card${disabled ? ' link-card-disabled' : ''}`}>
      <div className="link-card-main-row">
        <button
          type="button"
          className="link-card-content"
          onClick={handleClick}
          disabled={disabled}
          tabIndex={0}
        >
          {icon && (
            <span className="link-card-icon">{icon}</span>
          )}
          <span className="link-card-label">{label}</span>
        </button>
        {onRemove && !disabled && (
          <button
            type="button"
            className="link-card-remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="링크 제거"
            tabIndex={0}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default LinkCard;
