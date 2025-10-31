import React from 'react';

const LinkCard = ({
  icon,
  label,
  url,
  onRemove,
  disabled = false
}) => {
  const handleClick = () => {
    if (!disabled && url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`link-card ${disabled ? 'link-card-disabled' : ''}`}>
      <button
        type="button"
        className="link-card-content"
        onClick={handleClick}
        disabled={disabled}
      >
        {icon && (
          <span className="link-card-icon">
            {icon}
          </span>
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
        >
          ×
        </button>
      )}
    </div>
  );
};

export default LinkCard;
