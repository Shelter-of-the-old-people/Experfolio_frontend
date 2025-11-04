import React from 'react';
// [수정됨] Debounced(지연) 버전의 컴포넌트를 임포트합니다.
import { DebouncedTextInput as TextInput, DebouncedTextEditor as TextEditor, Button } from '../atoms';
import LayoutSelector from './LayoutSelector';
import FileUpload from './FileUpload';

const SectionContent = ({ 
  layout, 
  content, 
  file, 
  onContentChange, 
  onFileChange,
  onChangeLayoutClick
}) => {
  
  const editorElement = (
    <TextEditor
      value={content}
      onChange={onContentChange} // 이제 이 onChange는 onBlur 시점에 호출됩니다.
      placeholder="이곳에 내용을 입력하세요..."
    />
  );

  const fileElement = (
    <FileUpload file={file} onFileChange={onFileChange} />
  );

  // ... (renderLayout 로직은 변경 없음) ...
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


const PortfolioSection = ({ section, onUpdate, onDelete }) => {
  
  const handleUpdate = (field, value) => {
    onUpdate({ ...section, [field]: value });
  };

  return (
    <div id={`section-${section.id}`} className="portfolio-section">
        <Button
            variant="trans"
            className="btn-section-delete"
            onClick={() => onDelete(section.id)}
            title="섹션 삭제"
            icon="/x_icon.svg" 
        >
        </Button>
        <div className="section-header">
            <TextInput // [수정됨] 이제 이 컴포넌트는 DebouncedTextInput입니다.
                value={section.title}
                onChange={(value) => handleUpdate('title', value)} // onBlur 시점에 호출됨
                placeholder="제목 입력 : 예) 팀 프로젝트 - Experfolio"
                required
                />
        </div>

        <div className="section-content-wrapper">
            {section.layout === 'unselected' ? (
            <LayoutSelector
                onSelect={(value) => handleUpdate('layout', value)}
            />
            ) : (
            <SectionContent
                layout={section.layout}
                content={section.content}
                file={section.file}
                onContentChange={(value) => handleUpdate('content', value)} // onBlur 시점에 호출됨
                onFileChange={(value) => handleUpdate('file', value)} // (FileUpload는 즉시 저장)
                onChangeLayoutClick={() => handleUpdate('layout', 'unselected')}
            />
            )}
            
        </div>
    </div>
  );
};

export default PortfolioSection;