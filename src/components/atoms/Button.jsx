import React from 'react';

const Button = ({ 
  variant = 'black',    // 'black', 'trans', 'circle'
  size = 'default',     // 'default', 'full', 'allfull'
  type = 'button',      // 'button', 'submit', 'reset'
  icon,
  children,
  disabled = false,
  onClick,
  ...props 
}) => {
  const getClassName = () => {
    let classes = ['btn'];
    
    // Variant classes
    classes.push(`btn-${variant}`);
    
    // Size classes  
    classes.push(`btn-${size}`);
    
    // Disabled state
    if (disabled) {
      classes.push('btn-disabled');
    }
    
    return classes.join(' ');
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <img src={icon} alt="" className="btn-icon-svg" />;
    }
    return <span className="btn-icon">{icon}</span>;
  };
  // ---

  return (
    <button 
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {renderIcon()}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
};

export default Button;