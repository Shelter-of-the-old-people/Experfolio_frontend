import React from 'react';

const IconButton = ({ 
  icon,
  variant = 'default',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  ariaLabel,
  ...props 
}) => {
  const getClassName = () => {
    let classes = ['icon-btn'];
    
    classes.push(`icon-btn-${variant}`);
    classes.push(`icon-btn-${size}`);
    
    if (disabled) {
      classes.push('icon-btn-disabled');
    }
    
    return classes.join(' ');
  };

  return (
    <button 
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
