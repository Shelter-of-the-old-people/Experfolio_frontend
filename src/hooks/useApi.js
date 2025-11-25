import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunc, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || '오류가 발생했습니다.');
      // [수정 없음] GET용 useApi는 throw하지 않음
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    execute();
  }, [execute, ...dependencies]); 

  return { data, loading, error, execute };
};

export const useLazyApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null); // [수정] 먼저 에러를 null로 초기화
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      // [수정] 실패 시에만 에러를 설정하고 throw
      setError(err.message || '오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};