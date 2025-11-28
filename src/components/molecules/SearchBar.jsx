import React, { useState } from 'react';
import '../../styles/components/SearchBar.css';

const SearchBar = ({ onSearch, placeholder, disabled = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar-wrapper">
      <input
        type="text"
        className="search-bar-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button 
        type="submit" 
        className="search-bar-button" 
        disabled={disabled}
        aria-label="검색"
      >
        <img src="/search.svg" alt="검색" />
      </button>
    </form>
  );
};

export default SearchBar;