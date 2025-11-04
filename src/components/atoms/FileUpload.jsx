import React, { useRef } from 'react';

const FileUpload = ({
  value,
  onChange,
  accept = 'image/*',
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  preview = false,
  maxSize = 5 * 1024 * 1024,
  ...props
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      onChange?.(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > maxSize) {
      if (errorMessage) {
        errorMessage(`파일 크기는 ${maxSize / (1024 * 1024)}MB를 초과할 수 없습니다.`);
      }
      return;
    }

    onChange?.(file);

    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const getLabelClassName = () => {
    let classes = ['file-upload-label'];
    
    if (error) {
      classes.push('file-upload-label-error');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="file-upload-wrapper">
      <div className="file-upload-label-wrapper">
        {label && (
          <label className={getLabelClassName()}>
            {label}
            {required && <span className={`file-upload-required ${error ? 'file-upload-required-error' : ''}`}>*</span>}
          </label>
        )}
        {error && errorMessage && (
          <span className="file-upload-error-message">{errorMessage}</span>
        )}
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        style={{ display: 'none' }}
        {...props}
      />
      
      <button
        type="button"
        className="file-upload-trigger"
        onClick={handleClick}
        disabled={disabled}
      >
        {value ? value.name : '파일 선택'}
      </button>

      {preview && previewUrl && (
        <div className="file-upload-preview">
          <img src={previewUrl} alt="미리보기" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
