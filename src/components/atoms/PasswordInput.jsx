import React, { useState } from 'react';

const PasswordInput = ({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  showPasswordToggle = true,
  strengthIndicator = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

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
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          autoComplete="current-password"
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            <img 
              src={showPassword ? '/eyeon.svg' : '/eyeoff.svg'} 
              alt={showPassword ? 'Hide password' : 'Show password'}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;