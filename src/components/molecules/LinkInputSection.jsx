import React, { useState } from 'react';
import { TextInput, Button } from '../atoms';

const LinkInputSection = ({
  onAdd,
  disabled = false
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAdd = () => {
    if (!linkUrl.trim()) {
      setError('URL을 입력해주세요.');
      return;
    }

    if (!validateUrl(linkUrl)) {
      setError('올바른 URL 형식이 아닙니다.');
      return;
    }

    setError('');
    onAdd?.(linkUrl);
    setLinkUrl('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="link-input-section">
      <div className="link-input-wrapper" style={{width: '100%'}}>
        <TextInput
          label="첨부링크"
          value={linkUrl}
          onChange={setLinkUrl}
          onKeyPress={handleKeyPress}
          placeholder="작품 여랑을 보여줄 링크를 추가해주세요."
          disabled={disabled}
          error={!!error}
          errorMessage={error}
        />
      </div>
      <Button
        variant="trans"
        size="default"
        onClick={handleAdd}
        disabled={disabled || !linkUrl.trim()}
      >
        + 추가하기
      </Button>
    </div>
  );
};

export default LinkInputSection;
