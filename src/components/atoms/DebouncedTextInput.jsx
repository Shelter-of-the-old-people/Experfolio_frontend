import React, { useState, useEffect } from 'react';
import { TextInput } from './';
const DebouncedTextInput = ({
  value = '',
  onChange, 
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const getInputClassName = () => {
    let classes = ['input'];
    if (error) classes.push('input-error');
    if (disabled) classes.push('input-disabled');
    return classes.join(' ');
  };
  
  const getLabelClassName = () => {
    let classes = ['input-label'];
    if (error) classes.push('input-label-error');
    return classes.join(' ');
  };

  const handleChange = (e) => {
    setInternalValue(e.target.value);
  };

  const handleBlur = () => {
    if (onChange && internalValue !== value) {
      onChange(internalValue); 
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
        <input
          type="text" 
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur} 
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          {...props}
        />
      </div>
    </div>
  );
};

export default DebouncedTextInput;