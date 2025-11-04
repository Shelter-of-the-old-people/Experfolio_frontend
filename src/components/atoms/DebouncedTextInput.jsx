import React, { useState, useEffect } from 'react';
import { TextInput } from './'; // 원본 TextInput 임포트

// 원본 TextInput을 래핑하거나 로직을 복제하여 onBlur 기능을 추가합니다.
// 여기서는 로직을 복제하여 Debounced 버전을 만듭니다.

const DebouncedTextInput = ({
  value = '',
  onChange, // 이 onChange는 onBlur 시점에 호출됩니다.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      onChange(internalValue); // 포커스가 떠날 때만 부모에게 알림
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
          type="text" // (단순화, 필요시 getInputType() 복원)
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur} // onBlur 저장 로직
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