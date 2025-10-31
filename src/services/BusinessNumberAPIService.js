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
    this.companyName = data.companyName || '';
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
      return this.errorMessage || '유효하지 않은 사업자등록번호입니다.';
    }
    switch (this.status) {
      case '01': return '계속사업자 (정상)';
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
      companyName: this.companyName,
      establishmentDate: this.establishmentDate,
      statusMessage: this.getStatusMessage(),
      isActiveBusiness: this.isActiveBusiness(),
      validatedAt: this.validatedAt.toISOString(),
    };
  }
}

/**
 * 사업자 번호 API 서비스 클래스 (Axios 기반으로 수정)
 * 공공데이터포털의 사업자등록번호 상태조회 API 활용
 */
class BusinessNumberAPIService {
  constructor(apiKey = '') {
    const baseURL = 'https://api.odcloud.kr/api/nts-businessman/v1';
    
    // 이 서비스 전용 Axios 인스턴스 생성 (인증 인터셉터 없음)
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (apiKey) {
      this.setApiKey(apiKey);
    }
    
    // Axios 에러 핸들링 인터셉터
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { data, status } = error.response;
          const message = data?.message || error.message || `HTTP ${status}`;
          return Promise.reject(new APIError(message, status, data));
        } else if (error.request) {
          return Promise.reject(new APIError('네트워크 오류: 서버에서 응답이 없습니다.', 0, null));
        } else {
          return Promise.reject(new APIError(error.message, 0, null));
        }
      }
    );
  }

  /**
   * API 키 설정
   * @param {string} apiKey - 공공데이터 API 키
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.client.defaults.headers.common['Authorization'] = `Infuser ${apiKey}`;
  }

  // --- static 메서드들은 로직 변경 없음 (validateFormat, calculateChecksum 등) ---
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

  /**
   * 사업자등록번호 상태 조회 (기본 검증)
   * @param {string} businessNumber - 조회할 사업자등록번호
   * @returns {Promise<BusinessNumberValidationResult>}
   */
  async validateBusinessNumber(businessNumber) {
    try {
      if (!BusinessNumberAPIService.validateFormat(businessNumber)) {
        return new BusinessNumberValidationResult({
          businessNumber,
          isValid: false,
          errorMessage: '사업자등록번호 형식이 올바르지 않습니다.',
        });
      }

      const numbers = BusinessNumberAPIService.extractNumbers(businessNumber);
      
      // Axios POST 요청으로 변경
      const response = await this.client.post('/status', {
        b_no: [numbers],
      });
      
      return this.parseValidationResponse(businessNumber, response.data);
    } catch (error) {
      return new BusinessNumberValidationResult({
        businessNumber,
        isValid: false,
        errorMessage: `검증 중 오류가 발생했습니다: ${error.message}`,
      });
    }
  }

  /**
   * 단일 검증 응답 파싱
   * @param {string} businessNumber - 원본 사업자등록번호
   * @param {Object} responseData - API 응답 (response.data)
   * @returns {BusinessNumberValidationResult}
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

      return new BusinessNumberValidationResult({
        businessNumber,
        isValid: data.b_stt_cd !== '',
        status: data.b_stt_cd,
        companyName: data.tax_type || '', // API 응답에 따라 필드명 조정 필요
        establishmentDate: '', // 기본 응답에는 이 정보가 없을 수 있음
      });
    } catch (error) {
      return new BusinessNumberValidationResult({
        businessNumber,
        isValid: false,
        errorMessage: '응답 파싱 중 오류가 발생했습니다.',
      });
    }
  }

  // ... (validateBusinessNumberDetailed, validateMultipleBusinessNumbers 등도 유사하게 axios로 수정)
}

export { BusinessNumberAPIService, BusinessNumberValidationResult, APIError };