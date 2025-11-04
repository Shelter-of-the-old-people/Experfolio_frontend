/**
 * API 응답 정규화 유틸리티
 * 
 * 백엔드 API 응답 구조가 통일되지 않은 문제를 해결:
 * - AuthController: ApiResponse wrapper 사용 (success, message, data, timestamp)
 * - PortfolioController: 직접 DTO 반환 (wrapper 없음)
 */

/**
 * API 응답이 ApiResponse wrapper를 사용하는지 확인
 * @param {Object} data - 응답 데이터
 * @returns {boolean}
 */
const isWrappedResponse = (data) => {
  return data && typeof data === 'object' && 
         ('success' in data || 'message' in data || 'timestamp' in data);
};

/**
 * API 응답을 정규화하여 일관된 구조로 변환
 * 
 * @param {Object} response - Axios 응답 객체
 * @returns {Object} 정규화된 응답
 * 
 * 정규화된 구조:
 * {
 *   success: boolean,
 *   message: string,
 *   data: any,
 *   timestamp: string
 * }
 */
export const normalizeApiResponse = (response) => {
  if (!response || !response.data) {
    return {
      success: true,
      message: 'Success',
      data: null,
      timestamp: new Date().toISOString()
    };
  }

  const { data } = response;

  // 이미 ApiResponse wrapper 형태인 경우 그대로 반환
  if (isWrappedResponse(data)) {
    return {
      success: data.success !== undefined ? data.success : true,
      message: data.message || 'Success',
      data: data.data,
      timestamp: data.timestamp || new Date().toISOString()
    };
  }

  // wrapper 없이 직접 DTO를 반환하는 경우 wrapper 추가
  return {
    success: true,
    message: 'Success',
    data: data,
    timestamp: new Date().toISOString()
  };
};

/**
 * 에러 응답을 정규화
 * 
 * @param {Object} error - Axios 에러 객체
 * @returns {Object} 정규화된 에러 응답
 */
export const normalizeApiError = (error) => {
  if (!error.response) {
    // 네트워크 에러 또는 요청 실패
    return {
      success: false,
      message: error.message || '네트워크 오류가 발생했습니다.',
      data: null,
      timestamp: new Date().toISOString(),
      status: 0
    };
  }

  const { data, status } = error.response;

  // ErrorResponse 형태인 경우
  if (data && typeof data === 'object') {
    return {
      success: false,
      message: data.message || data.error || '서버 오류가 발생했습니다.',
      data: data,
      timestamp: data.timestamp || new Date().toISOString(),
      status: status
    };
  }

  // 예상치 못한 에러 응답
  return {
    success: false,
    message: '서버 오류가 발생했습니다.',
    data: data,
    timestamp: new Date().toISOString(),
    status: status
  };
};