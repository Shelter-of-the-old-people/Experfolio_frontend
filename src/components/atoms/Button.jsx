import React from 'react';

const Button = ({ 
  as: Component = 'button', // 'as' prop을 Component 변수로 받음 (기본값 'button')
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

  // 'button' 태그일 때만 type prop을 전달
  const buttonProps = Component === 'button' ? { type } : {};

  return (
    <Component 
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps} // type prop 조건부 전달
      {...props}       // 'to', 'href' 등 나머지 props 전달
    >
      {renderIcon()}
      {children && <span className="btn-text">{children}</span>}
    </Component>
  );
};

export default Button;