import React, { useState } from 'react';

const LAYOUT_TYPES = {
  'text-only': { 
    id: 'text-only', 
    label: '텍스트만 있는 레이아웃', 
    defaultIcon: '/default/layout-text-only.svg',
    hoverIcon: '/hover/layout-text-only.svg',
    gridArea: 'center'
  },
  'file-top': { 
    id: 'file-top', 
    label: '파일 상단 레이아웃', 
    defaultIcon: '/default/layout-file-top.svg',
    hoverIcon: '/hover/layout-file-top.svg',
    gridArea: 'top'
  },
  'file-bottom': { 
    id: 'file-bottom', 
    label: '파일 하단 레이아웃', 
    defaultIcon: '/default/layout-file-bottom.svg',
    hoverIcon: '/hover/layout-file-bottom.svg',
    gridArea: 'bottom'
  },
  'file-left': { 
    id: 'file-left', 
    label: '파일 좌측 레이아웃', 
    defaultIcon: '/default/layout-file-left.svg',
    hoverIcon: '/hover/layout-file-left.svg',
    gridArea: 'left'
  },
  'file-right': { 
    id: 'file-right', 
    label: '파일 우측 레이아웃', 
    defaultIcon: '/default/layout-file-right.svg',
    hoverIcon: '/hover/layout-file-right.svg',
    gridArea: 'right'
  },
};
// 렌더링 순서 정의 (Grid 배치 순서)
const LAYOUT_ORDER = ['file-top', 'file-left', 'text-only', 'file-right', 'file-bottom'];

const LayoutSelector = ({ onSelect }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const defaultText = "레이아웃을 선택해주세요";
  const currentLabel = hoveredId ? LAYOUT_TYPES[hoveredId].label : defaultText;

  return (
    <div className="layout-selector-container">
      <div className="layout-grid">
        {LAYOUT_ORDER.map((id) => {
          const layout = LAYOUT_TYPES[id];
          const isHovered = hoveredId === layout.id;
          
          return (
            <button
              key={layout.id}
              type="button"
              className="layout-grid-button"
              style={{ gridArea: layout.gridArea }}
              onClick={() => onSelect(layout.id)}
              onMouseEnter={() => setHoveredId(layout.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img 
                src={isHovered ? layout.hoverIcon : layout.defaultIcon} 
                alt={layout.label}
              />
            </button>
          );
        })}
      </div>
      
      {/* 3. 호버 시 변경되는 중앙 텍스트 */}
      <p className="layout-selector-text">
        {currentLabel}
      </p>
    </div>
  );
};

export default LayoutSelector;