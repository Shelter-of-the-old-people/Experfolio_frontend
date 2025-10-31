import axios from 'axios';

/**
 * API 에러 클래스
 */
class APIError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }

  isStatus(status) {
    return this.status === status;
  }
}

/**
 * 사업자 번호 검증 결과 클래스
 */
class BusinessNumberValidationResult {
  constructor(data) {
    this.businessNumber = data.businessNumber;
    this.isValid = data.isValid;
    this.status = data.status; // '01': 계속사업자, '02': 휴업자, '03': 폐업자
    this.establishmentDate = data.establishmentDate || '';
    this.errorMessage = data.errorMessage || '';
    this.validatedAt = new Date();
  }

  isActiveBusiness() {
    return this.isValid && this.status === '01';
  }

  isSuspended() {
    return this.isValid && this.status === '02';
  }

  isClosed() {
    return this.isValid && this.status === '03';
  }

  getStatusMessage() {
    if (!this.isValid) {
      // 2. '폐업자' 또는 '휴업자' 메시지가 errorMessage로 전달됨
      return this.errorMessage || '유효하지 않은 사업자등록번호입니다.';
    }
    switch (this.status) {
      case '01': return '계속사업자 (정상)';
      // (isValid가 false일 것이므로 이 코드는 사실상 도달하지 않음)
      case '02': return '휴업자';
      case '03': return '폐업자';
      default: return '알 수 없는 상태';
    }
  }

  toJSON() {
    return {
      businessNumber: this.businessNumber,
      isValid: this.isValid,
      status: this.status,
      // --- 1. 회사명 속성 제거 ---
      // companyName: this.companyName,
      establishmentDate: this.establishmentDate,
      statusMessage: this.getStatusMessage(),
      isActiveBusiness: this.isActiveBusiness(),
      validatedAt: this.validatedAt.toISOString(),
    };
  }
}

/**
 * 사업자 번호 API 서비스 클래스
 */
class BusinessNumberAPIService {
  constructor(apiKey = '') {
    const baseURL = 'https://api.odcloud.kr/api/nts-businessman/v1';
    
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.apiKey = apiKey;
    
    if (apiKey) {
      this.setApiKey(apiKey);
    }
    
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { data, status } = error.response;
          const message = data?.message || data?.status_desc || error.message || `HTTP ${status}`;
          return Promise.reject(new APIError(message, status, data));
        } else if (error.request) {
          return Promise.reject(new APIError('네트워크 오류: 서버에서 응답이 없습니다.', 0, null));
        } else {
          return Promise.reject(new APIError(error.message, 0, null));
        }
      }
    );
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // --- (static 메서드들은 변경 없음) ---
  static validateFormat(businessNumber) {
    if (!businessNumber) return false;
    const numbers = businessNumber.replace(/[^0-9]/g, '');
    if (numbers.length !== 10) return false;
    const checksum = BusinessNumberAPIService.calculateChecksum(numbers);
    return checksum === parseInt(numbers[9]);
  }

  static calculateChecksum(numbers) {
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * weights[i];
    }
    return (10 - (sum % 10)) % 10;
  }

  static formatBusinessNumber(businessNumber) {
    const numbers = businessNumber.replace(/[^0-9]/g, '');
    if (numbers.length !== 10) return businessNumber;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`;
  }

  static extractNumbers(formattedNumber) {
    return formattedNumber.replace(/[^0-9]/g, '');
  }
  // --- static 메서드 끝 ---

  async validateBusinessNumber(businessNumber) {
    try {
      if (!this.apiKey) {
        throw new Error('API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
      }
      
      const numbers = BusinessNumberAPIService.extractNumbers(businessNumber);

      // (사전 로컬 체크섬 제거됨)
      if (!numbers || numbers.length !== 10) {
        return new BusinessNumberValidationResult({
          businessNumber,
          isValid: false,
          errorMessage: '사업자등록번호 10자리를 입력해주세요.',
        });
      }

      const response = await this.client.post(
        '/status',         
        { b_no: [numbers] }, 
        {                  
          params: {
            serviceKey: this.apiKey 
          }
        }
      );
      
      return this.parseValidationResponse(businessNumber, response.data);
    } catch (error) {
      return new BusinessNumberValidationResult({
        businessNumber,
        isValid: false,
        errorMessage: `검증 실패: ${error.message}`,
      });
    }
  }

  /**
   * 단일 검증 응답 파싱
   */
  parseValidationResponse(businessNumber, responseData) {
    try {
      const data = responseData.data && responseData.data[0];
      if (!data) {
        return new BusinessNumberValidationResult({
          businessNumber,
          isValid: false,
          errorMessage: 'API 응답 형식이 올바르지 않습니다.',
        });
      }

      // --- 3. 비즈니스 로직 수정 ---
      const isValid = data.b_stt_cd === '01';
      let errorMessage = '';

      if (!isValid) {
        if (data.b_stt_cd === '02') {
          errorMessage = '휴업 상태인 사업자입니다.';
        } else if (data.b_stt_cd === '03') {
          errorMessage = '폐업 상태인 사업자입니다.';
        } else {
          errorMessage = data.tax_type || '등록되지 않은 사업자입니다.'; 
        }
      }

      return new BusinessNumberValidationResult({
        businessNumber,
        isValid: isValid,
        status: data.b_stt_cd,         
        errorMessage: errorMessage,
        establishmentDate: '', 
      });
    } catch (error) {
      return new BusinessNumberValidationResult({
        businessNumber,
        isValid: false,
        errorMessage: '응답 파싱 중 오류가 발생했습니다.',
      });
    }
  }
}

export { BusinessNumberAPIService, BusinessNumberValidationResult, APIError };