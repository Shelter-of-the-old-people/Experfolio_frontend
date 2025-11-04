import React from 'react';
import '../../styles/components/KeywordTag.css';

/**
 * 검색 결과 키워드를 표시하는 태그 (atom)
 * @param {string} children - 표시될 키워드 텍스트
 */
const KeywordTag = ({ children }) => {
  return (
    <span className="keyword-tag">
      {children}
    </span>
  );
};

export default KeywordTag;