import React, { useState } from 'react';
import { PortfolioEditor } from '../../components/organisms';

const TempSideNav = ({ sections }) => (
  <nav className="temp-sidenav">
    <h4 className="temp-sidenav-header">포트폴리오 목차</h4>
    <ul className="temp-sidenav-list">
      {sections.map((section) => (
        <li key={section.id} className="temp-sidenav-item">
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

    setSections(prevSections =>
      prevSections.filter(section => section.id !== sectionId)
    );
  };

  return (
    <div className="portfolio-edit-page">
      <TempSideNav sections={sections} />

      <div className="portfolio-main-editor">
        <header>
          <h2>포트폴리오</h2>
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