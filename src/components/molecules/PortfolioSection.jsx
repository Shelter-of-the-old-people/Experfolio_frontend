import React, { useRef } from 'react';
import { TextInput, TextEditor, Button } from '../atoms';
import LayoutSelector from './LayoutSelector';
import FileUpload from './FileUpload';

const SectionContent = ({ 
  layout, 
  content, 
  file,
  attachments,
  onContentChange, 
  onFileChange,
  onChangeLayoutClick
}) => {
  
  const editorElement = (
    <TextEditor
      value={content}
      onChange={onContentChange}
      placeholder="이곳에 내용을 입력하세요..."
    />
  );

  const fileElement = (
    <FileUpload 
      file={file} 
      attachments={attachments}
      onFileChange={onFileChange} 
    />
  );

  const renderLayout = () => {
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
        return editorElement; 
    }
  };

  return (
    <div className="section-content-body">
      {renderLayout()}
      
      <div className="section-controls-footer">
        <Button variant="trans" onClick={onChangeLayoutClick}>
          레이아웃 변경
        </Button>
      </div>
    </div>
  );
};


const PortfolioSection = ({ 
  section, 
  onUpdate, 
  onDelete, 
  onSectionFocusGained, 
  onSectionFocusLost 
}) => {
  
  const sectionRef = useRef(null);

  const handleUpdate = (field, value) => {
    onUpdate({ ...section, [field]: value });
  };

  const handleFocus = () => {
    onSectionFocusGained(section.id);
  };

  const handleBlur = (e) => {
    if (sectionRef.current && !sectionRef.current.contains(e.relatedTarget)) {
      onSectionFocusLost(section.id);
    }
  };

  return (
    <div 
      id={`section-${section.id}`} 
      className="portfolio-section"
      ref={sectionRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
        <Button
            variant="trans"
            className="btn-section-delete"
            onClick={() => onDelete(section.id)}
            title="섹션 삭제"
            icon="/x_icon.svg" 
        >
        </Button>
        <div className="section-header">
            <TextInput
                value={section.title}
                onChange={(value) => handleUpdate('title', value)}
                placeholder="제목 입력 : 예) 팀 프로젝트 - Experfolio"
                required
                />
        </div>

        <div className="section-content-wrapper">
            {section.type === 'unselected' ? (
            <LayoutSelector
                onSelect={(value) => handleUpdate('type', value)}
            />
            ) : (
            <SectionContent
                layout={section.type}
                content={section.content}
                file={section.file}
                attachments={section.attachments}
                onContentChange={(value) => handleUpdate('content', value)}
                onFileChange={(value) => handleUpdate('file', value)}
                onChangeLayoutClick={() => handleUpdate('type', 'unselected')}
            />
            )}
            
        </div>
    </div>
  );
};

export default PortfolioSection;