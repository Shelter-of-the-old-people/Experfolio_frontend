import React from 'react';

const TextArea = ({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  rows = 4,
  maxLength,
  showCount = false,
  ...props
}) => {
  const getTextAreaClassName = () => {
    let classes = ['textarea'];
    
    if (error) {
      classes.push('textarea-error');
    }
    
    if (disabled) {
      classes.push('textarea-disabled');
    }
    
    return classes.join(' ');
  };

  const getLabelClassName = () => {
    let classes = ['textarea-label'];
    
    if (error) {
      classes.push('textarea-label-error');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="textarea-wrapper">
      <div className="textarea-label-wrapper">
        {label && (
          <label className={getLabelClassName()}>
            {label}
            {required && <span className={`textarea-required ${error ? 'textarea-required-error' : ''}`}>*</span>}
          </label>
        )}
        {error && errorMessage && (
          <span className="textarea-error-message">{errorMessage}</span>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={getTextAreaClassName()}
        {...props}
      />
      
      {showCount && maxLength && (
        <div className="textarea-count">
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default TextArea;
