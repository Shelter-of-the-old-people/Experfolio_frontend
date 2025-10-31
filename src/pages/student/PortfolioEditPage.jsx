import React, { useState } from 'react';
import { PortfolioEditor } from '../../components/organisms';

const TempSideNav = ({ sections }) => (
  <nav style={{ borderRight: '1px solid #eee', padding: '20px', minWidth: '200px' }}>
    <h4 style={{ marginBottom: '20px' }}>포트폴리오 목차</h4>
    <ul>
      {sections.map((section) => (
        <li key={section.id} style={{ marginBottom: '10px' }}>
          <a href={`#section-${section.id}`}>
            {section.title || '(제목 없음)'}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const PortfolioEditPage = () => {
  const [sections, setSections] = useState([
    { 
      id: 1, 
      title: '', 
      layout: 'unselected',
      content: '', 
      file: null 
    }
  ]);

  const handleAddSection = () => {
    setSections(prevSections => [
      ...prevSections,
      {
        id: (prevSections[prevSections.length - 1]?.id || 0) + 1,
        title: '',
        layout: 'unselected', 
        content: '',
        file: null
      }
    ]);
  };

  const handleUpdateSection = (updatedSection) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      )
    );
  };

  const handleDeleteSection = (sectionId) => {
    if (sections.length <= 1) {
      alert("포트폴리오는 최소 1개의 섹션이 필요합니다.");
      return;
    }

    if (!window.confirm("이 섹션을 정말 삭제하시겠습니까?")) {
      return;
    }

    setSections(prevSections =>
      prevSections.filter(section => section.id !== sectionId)
    );
  };
  // ---

  return (
    <div className="portfolio-edit-page" style={{ display: 'flex', height: '100%' }}>
      
      <TempSideNav sections={sections} />

      <div className="portfolio-main-editor" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h2>포트폴리오 수정</h2>
        </header>
        <PortfolioEditor
          sections={sections}
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection}
          onAddSection={handleAddSection}
        />

      </div>
    </div>
  );
};

export default PortfolioEditPage;