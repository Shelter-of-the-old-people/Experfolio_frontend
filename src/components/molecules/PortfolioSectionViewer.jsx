import React from 'react';
import '../../styles/components/PortfolioSectionViewer.css';

const R2_PUBLIC_URL = "https://pub-281f6f108f6e4b379ad70e053b5d6c34.r2.dev/";

const PortfolioSectionViewer = ({ item }) => {
  const { id, title, content, attachments, type } = item;

  const getFileUrl = (objectKey) => {
    return R2_PUBLIC_URL + objectKey;
  };

  const getFileIcon = (contentType) => {
    if (contentType?.startsWith('image/')) return '🖼️';
    if (contentType === 'application/pdf') return '📄';
    if (contentType?.includes('word')) return '📝';
    if (contentType?.includes('excel') || contentType?.includes('spreadsheet')) return '📊';
    if (contentType?.includes('powerpoint') || contentType?.includes('presentation')) return '📽️';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const renderAttachment = (attachment, index) => {
    const fileUrl = getFileUrl(attachment.objectKey);
    const { originalFilename, contentType, fileSize } = attachment;
    const extension = originalFilename?.split('.').pop().toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension) 
                    || contentType?.startsWith('image/');
    const isPdf = extension === 'pdf' || contentType === 'application/pdf';

    if (isImage) {
      return (
        <div key={index}>
          <img 
            src={fileUrl} 
            alt={originalFilename} 
            className="image-preview"
          />
          <div className="file-item">
            <span className="file-icon">{getFileIcon(contentType)}</span>
            <div className="file-info">
              <span className="file-name">{originalFilename}</span>
              <span className="file-size">{formatFileSize(fileSize)}</span>
            </div>
            <a 
              href={fileUrl} 
              download={originalFilename}
              className="download-button"
            >
              다운로드
            </a>
          </div>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div key={index}>
          <embed 
            src={fileUrl} 
            type="application/pdf" 
            className="pdf-embed"
          />
          <div className="file-item">
            <span className="file-icon">{getFileIcon(contentType)}</span>
            <div className="file-info">
              <span className="file-name">{originalFilename}</span>
              <span className="file-size">{formatFileSize(fileSize)}</span>
            </div>
            <a 
              href={fileUrl} 
              download={originalFilename}
              className="download-button"
            >
              다운로드
            </a>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="file-item">
        <span className="file-icon">{getFileIcon(contentType)}</span>
        <div className="file-info">
          <span className="file-name">{originalFilename}</span>
          <span className="file-size">{formatFileSize(fileSize)}</span>
        </div>
        <a 
          href={fileUrl} 
          download={originalFilename}
          className="download-button"
        >
          다운로드
        </a>
      </div>
    );
  };

  if (type === 'unselected') {
    return null;
  }

  return (
    <div className="portfolio-section-viewer" id={`section-${id}`}>
      <h4 className="section-title">{title || '(제목 없음)'}</h4>
      
      {content && (
        <div className="section-content">
          {content}
        </div>
      )}
      
      {attachments && attachments.length > 0 && (
        <div className="attachment-container">
          <div className="attachment-title">
            📎 첨부파일 {attachments.length}개
          </div>
          {attachments.map((attachment, index) => renderAttachment(attachment, index))}
        </div>
      )}
    </div>
  );
};

export default PortfolioSectionViewer;