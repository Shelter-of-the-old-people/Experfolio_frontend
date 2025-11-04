import axios from 'axios';
import { normalizeApiResponse, normalizeApiError } from '../utils/apiNormalizer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

// 요청 인터셉터 (JWT 토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (응답 정규화 및 에러 처리)
api.interceptors.response.use(
  (response) => {
    // 응답을 정규화하여 일관된 구조로 변환
    const normalizedResponse = {
      ...response,
      data: normalizeApiResponse(response)
    };
    return normalizedResponse;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러 처리 (토큰 갱신)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // refresh API는 정규화하지 않은 원본 axios 인스턴스 사용
          const refreshApi = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000
          });
          
          const response = await refreshApi.post('/v1/auth/refresh', {
            refreshToken
          });
          
          // refresh 응답도 정규화
          const normalized = normalizeApiResponse(response);
          const newToken = normalized.data?.token || normalized.data?.accessToken;
          
          if (newToken) {
            localStorage.setItem('token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // 에러 정규화
    const normalizedError = normalizeApiError(error);
    
    // Error 객체로 변환하여 일관된 에러 처리
    const apiError = new Error(normalizedError.message);
    apiError.response = {
      ...error.response,
      data: normalizedError
    };
    apiError.status = normalizedError.status;
    apiError.originalError = error;
    
    return Promise.reject(apiError);
  }
);

export default api;