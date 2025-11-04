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
      setError(err.message || '오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]); // apiFunc가 바뀔 때만 execute 함수 재생성

  useEffect(() => {
    // 3. [수정됨] 잘못된 if (dependencies.length > 0) 조건문 제거
    //    이제 dependencies가 비어있으면(기본값) 마운트 시 1회 실행됩니다.
    execute();
  }, [execute, ...dependencies]); // 4. dependencies 배열에 execute 포함 (useCallback으로 안정화됨)

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
      setError(err.message || '오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};