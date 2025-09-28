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
    let inputValue = e.target.value;
    
    // 숫자가 아닌 문자 제거
    inputValue = inputValue.replace(/[^0-9]/g, '');
    
    // 자릿수 제한 (maxLength 속성 지원)
    if (props.maxLength && inputValue.length > props.maxLength) {
      inputValue = inputValue.slice(0, props.maxLength);
    }
    
    // max 값 제한
    if (max !== undefined && inputValue !== '' && Number(inputValue) > max) {
      inputValue = max.toString();
    }
    
    // min 값 제한  
    if (min !== undefined && inputValue !== '' && Number(inputValue) < min) {
      inputValue = min.toString();
    }
    
    const numValue = inputValue === '' ? undefined : inputValue;
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
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
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

    </div>
  );
};

export default NumberInput;