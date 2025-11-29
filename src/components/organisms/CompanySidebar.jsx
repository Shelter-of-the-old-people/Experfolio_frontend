import React from 'react';
import { BookmarkSection, NewSearchButton, SearchQueryIndicator } from '../molecules';
import '../../styles/components/CompanySidebar.css';

const MOCK_TALENTS = [
  { id: 1, name: '인재1', avatarUrl: null },
  { id: 2, name: '인재2', avatarUrl: null },
];

const CompanySidebar = () => {
  return (
    <aside className="company-sidebar">
      <div className="sidebar-fixed-section">
        <h4 className="sidebar-section-title">메뉴</h4>
        <NewSearchButton />
      </div>

      <div className="sidebar-scrollable-section">
        <BookmarkSection talents={MOCK_TALENTS} />
      </div>
    </aside>
  );
};

export default CompanySidebar;