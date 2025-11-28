import React from 'react';

const Button = ({ 
  as: Component = 'button', 
  variant = 'black',
  size = 'default',
  type = 'button',
  icon,
  children,
  disabled = false,
  onClick,
  ...props 
}) => {
  const getClassName = () => {
    let classes = ['btn'];
    classes.push(`btn-${variant}`);
    classes.push(`btn-${size}`);
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

  const buttonProps = Component === 'button' ? { type } : {};

  return (
    <Component 
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
      {...props}     
    >
      {renderIcon()}
      {children && <span className="btn-text">{children}</span>}
    </Component>
  );
};

export default Button;