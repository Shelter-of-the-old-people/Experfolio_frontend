import React from 'react';
import '../../styles/components/LinkCard.css';

const LinkCard = ({
  icon,
  label,
  desc,
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
        <span className="link-card-icon">{icon ||
          <span style={{ width: 22, height: 21, display: 'inline-block' }}></span>}
        </span>
        <div className="link-card-meta">
          <span className="link-card-label">{label}</span>
          {desc && <span className="link-card-desc">{desc}</span>}
        </div>
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
