import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from './NumberInput.jsx';

/**
 * 사업자 번호 입력 컴포넌트 (3개의 NumberInput으로 구성) - (Refactored)
 * (UI만 담당하며, 검증 로직은 props로 주입받습니다)
 */
const BusinessNumberInput = ({
  value = { part1: '', part2: '', part3: '' },
  onChange,
  label = '사업자등록번호',
  required = false,
  disabled = false,
  error = false, // 외부에서 주입된 기본 에러
  errorMessage, // 외부에서 주입된 기본 에러 메시지
  
  // --- 검증 관련 Props (상위에서 주입) ---
  isValidating = false, // 검증 API 호출 중인지 여부
  isValid = false, // 검증이 완료되었고 유효한지 여부
  validationMessage, // 검증 결과 메시지 (예: '유효한 사업자입니다', '폐업한 사업자입니다')
  companyName, // 검증을 통해 확인된 회사명
  showValidationButton = true,
  showCompanyName = true,
  onValidate, // '검증' 버튼 클릭 시 호출될 함수 (상위에서 주입)
  // ---
  
  ...props
}) => {
  const [localValues, setLocalValues] = useState({
    part1: value?.part1 || '',
    part2: value?.part2 || '',
    part3: value?.part3 || ''
  });

  // 외부 value prop이 변경되면 로컬 상태 업데이트
  useEffect(() => {
    if (value && typeof value === 'object') {
      setLocalValues({
        part1: value.part1 || '',
        part2: value.part2 || '',
        part3: value.part3 || ''
      });
    }
  }, [value]);

  // 개별 필드 변경 핸들러
  const handlePartChange = useCallback((partName, newValue) => {
    const updatedValues = {
      ...localValues,
      [partName]: newValue || ''
    };
    
    setLocalValues(updatedValues);
    
    // 부모 컴포넌트에 변경사항 전달
    if (onChange) {
      onChange(updatedValues);
    }
  }, [localValues, onChange]);

  // 검증 버튼 클릭 핸들러 (상위로 이벤트 전달)
  const handleValidateClick = useCallback(() => {
    if (onValidate) {
      const fullNumber = `${localValues.part1}${localValues.part2}${localValues.part3}`;
      onValidate(fullNumber);
    }
  }, [localValues, onValidate]);

  // 전체 에러 상태 결정 (외부 에러 또는 검증 실패)
  const hasError = error || (validationMessage && !isValid);
  const displayErrorMessage = errorMessage || (hasError ? validationMessage : '');

  // 검증 가능 여부 (10자리를 모두 채웠는지)
  const canValidate = localValues.part1.length === 3 && 
    localValues.part2.length === 2 && 
    localValues.part3.length === 5;

  // 검증 상태 아이콘
  const getValidationIcon = () => {
    if (isValidating) {
      return <span className="validation-icon validating">⏳</span>;
    }
    
    if (validationMessage) { // 검증 메시지가 있다면
      if (isValid) {
        return <span className="validation-icon valid">✓</span>;
      } else {
        return <span className="validation-icon invalid">✗</span>;
      }
    }
    
    return null;
  };

  // 라벨 클래스
  const getLabelClassName = () => {
    let classes = ['input-label'];
    if (hasError) {
      classes.push('input-label-error');
    }
    return classes.join(' ');
  };

  return (
    <div className="business-number-input-wrapper">
      {/* 라벨 */}
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

      {/* 사업자 번호 입력 필드들 */}
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

        {/* 검증 아이콘 */}
        {getValidationIcon()}

        {/* 검증 버튼 */}
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

      {/* 검증 성공 시 회사 정보 표시 */}
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