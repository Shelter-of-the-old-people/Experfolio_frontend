import { create } from 'zustand';

const useSearchStore = create((set) => ({
  lastQuery: '',        // 마지막 검색어
  cachedResults: null,  // 마지막 검색 결과 데이터
  
  // 검색어와 결과를 한 번에 저장하는 함수
  setSearchCache: (query, results) => set({ lastQuery: query, cachedResults: results }),
}));

export default useSearchStore;