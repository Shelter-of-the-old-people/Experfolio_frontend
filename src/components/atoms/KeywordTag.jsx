import React from 'react';
import '../../styles/components/KeywordTag.css';

const KeywordTag = ({ children }) => {
  return (
    <span className="keyword-tag">
      {children}
    </span>
  );
};

export default KeywordTag;