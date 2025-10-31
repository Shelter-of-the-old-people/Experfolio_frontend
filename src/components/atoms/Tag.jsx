import React from 'react';

const Tag = ({ 
  children,
  variant = 'default',
  size = 'md',
  onClick,
  onRemove,
  disabled = false,
  ...props 
}) => {
  const getClassName = () => {
    let classes = ['tag'];
    
    classes.push(`tag-${variant}`);
    classes.push(`tag-${size}`);
    
    if (disabled) {
      classes.push('tag-disabled');
    }
    
    if (onClick) {
      classes.push('tag-clickable');
    }
    
    return classes.join(' ');
  };

  return (
    <span 
      className={getClassName()}
      onClick={!disabled && onClick ? onClick : undefined}
      {...props}
    >
      {children}
      {onRemove && !disabled && (
        <button 
          className="tag-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          type="button"
          aria-label="태그 제거"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default Tag;
