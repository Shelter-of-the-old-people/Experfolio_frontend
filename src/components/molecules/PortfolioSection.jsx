import React from 'react';
import { TextInput, TextEditor, Button } from '../atoms';
import LayoutSelector from './LayoutSelector';
import FileUpload from './FileUpload';
import { useDebounce } from '../../hooks/useDebounce';

const SectionContent = ({ 
  type, 
  content, 
  file, 
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
    <FileUpload file={file} onFileChange={onFileChange} />
  );

  const renderLayout = () => {
    switch (type) {
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
  const [internalSection, setInternalSection] = useState(section);
  const debouncedTitle = useDebounce(internalSection.title, 1000);
  const debouncedContent = useDebounce(internalSection.content, 1000);
  
  useEffect(() => {
    setInternalSection(section);
  }, [section]);

  useEffect(() => {
    if (debouncedTitle !== section.title || debouncedContent !== section.content) {
      onUpdate({ ...internalSection, title: debouncedTitle, content: debouncedContent });
    }
  }, [debouncedTitle, debouncedContent]);

  const handleImmediateUpdate = (field, value) => {
    const updatedSection = { ...internalSection, [field]: value };
    setInternalSection(updatedSection);
    onUpdate(updatedSection); 
  };

  const handleTextUpdate = (field, value) => {
    setInternalSection(prev => ({ ...prev, [field]: value }));
  };

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
            <TextInput
                value={section.title}
                onChange={(value) => handleTextUpdate('title', value)}
                placeholder="제목 입력 : 예) 팀 프로젝트 - Experfolio"
                required
                />
        </div>

        <div className="section-content-wrapper">
            {section.type === 'unselected' ? (
            <LayoutSelector
                onSelect={(value) => handleImmediateUpdate('type', value)}
            />
            ) : (
            <SectionContent
                type={section.type}
                content={section.content}
                file={section.file}
                onContentChange={(value) => handleTextUpdate('content', value)}
                onFileChange={(value) => handleImmediateUpdate('file', value)}
                onChangeLayoutClick={() => handleImmediateUpdate('type', 'unselected')}
            />
            )}
            
        </div>
    </div>
  );
};

export default PortfolioSection;