import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../routes';
import { Button } from '../components/atoms';
import { useAuth } from '../hooks/useAuth'; // <--- 이 줄을 추가합니다.
import { CompanySidebar } from '../components/organisms';

const AuthenticatedLayout = ({ children, userRole }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // 이제 'useAuth'가 정의되었습니다.

  const handleLogout = () => {
    logout();
    navigate(routes.HOME); 
  };

  const handleGoToProfile = () => {
    navigate(routes.PROFILE); 
  };

  // [추가] 역할에 따라 로고 클릭 시 이동할 경로를 결정하는 함수
  const getLogoLink = () => {
    if (userRole === 'RECRUITER') {
      return routes.SEARCH;    // 기업 -> 인재 검색
    } else if (userRole === 'JOB_SEEKER') {
      return routes.PORTFOLIO; // 학생 -> 포트폴리오
    }
    return routes.HOME;        // 그 외(에러 등) -> 홈
  };

  const getSidebarItems = () => {
    if (userRole === 'RECRUITER') {
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
          <aside className="sidebar">
            {/* 구직자 사이드바 */}
          </aside>
        ) : null}

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