import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import '../../styles/components/FileUpload.css';

const FileUpload = ({ file, onFileChange }) => {
  const [preview, setPreview] = useState(null);

  // 파일이 변경될 때마다 미리보기를 생성
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    
    // 이전에 생성된 URL이 있다면 해제 (메모리 누수 방지)
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    // 새 파일 미리보기 URL 생성
    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);

    // 컴포넌트 언마운트 시 URL 해제
    return () => URL.revokeObjectURL(newPreview);
  }, [file]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
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

  const removeFile = (e) => {
    e.stopPropagation(); // 부모(dropzone)의 클릭 이벤트 방지
    onFileChange(null);
    setPreview(null);
  };

  return (
    <div className="file-upload-wrapper">
      {!preview ? (
        // 파일이 없을 때: 드롭존 표시
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>파일을 이곳에 드롭하세요...</p>
          ) : (
            <p>이미지(JPG, PNG) 또는 PDF 파일을 드래그하거나 클릭하여 업로드하세요.</p>
          )}
        </div>
      ) : (
        // 파일이 있을 때: 미리보기 표시
        <div className="preview-container">
          <button onClick={removeFile} className="remove-file-btn" title="파일 삭제">X</button>
          
          {file.type.startsWith('image/') ? (
            // 이미지 미리보기
            <img src={preview} alt="미리보기" className="file-preview image-preview" />
          ) : (
            // PDF 미리보기 (embed 태그 사용)
            <embed 
              src={preview} 
              type="application/pdf" 
              className="file-preview pdf-preview"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;