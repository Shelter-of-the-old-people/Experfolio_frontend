import React from 'react';

const AuthenticatedLayout = ({ children, userRole }) => {
  const getSidebarItems = () => {
    if (userRole === 'COMPANY') {
      return [
        { path: '/search', label: '인재 검색' },
        { path: '/profile', label: '기업 정보' }
      ];
    } else if (userRole === 'STUDENT') {
      return [
        { path: '/portfolio', label: '포트폴리오' },
        { path: '/portfolio/edit', label: '포트폴리오 수정' },
        { path: '/profile', label: '개인 정보' }
      ];
    }
    return [];
  };

  return (
    <div className="authenticated-layout">
      <header className="auth-header">
        <div className="header-container">
          <div className="logo">
            <h1>Experfolio</h1>
          </div>
          <nav className="header-nav">
            <button className="nav-item">마이페이지</button>
            <button className="nav-item">로그아웃</button>
          </nav>
        </div>
      </header>
      
      <div className="layout-body">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {getSidebarItems().map((item, index) => (
              <a key={index} href={item.path} className="sidebar-item">
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        
        <main className="main-content">
          {children}
        </main>
      </div>
      
      <footer className="auth-footer">
        <div className="footer-container">
          <p>&copy; 2025 Experfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticatedLayout;