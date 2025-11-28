import { create } from 'zustand';

const useSearchStore = create((set) => ({
  lastQuery: '',       
  cachedResults: null,  
  selectedUserId: null,
  
  setSearchCache: (query, results) => set({ 
    lastQuery: query, 
    cachedResults: results 
  }),
  
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
}));

export default useSearchStore;