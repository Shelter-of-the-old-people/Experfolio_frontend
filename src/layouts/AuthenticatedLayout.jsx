import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../routes';
import { Button } from '../components/atoms';
import { useAuth } from '../hooks/useAuth'; 
import { CompanySidebar, StudentSidebar } from '../components/organisms'; 

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

  const getLogoLink = () => {
    if (userRole === 'RECRUITER') {
      return routes.SEARCH; 
    } else if (userRole === 'JOB_SEEKER') {
      return routes.PORTFOLIO; 
    }
    return routes.HOME;  
  };

  return (
    <div className="authenticated-layout">
      <header className="layout-header auth-header">
        <Link to={getLogoLink()} className="header-logo">
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
        {userRole === 'RECRUITER' ? (
          <CompanySidebar />
        ) : userRole === 'JOB_SEEKER' ? (
          <StudentSidebar />
        ) : null}
        
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