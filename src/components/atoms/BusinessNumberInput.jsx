import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from './NumberInput.jsx';

const BusinessNumberInput = ({
  value = { part1: '', part2: '', part3: '' },
  onChange,
  label = '사업자등록번호',
  required = false,
  disabled = false,
  error = false,
  errorMessage, 
  
  isValidating = false,
  isValid = false,
  validationMessage, 
  companyName, 
  showValidationButton = true,
  showCompanyName = true,
  onValidate, 
  
  ...props
}) => {
  const [localValues, setLocalValues] = useState({
    part1: value?.part1 || '',
    part2: value?.part2 || '',
    part3: value?.part3 || ''
  });

  useEffect(() => {
    if (value && typeof value === 'object') {
      setLocalValues({
        part1: value.part1 || '',
        part2: value.part2 || '',
        part3: value.part3 || ''
      });
    }
  }, [value]);

  const handlePartChange = useCallback((partName, newValue) => {
    const updatedValues = {
      ...localValues,
      [partName]: newValue || ''
    };
    
    setLocalValues(updatedValues);
    
    if (onChange) {
      onChange(updatedValues);
    }
  }, [localValues, onChange]);

  const handleReset = useCallback((e) => {
    e.stopPropagation(); 
    
    const emptyValues = { part1: '', part2: '', part3: '' };
    setLocalValues(emptyValues); 
    
    if (onChange) {
      onChange(emptyValues); 
    }
  }, [onChange]);

  const handleValidateClick = useCallback(() => {
    if (onValidate) {
      const fullNumber = `${localValues.part1}${localValues.part2}${localValues.part3}`;
      onValidate(fullNumber);
    }
  }, [localValues, onValidate]);

  const hasError = error || (validationMessage && !isValid);
  const displayErrorMessage = errorMessage || (hasError ? validationMessage : '');

  const canValidate = localValues.part1.length === 3 && 
    localValues.part2.length === 2 && 
    localValues.part3.length === 5;

  const getValidationIcon = () => {
    if (isValidating) {
      return <span className="validation-icon validating">⏳</span>;
    }
    
    if (validationMessage) { 
      if (isValid) {
        return <span className="validation-icon valid">✓</span>;
      } else {
        return (
          <span 
            className="validation-icon invalid" 
            onClick={handleReset}
            style={{ cursor: 'pointer' }}
            title="입력 초기화"
          >
            ✗
          </span>
        );
      }
    }
    
    return null;
  };

  const getLabelClassName = () => {
    let classes = ['input-label'];
    if (hasError) {
      classes.push('input-label-error');
    }
    return classes.join(' ');
  };

  return (
    <div className="business-number-input-wrapper">
      <div className="input-label-wrapper">
        {label && (
          <label className={getLabelClassName()}>
            {label}
            {required && <span className={`input-required ${hasError ? 'input-required-error' : ''}`}>*</span>}
          </label>
        )}
        {hasError && displayErrorMessage && (
          <span className="input-error-message">{displayErrorMessage}</span>
        )}
      </div>

      <div className="business-number-inputs">
        <NumberInput
          value={localValues.part1}
          onChange={(newValue) => handlePartChange('part1', newValue)}
          placeholder="123"
          maxLength={3}
          disabled={disabled || isValidating}
          error={hasError}
          {...props}
        />
        <span className="business-number-separator">-</span>
        <NumberInput
          value={localValues.part2}
          onChange={(newValue) => handlePartChange('part2', newValue)}
          placeholder="45"
          maxLength={2}
          disabled={disabled || isValidating}
          error={hasError}
          {...props}
        />
        <span className="business-number-separator">-</span>
        <NumberInput
          value={localValues.part3}
          onChange={(newValue) => handlePartChange('part3', newValue)}
          placeholder="67890"
          maxLength={5}
          disabled={disabled || isValidating}
          error={hasError}
          {...props}
        />

        {getValidationIcon()}

        {showValidationButton && (
          <button
            type="button"
            className="business-validation-button"
            onClick={handleValidateClick}
            disabled={disabled || isValidating || !canValidate}
          >
            {isValidating ? '검증중...' : '검증'}
          </button>
        )}
      </div>

      {showCompanyName && isValid && companyName && (
        <div className="business-company-info">
          <span className="company-name">회사명: {companyName}</span>
          <span className="business-status">상태: {validationMessage}</span>
        </div>
      )}
    </div>
  );
};

export default BusinessNumberInput;