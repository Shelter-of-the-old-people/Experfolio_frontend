import React from 'react';
import { Button } from '../atoms';
import { PortfolioSection } from '../molecules'; 

// 1. props 목록에 onSectionFocusGained, onSectionFocusLost, disabled를 추가합니다.
const PortfolioEditor = ({ 
  sections, 
  onUpdateSection, 
  onDeleteSection, 
  onAddSection,
  onSectionFocusGained,
  onSectionFocusLost,
  disabled = false 
}) => {
  return (
    <div className="portfolio-editor">
      
      <div className="sections-list">
        {sections.map((section) => (
          <PortfolioSection
            key={section.id} // [수정됨] React 목록 렌더링을 위한 key prop
            section={section}
            onUpdate={onUpdateSection}
            onDelete={onDeleteSection}
            // 2. 전달받은 props를 PortfolioSection에 그대로 넘겨줍니다.
            onSectionFocusGained={onSectionFocusGained}
            onSectionFocusLost={onSectionFocusLost} 
          />
        ))}
      </div>

      <div className="add-section-container">
        <Button
          variant="black"
          size="full"
          onClick={onAddSection}
          icon="+"
          disabled={disabled} // 3. disabled prop도 버튼에 연결합니다.
        >
          섹션 추가
        </Button>
      </div>
    </div>
  );
};

export default PortfolioEditor;