import React from 'react';

const Select = ({
  label,
  value = '',
  onChange,
  options = [],
  placeholder = '선택하세요',
  disabled = false,
  error = false,
  errorMessage,
  required = false,
  ...props
}) => {
  const getSelectClassName = () => {
    let classes = ['select'];
    
    if (error) {
      classes.push('select-error');
    }
    
    if (disabled) {
      classes.push('select-disabled');
    }
    
    return classes.join(' ');
  };

  const getLabelClassName = () => {
    let classes = ['select-label'];
    
    if (error) {
      classes.push('select-label-error');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="select-wrapper">
      <div className="select-label-wrapper">
        {label && (
          <label className={getLabelClassName()}>
            {label}
            {required && <span className={`select-required ${error ? 'select-required-error' : ''}`}>*</span>}
          </label>
        )}
        {error && errorMessage && (
          <span className="select-error-message">{errorMessage}</span>
        )}
      </div>
      
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={getSelectClassName()}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option 
            key={option.value || index} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
