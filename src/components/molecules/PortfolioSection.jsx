import React from 'react';
import { TextInput, TextEditor } from '../atoms';
import LayoutSelector from './LayoutSelector';
import FileUpload from './FileUpload';
import '../../styles/components/PortfolioSection.css';

// 이 컴포넌트가 레이아웃에 따라 컨텐츠를 렌더링합니다.
const SectionContent = ({ layout, content, file, onContentChange, onFileChange }) => {
  
  const editorElement = (
    <TextEditor
      value={content}
      onChange={onContentChange}
      placeholder="이곳에 내용을 입력하세요..."
      label="내용"
    />
  );

  const fileElement = (
    <FileUpload file={file} onFileChange={onFileChange} />
  );

  // 레이아웃에 따라 다른 JSX 반환
  switch (layout) {
    case 'text-only':
      return editorElement;
      
    case 'file-top':
      return (
        <div className="layout-vertical">
          {fileElement}
          {editorElement}
        </div>
      );
      
    case 'file-bottom':
      return (
        <div className="layout-vertical">
          {editorElement}
          {fileElement}
        </div>
      );
      
    case 'file-left':
      return (
        <div className="layout-horizontal">
          <div className="layout-column">{fileElement}</div>
          <div className="layout-column">{editorElement}</div>
        </div>
      );
      
    case 'file-right':
      return (
        <div className="layout-horizontal">
          <div className="layout-column">{editorElement}</div>
          <div className="layout-column">{fileElement}</div>
        </div>
      );
      
    default:
      return editorElement; // 기본값
  }
};

const PortfolioSection = ({ section, onUpdate }) => {
  
  const handleUpdate = (field, value) => {
    onUpdate({ ...section, [field]: value });
  };

  return (
    <div id={`section-${section.id}`} className="portfolio-section">
      <TextInput
        label="섹션 제목"
        value={section.title}
        onChange={(value) => handleUpdate('title', value)}
        placeholder="예: 팀 프로젝트 - Experfolio"
        required
      />

      <div className="section-content-wrapper">
        <LayoutSelector
          activeLayout={section.layout}
          onSelect={(value) => handleUpdate('layout', value)}
        />
        
        {/* --- 수정된 부분: SectionContent 렌더링 --- */}
        <SectionContent
          layout={section.layout}
          content={section.content}
          file={section.file}
          onContentChange={(value) => handleUpdate('content', value)}
          onFileChange={(value) => handleUpdate('file', value)}
        />
        {/* --- */}
      </div>
    </div>
  );
};

export default PortfolioSection;