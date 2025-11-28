import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../routes';
import { Button } from '../components/atoms';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <header className="layout-header public-header">
        <Link to={routes.HOME} className="header-logo">
          Experfolio
        </Link>
        <nav className="header-nav">
          <Button variant="trans" as={Link} to={routes.HOME}>
            로그인
          </Button>
          <Button variant="black" as={Link} to={routes.SIGNUP}>
            회원가입
          </Button>
        </nav>
      </header>
      
      <main className="public-main">
        {children}
      </main>
      
      <footer className="layout-footer public-footer">
        <Link to={routes.HOME} className="footer-logo">
          Experfolio
        </Link>
      </footer>
    </div>
  );
};

export default PublicLayout;