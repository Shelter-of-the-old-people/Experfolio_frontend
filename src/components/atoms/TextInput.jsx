import React from 'react';

const TextInput = ({
  variant = 'text',        // 'text', 'number', 'password', 'email'
  value = '',
  onChange,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  maxLength,
  prefix,
  suffix,
  ...props
}) => {
  const getInputClassName = () => {
    let classes = ['input'];
    
    if (error) {
      classes.push('input-error');
    }
    
    if (disabled) {
      classes.push('input-disabled');
    }
    
    return classes.join(' ');
  };

  const getInputType = () => {
    switch(variant) {
      case 'number':
        return 'number';
      case 'password':
        return 'password';
      case 'email':
        return 'email';
      default:
        return 'text';
    }
  };

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-container">
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input
          type={getInputType()}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={getInputClassName()}
          {...props}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      
      {error && errorMessage && (
        <span className="input-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

export default TextInput;