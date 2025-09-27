import React from 'react';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="header-container">
          <div className="logo">
            <h1>Experfolio</h1>
          </div>
        </div>
      </header>
      
      <main className="public-main">
        {children}
      </main>
      
      <footer className="public-footer">
        <div className="footer-container">
          <p>&copy; 2025 Experfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;