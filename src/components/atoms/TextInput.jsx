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

  const getLabelClassName = () => {
    let classes = ['input-label'];
    
    if (error) {
      classes.push('input-label-error');
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
      <div className="input-label-wrapper">
        {label && (
          <label className={getLabelClassName()}>
            {label}
            {required && <span className={`input-required ${error ? 'input-required-error' : ''}`}>*</span>}
          </label>
        )}
        {error && errorMessage && (
          <span className="input-error-message">{errorMessage}</span>
        )}
      </div>
      
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
      

    </div>
  );
};

export default TextInput;