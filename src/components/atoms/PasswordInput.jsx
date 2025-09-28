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

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { level: 1, text: '약함' };
    if (score <= 3) return { level: 2, text: '보통' };
    if (score <= 4) return { level: 3, text: '강함' };
    return { level: 4, text: '매우 강함' };
  };

  const strength = strengthIndicator ? getPasswordStrength(value) : null;

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
      
      {strengthIndicator && value && (
        <div className="password-strength">
          <div className={`password-strength-bar strength-${strength.level}`}>
            <div className="password-strength-fill"></div>
          </div>
          <span className="password-strength-text">{strength.text}</span>
        </div>
      )}
      

    </div>
  );
};

export default PasswordInput;