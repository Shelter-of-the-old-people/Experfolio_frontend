// shelter-of-the-old-people/experfolio_frontend/Experfolio_frontend--/src/hooks/useApi.js

import { useState, useEffect, useCallback } from 'react'; // 1. useCallback 임포트

export const useApi = (apiFunc, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. apiFunc가 변경되지 않는 한, execute 함수는 재생성되지 않도록 함
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      // 3. (수정) 에러 메시지를 상태에 저장
      setError(err.message || '오류가 발생했습니다.');
      
      // 4. (제거) Uncaught (in promise) 오류를 유발하는 throw 제거
      // throw err;

    } finally {
      setLoading(false);
    }
  }, [apiFunc]); // apiFunc가 바뀔 때만 execute 함수 재생성

  useEffect(() => {
    // 5. (수정됨) dependencies가 비어있으면(기본값) 마운트 시 1회 실행
    execute();
  }, [execute, ...dependencies]); // 6. dependencies 배열에 execute 포함

  return { data, loading, error, execute };
};

// useLazyApi는 이미 올바르게 구현되어 있으므로 수정하지 않습니다.
export const useLazyApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      // (useLazyApi는 수동 호출이므로 throw err를 유지합니다)
      setError(err.message || '오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};