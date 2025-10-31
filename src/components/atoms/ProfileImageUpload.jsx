import React, { useRef, useState } from 'react';

const ProfileImageUpload = ({
  value,
  onChange,
  disabled = false,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/*'
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(value || null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    if (file.size > maxSize) {
      setError(`파일 크기는 ${maxSize / (1024 * 1024)}MB를 초과할 수 없습니다.`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setError('');
    onChange?.(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="profile-image-upload">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      
      <div className="profile-image-preview">
        {previewUrl ? (
          <img src={previewUrl} alt="프로필 이미지" />
        ) : (
          <div className="profile-image-placeholder">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="35" r="20" fill="#262626" />
              <path d="M 20 100 Q 20 70 50 70 Q 80 70 80 100 Z" fill="#262626" />
            </svg>
          </div>
        )}
      </div>

      <button
        type="button"
        className="profile-image-change-btn"
        onClick={handleClick}
        disabled={disabled}
      >
        사진 변경
      </button>

      {error && (
        <span className="profile-image-error">{error}</span>
      )}
    </div>
  );
};

export default ProfileImageUpload;
