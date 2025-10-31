import React from 'react';

// 레이아웃 유형 정의 (요구사항 기반)
const LAYOUT_TYPES = [
  { id: 'text-only', label: '텍스트만', icon: '/default/layout-text-only.svg' },
  { id: 'file-top', label: '파일 상단', icon: '/default/layout-file-top.svg' },
  { id: 'file-bottom', label: '파일 하단', icon: '/default/layout-file-bottom.svg' },
  { id: 'file-left', label: '파일 좌측', icon: '/default/layout-file-left.svg' },
  { id: 'file-right', label: '파일 우측', icon: '/default/layout-file-right.svg' },
];

const LayoutSelector = ({ activeLayout, onSelect }) => {
  return (
    <div className="layout-selector-wrapper" style={{ marginBottom: '20px' }}>
      <label className="input-label" style={{ marginBottom: '10px' }}>
        레이아웃 선택
      </label>
      <div 
        className="layout-buttons" 
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
      >
        {LAYOUT_TYPES.map((layout) => (
          <button
            key={layout.id}
            type="button"
            className={`layout-button ${activeLayout === layout.id ? 'active' : ''}`}
            onClick={() => onSelect(layout.id)}
            style={{
              padding: '10px',
              border: `2px solid ${activeLayout === layout.id ? '#1E1E1E' : '#e5e5e5'}`,
              borderRadius: '8px',
              background: activeLayout === layout.id ? '#f5f5f5' : '#fff',
              cursor: 'pointer'
            }}
          >
            <img 
              src={layout.icon} 
              alt={layout.label} 
              style={{ width: '50px', height: '50px', display: 'block', margin: '0 auto' }} 
            />
            <span style={{ fontSize: '12px', marginTop: '5px', color: '#525252' }}>
              {layout.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;