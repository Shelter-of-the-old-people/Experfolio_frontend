import React from 'react';

const DateInput = ({
  value = '',
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  min,
  max,
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
      
      <input
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        className={getInputClassName()}
        {...props}
      />
    </div>
  );
};

export default DateInput;
