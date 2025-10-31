import React from 'react';
import { Button } from '../atoms';
import { PortfolioSection } from '../molecules'; // index.js를 통해 임포트

const PortfolioEditor = ({ sections, onUpdateSection, onAddSection }) => {
  return (
    <div className="portfolio-editor">
      
      {/* 1. 섹션 목록 렌더링 */}
      <div className="sections-list">
        {sections.map((section) => (
          <PortfolioSection
            key={section.id}
            section={section}
            onUpdate={onUpdateSection} 
          />
        ))}
      </div>

      {/* 2. 섹션 추가 버튼 (항상 최하단) */}
      <div className="add-section-container" style={{ marginTop: '30px' }}>
        <Button
          variant="black"
          size="full"
          onClick={onAddSection}
          icon="+"
        >
          섹션 추가
        </Button>
      </div>
    </div>
  );
};

export default PortfolioEditor;