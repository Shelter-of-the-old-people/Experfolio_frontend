
import React, { useEffect } from 'react';
import { BookmarkSection, NewSearchButton, SearchQueryIndicator } from '../molecules';
import useFavoriteStore from '../../stores/useFavoriteStore'; 
import '../../styles/components/CompanySidebar.css';

const CompanySidebar = () => {

  // 스토어에서 상태와 함수 가져오기
  const { favorites, fetchFavorites } = useFavoriteStore();

  // 컴포넌트 마운트 시 즐겨찾기 목록 불러오기
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <aside className="company-sidebar">
      <div className="sidebar-fixed-section">
        <h4 className="sidebar-section-title">메뉴</h4>
        <NewSearchButton />

        <SearchQueryIndicator />
      </div>

      <div className="sidebar-scrollable-section">
        <BookmarkSection talents={favorites} />
      </div>
    </aside>
  );
};

export default CompanySidebar;