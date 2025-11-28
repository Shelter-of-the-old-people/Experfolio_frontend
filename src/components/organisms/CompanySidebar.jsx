import React from 'react';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';
import { BookmarkSection, NewSearchButton, SearchQueryIndicator } from '../molecules';
import '../../styles/components/CompanySidebar.css';

const MOCK_TALENTS = [
  { id: 1, name: '인재1', avatarUrl: null },
  { id: 2, name: '인재2', avatarUrl: null },
];

const CompanySidebar = () => {

  return (
    <aside className="company-sidebar">
      <h4>메뉴</h4>
      <NewSearchButton />
      <SearchQueryIndicator />
      <BookmarkSection talents={MOCK_TALENTS} />
    </aside>
  );
};

export default CompanySidebar;