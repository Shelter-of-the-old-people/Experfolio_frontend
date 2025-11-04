import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import '../../styles/components/FileUpload.css';

const FileUpload = ({ file, onFileChange }) => {
  const [preview, setPreview] = useState(null);

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
    e.stopPropagation();
    onFileChange(null);
    setPreview(null);
  };

  return (
    <div className="file-upload-wrapper">
      {!preview ? (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>파일을 이곳에 드롭하세요...</p>
          ) : (
            <p>이미지(JPG, PNG) 또는 PDF 파일을 드래그하거나 클릭하여 업로드하세요.</p>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default FileUpload;