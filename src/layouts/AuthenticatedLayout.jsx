import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../routes';
import { Button } from '../components/atoms';

const AuthenticatedLayout = ({ children, userRole }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(routes.HOME); 
  };

  const handleGoToProfile = () => {
    navigate(routes.PROFILE); 
  };

  const getSidebarItems = () => {
    if (userRole === 'RECURITER') {
      return [
        { path: routes.SEARCH, label: '인재 검색' },
        { path: routes.PROFILE, label: '기업 정보' }
      ];
    } else if (userRole === 'JOB_SEEKER') {
      return [
        { path: routes.PORTFOLIO, label: '포트폴리오' },
        { path: routes.PORTFOLIO_EDIT, label: '포트폴리오 수정' },
        { path: routes.PROFILE, label: '개인 정보' }
      ];
    }
    return [];
  };

  return (
    <div className="authenticated-layout">
      <header className="layout-header auth-header">
        <Link to={routes.HOME} className="header-logo">
          Experfolio
        </Link>
        <nav className="header-nav">
          <Button variant="trans" onClick={handleGoToProfile}>
            마이페이지
          </Button>
          <Button variant="black" onClick={handleLogout}>
            로그아웃
          </Button>
        </nav>
      </header>
      
      <div className="layout-body">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {getSidebarItems().map((item, index) => (
              <Link key={index} to={item.path} className="sidebar-item">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="main-content">
          {children}
        </main>
      </div>
      
      <footer className="layout-footer auth-footer">
        <Link to={routes.HOME} className="footer-logo">
          Experfolio
        </Link>
      </footer>
    </div>
  );
};

export default AuthenticatedLayout;