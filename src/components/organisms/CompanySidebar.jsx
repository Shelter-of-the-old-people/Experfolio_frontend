import React from 'react';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';
import { BookmarkSection, NewSearchButton, SearchQueryIndicator } from '../molecules';
import '../../styles/components/CompanySidebar.css';

const CompanySidebar = () => {
  // ✅ 실제 API로 즐겨찾기 데이터 가져오기
  const { data: bookmarksData } = useApi(
    () => api.get('/v1/bookmarks'),
    []
  );
  
  const talents = bookmarksData?.data?.bookmarks || [];

  return (
    <aside className="company-sidebar">
      <h4>메뉴</h4>
      <NewSearchButton />
      <SearchQueryIndicator />
      <BookmarkSection talents={talents} />
    </aside>
  );
};

export default CompanySidebar;