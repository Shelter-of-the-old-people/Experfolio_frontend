import React from 'react';
import { Button } from '../atoms';
import { PortfolioSection } from '../molecules'; 

const PortfolioEditor = ({ sections, onUpdateSection, onDeleteSection, onAddSection }) => {
  return (
    <div className="portfolio-editor">
      
      <div className="sections-list">
        {sections.map((section) => (
          <PortfolioSection
            key={section.id}
            section={section}
            onUpdate={onUpdateSection}
            onDelete={onDeleteSection}
          />
        ))}
      </div>

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