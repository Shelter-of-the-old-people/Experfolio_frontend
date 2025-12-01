import { create } from 'zustand';
import api from '../services/api';

const useFavoriteStore = create((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  // 즐겨찾기 목록 조회 (GET /api/v1/favorites)
  fetchFavorites: async () => {
    set({ loading: true });
    try {
      // 페이지네이션 파라미터가 필요하다면 params에 추가 (현재는 기본값)
      const response = await api.get('/v1/favorites');
      
      // API 응답 구조: { success: true, data: { content: [...] } }
      // content 내부의 jobSeeker 정보를 추출하여 매핑
      const rawContent = response.data?.data?.content || [];
      
      const formattedFavorites = rawContent.map(item => ({
        id: item.jobSeeker.id,
        name: item.jobSeeker.name,
        // 아바타 정보가 API에 없으면 기본값 처리 (필요시 백엔드 요청)
        avatarUrl: null, 
        schoolName: item.jobSeeker.schoolName,
        major: item.jobSeeker.major
      }));

      set({ favorites: formattedFavorites, loading: false });
    } catch (err) {
      console.error('즐겨찾기 목록 로드 실패:', err);
      set({ error: err, loading: false });
    }
  },

  // 즐겨찾기 추가 (POST /api/v1/favorites)
  addFavorite: async (jobSeekerId) => {
    try {
      await api.post('/v1/favorites', { jobSeekerId });
      // 목록 갱신
      await get().fetchFavorites();
      return true;
    } catch (err) {
      console.error('즐겨찾기 추가 실패:', err);
      throw err;
    }
  },

  // 즐겨찾기 삭제 (DELETE /api/v1/favorites/{jobSeekerId})
  removeFavorite: async (jobSeekerId) => {
    try {
      await api.delete(`/v1/favorites/${jobSeekerId}`);
      // 목록 갱신
      await get().fetchFavorites();
      return true;
    } catch (err) {
      console.error('즐겨찾기 삭제 실패:', err);
      throw err;
    }
  },
  
  // 특정 유저 즐겨찾기 여부 확인 (GET /api/v1/favorites/{jobSeekerId}/exists)
  checkIsFavorite: async (jobSeekerId) => {
    try {
        const response = await api.get(`/v1/favorites/${jobSeekerId}/exists`);
        // 응답: { exists: true/false, ... }
        return response.data?.data?.exists || false;
    } catch (err) {
        console.error('즐겨찾기 여부 확인 실패:', err);
        return false;
    }
  }
}));

export default useFavoriteStore;