import React, { useState, useEffect, useCallback } from 'react';
import NumberInput from './NumberInput.jsx';

/**
 * 사업자 번호 입력 컴포넌트 (3개의 NumberInput으로 구성)
 * 형식: XXX-XX-XXXXX
 */
const BusinessNumberInput = ({
  value = { part1: '', part2: '', part3: '' }, // { part1: "123", part2: "45", part3: "67890" }
  onChange,
  label = '사업자등록번호',
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  // API 관련 props (단순화)
  businessNumberApiKey = '',
  showValidationButton = true,
  showCompanyName = true,
  autoValidate = false,
  onValidationComplete,
  onValidationError,
  ...props
}) => {
  const [localValues, setLocalValues] = useState({
    part1: value?.part1 || '',
    part2: value?.part2 || '',
    part3: value?.part3 || ''
  });

  const [validationState, setValidationState] = useState({
    isValidating: false,
    isValid: false,
    companyName: '',
    statusMessage: ''
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

  // 사업자 번호 조합 함수
  const combineBusinessNumber = useCallback((part1, part2, part3) => {
    if (!part1 && !part2 && !part3) return '';
    return `${part1 || ''}${part2 || ''}${part3 || ''}`;
  }, []);

  // 간단한 체크섬 검증 (실제 API 없이도 사용 가능)
  const validateChecksum = useCallback((businessNumber) => {
    if (businessNumber.length !== 10) return false;
    
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(businessNumber[i]) * weights[i];
    }
    
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(businessNumber[9]);
  }, []);

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

    // 자동 검증 (간단한 체크섬만)
    if (autoValidate && updatedValues.part1 && updatedValues.part2 && updatedValues.part3) {
      const fullNumber = combineBusinessNumber(updatedValues.part1, updatedValues.part2, updatedValues.part3);
      if (fullNumber.length === 10) {
        const isValid = validateChecksum(fullNumber);
        setValidationState({
          isValidating: false,
          isValid,
          companyName: isValid ? '(예시) 테스트 회사' : '',
          statusMessage: isValid ? '유효한 사업자등록번호입니다' : '체크섬이 일치하지 않습니다'
        });
        
        if (onValidationComplete && isValid) {
          onValidationComplete({ isValid, companyName: '(예시) 테스트 회사' });
        }
        if (onValidationError && !isValid) {
          onValidationError(new Error('체크섬이 일치하지 않습니다'));
        }
      }
    }
  }, [localValues, onChange, autoValidate, combineBusinessNumber, validateChecksum, onValidationComplete, onValidationError]);

  // 수동 검증 핸들러
  const handleValidateClick = useCallback(async () => {
    const fullNumber = combineBusinessNumber(localValues.part1, localValues.part2, localValues.part3);
    
    if (fullNumber.length === 10) {
      setValidationState(prev => ({ ...prev, isValidating: true }));
      
      // 시뮬레이션을 위한 약간의 지연
      setTimeout(() => {
        const isValid = validateChecksum(fullNumber);
        setValidationState({
          isValidating: false,
          isValid,
          companyName: isValid ? '(예시) 테스트 회사' : '',
          statusMessage: isValid ? '유효한 사업자등록번호입니다' : '체크섬이 일치하지 않습니다'
        });
        
        if (onValidationComplete && isValid) {
          onValidationComplete({ isValid, companyName: '(예시) 테스트 회사' });
        }
        if (onValidationError && !isValid) {
          onValidationError(new Error('체크섬이 일치하지 않습니다'));
        }
      }, 1000);
    }
  }, [localValues, combineBusinessNumber, validateChecksum, onValidationComplete, onValidationError]);

  // 전체 에러 상태 결정
  const hasError = error || (!validationState.isValid && validationState.statusMessage);
  const displayErrorMessage = errorMessage || 
    (!validationState.isValid && validationState.statusMessage ? validationState.statusMessage : '');

  // 검증 가능 여부 확인
  const canValidate = localValues.part1 && localValues.part2 && localValues.part3 && 
    localValues.part1.length === 3 && 
    localValues.part2.length === 2 && 
    localValues.part3.length === 5;

  // 검증 상태 아이콘
  const getValidationIcon = () => {
    if (!canValidate) return null;
    
    if (validationState.isValidating) {
      return <span className="validation-icon validating">⏳</span>;
    }
    
    if (validationState.statusMessage) {
      if (validationState.isValid) {
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
        {/* 첫 번째 필드: 3자리 */}
        <NumberInput
          value={localValues.part1}
          onChange={(newValue) => handlePartChange('part1', newValue)}
          placeholder="123"
          min={0}
          max={999}
          maxLength={3}
          disabled={disabled}
          error={hasError}
          {...props}
        />

        <span className="business-number-separator">-</span>

        {/* 두 번째 필드: 2자리 */}
        <NumberInput
          value={localValues.part2}
          onChange={(newValue) => handlePartChange('part2', newValue)}
          placeholder="45"
          min={0}
          max={99}
          maxLength={2}
          disabled={disabled}
          error={hasError}
          {...props}
        />

        <span className="business-number-separator">-</span>

        {/* 세 번째 필드: 5자리 */}
        <NumberInput
          value={localValues.part3}
          onChange={(newValue) => handlePartChange('part3', newValue)}
          placeholder="67890"
          min={0}
          max={99999}
          maxLength={5}
          disabled={disabled}
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
            disabled={disabled || validationState.isValidating || !canValidate}
          >
            {validationState.isValidating ? '검증중...' : '검증'}
          </button>
        )}
      </div>

      {/* 검증 성공 시 회사 정보 표시 */}
      {showCompanyName && validationState.isValid && validationState.companyName && (
        <div className="business-company-info">
          <span className="company-name">회사명: {validationState.companyName}</span>
          <span className="business-status">상태: {validationState.statusMessage}</span>
        </div>
      )}
    </div>
  );
};

export default BusinessNumberInput;