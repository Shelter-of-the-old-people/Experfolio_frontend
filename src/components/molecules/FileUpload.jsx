import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../services/api';
import '../../styles/components/FileUpload.css';

const R2_PUBLIC_URL = "https://pub-281f6f108f6e4b379ad70e053b5d6c34.r2.dev/";

const FileUpload = ({ sectionId, section, file, attachments, onFileChange, onFileUpload, onUpdate }) => {
  const [preview, setPreview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    let newPreviewUrl = URL.createObjectURL(file);
    if (file.type === 'application/pdf') {
      newPreviewUrl += '#toolbar=0';
    }
    setPreview(newPreviewUrl);
    return () => URL.revokeObjectURL(URL.createObjectURL(file));
  }, [file]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      onFileChange(selectedFile);
      onFileUpload(sectionId, selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const removeFile = async (e) => {
    e.stopPropagation();
    
    if (attachments && attachments.length > 0) {
      const attachment = attachments[0];
      const objectKey = attachment.objectKey;
      
      if (!window.confirm('파일을 삭제하시겠습니까?')) {
        return;
      }
      
      setIsDeleting(true);
      
      try {
        await api.delete(
          `/portfolios/items/${sectionId}/attachments?objectKey=${encodeURIComponent(objectKey)}`
        );
        
        onUpdate({ ...section, file: null, attachments: [] });
        
      } catch (err) {
        console.error('파일 삭제 실패:', err);
        alert('파일 삭제에 실패했습니다.');
      } finally {
        setIsDeleting(false);
      }
      return;
    }
    
    onFileChange(null);
    setPreview(null);
  };

  if (isDeleting) {
    return (
      <div className="file-upload-wrapper">
        <div className="dropzone">
          <p>파일 삭제 중...</p>
        </div>
      </div>
    );
  }

  if (file instanceof File) {
    return (
      <div className="file-upload-wrapper">
        <div className="preview-container">
          <button onClick={removeFile} className="remove-file-btn" title="파일 삭제">X</button>
          
          {file.type.startsWith('image/') ? (
            <img src={preview} alt="미리보기" className="file-preview image-preview" />
          ) : (
            <embed 
              src={preview} 
              type="application/pdf" 
              className="file-preview pdf-preview"
            />
          )}
        </div>
      </div>
    );
  }

  if (attachments && attachments.length > 0) {
    const attachment = attachments[0];
    const fileUrl = R2_PUBLIC_URL + attachment.objectKey;
    const isImage = attachment.contentType.startsWith('image/');
    
    return (
      <div className="file-upload-wrapper">
        <div className="preview-container">
          <button onClick={removeFile} className="remove-file-btn" title="파일 삭제">X</button>
          
          {isImage ? (
            <img 
              src={fileUrl} 
              alt={attachment.originalFilename} 
              className="file-preview image-preview" 
            />
          ) : (
            <embed 
              src={fileUrl + '#toolbar=0'} 
              type="application/pdf" 
              className="file-preview pdf-preview"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="file-upload-wrapper">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>파일을 이곳에 드롭하세요...</p>
        ) : (
          <p>이미지(JPG, PNG) 또는 PDF 파일을 드래그하거나 클릭하여 업로드하세요.</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;