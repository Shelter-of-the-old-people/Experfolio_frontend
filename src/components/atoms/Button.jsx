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

  return (
    <button 
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
};

export default Button;