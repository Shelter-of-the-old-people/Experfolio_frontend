import React from 'react';

const NumberInput = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  ...props
}) => {
  const handleChange = (e) => {
    const numValue = e.target.value === '' ? undefined : Number(e.target.value);
    onChange?.(numValue);
  };

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

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-container">
        <input
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          {...props}
        />
      </div>
      
      {error && errorMessage && (
        <span className="input-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

export default NumberInput;