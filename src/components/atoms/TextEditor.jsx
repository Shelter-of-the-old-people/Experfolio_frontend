import React from 'react';

const TextEditor = ({
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
  const getLabelClassName = () => {
    let classes = ['input-label'];
    if (error) classes.push('input-label-error');
    return classes.join(' ');
  };

  const getEditorClassName = () => {
    let classes = ['text-editor'];
    if (error) classes.push('input-error');
    if (disabled) classes.push('input-disabled');
    return classes.join(' ');
  };

  return (
    <div className="input-wrapper text-editor-wrapper">
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
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={getEditorClassName()}
          rows={10}
          {...props}
        />
      </div>
    </div>
  );
};

export default TextEditor;