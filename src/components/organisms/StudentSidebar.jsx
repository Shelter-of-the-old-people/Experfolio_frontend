import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../routes';
import '../../styles/components/StudentSidebar.css';

const StudentSidebar = () => {
  const location = useLocation();
  const isPortfolioEditPage = location.pathname === routes.PORTFOLIO_EDIT;
  const isPortfolioPage = location.pathname === routes.PORTFOLIO;
  const isProfileEditPage = location.pathname === routes.PROFILE_EDIT;
  
  const showPortfolioTOC = isPortfolioEditPage || isPortfolioPage;
  const showProfileTOC = isProfileEditPage;

  return (
    <aside className="student-sidebar">
      <div className="sidebar-fixed-section">
        <h4 className="sidebar-section-title">메뉴</h4>
        <nav className="sidebar-nav">
            <Link 
                to={routes.PORTFOLIO} 
                className={`sidebar-nav-link ${location.pathname === routes.PORTFOLIO ? 'active' : ''}`}
                >
                <div className='icon-container'><img src="/public/deshboard.svg" className="sidebar-icon" /></div>
                포트폴리오
            </Link>

            <Link 
                to={routes.PROFILE_EDIT} 
                className={`sidebar-nav-link ${location.pathname === routes.PROFILE_EDIT ? 'active' : ''}`}
                >
                <div className='icon-container'><img src="/public/profile.svg" className="sidebar-icon" /></div>
                개인 정보 수정
            </Link>
            <Link 
                to={routes.PORTFOLIO_EDIT} 
                className={`sidebar-nav-link ${location.pathname === routes.PORTFOLIO_EDIT ? 'active' : ''}`}
                >
                <div className='icon-container'><img src="/public/portfolio.svg" className="sidebar-icon" /></div>
                포트폴리오 수정
            </Link>
        </nav>
      </div>

      {showPortfolioTOC && (
        <div className="sidebar-scrollable-section">
          <PortfolioTableOfContents />
        </div>
      )}
      
      {showProfileTOC && (
        <div className="sidebar-scrollable-section">
          <ProfileTableOfContents />
        </div>
      )}
    </aside>
  );
};

const PortfolioTableOfContents = () => {
  const [sections, setSections] = React.useState([]);

  React.useEffect(() => {
    const updateSections = () => {
      const editContainer = document.querySelector('.portfolio-main-editor');
      const viewContainer = document.querySelector('.portfolio-page');
      const targetContainer = editContainer || viewContainer;
      
      if (!targetContainer) {
        return;
      }

      const sectionElements = targetContainer.querySelectorAll(
        '[id^="section-"], .portfolio-section-viewer'
      );
      
      if (sectionElements.length === 0) {
        return;
      }
      
      const sectionData = Array.from(sectionElements).map((el, index) => {
        let id, title;
        
        if (el.id && el.id.startsWith('section-')) {
          id = el.id.replace('section-', '');
          
          const titleInput = el.querySelector('.input');
          if (titleInput) {
            title = titleInput.value || '(제목 없음)';
          } else {
            const h4 = el.querySelector('h4.section-title');
            const h4Any = el.querySelector('h4');
            const titleAny = el.querySelector('.section-title');
            
            if (h4) {
              title = h4.textContent?.trim();
            } else if (h4Any) {
              title = h4Any.textContent?.trim();
            } else if (titleAny) {
              title = titleAny.textContent?.trim();
            }
            
            title = title || '(제목 없음)';
          }
        } 
        else {
          const idAttr = el.id || el.getAttribute('id');
          id = idAttr ? idAttr.replace('section-', '') : `viewer-${index}`;
          
          const h4 = el.querySelector('h4.section-title');
          const h4Any = el.querySelector('h4');
          const titleAny = el.querySelector('.section-title');
          
          if (h4) {
            title = h4.textContent?.trim();
          } else if (h4Any) {
            title = h4Any.textContent?.trim();
          } else if (titleAny) {
            title = titleAny.textContent?.trim();
          }
          
          title = title || '(제목 없음)';
        }
        
        return { id, title };
      });
      
      setSections(sectionData);
    };

    setTimeout(updateSections, 100);
    setTimeout(updateSections, 500);
    setTimeout(updateSections, 1000);

    const observer = new MutationObserver(updateSections);
    
    const editContainer = document.querySelector('.portfolio-main-editor');
    const viewContainer = document.querySelector('.portfolio-page');
    const targetNode = editContainer || viewContainer;
    
    if (targetNode) {
      observer.observe(targetNode, { 
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['value']
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSectionClick = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    const mainContent = document.querySelector('.main-content');
    
    if (element && mainContent) {
      const elementRect = element.getBoundingClientRect();
      const mainContentRect = mainContent.getBoundingClientRect();
      
      const currentScrollTop = mainContent.scrollTop;
      
      const elementTopRelativeToMainContent = elementRect.top - mainContentRect.top;
      const mainContentHeight = mainContent.clientHeight;
      const elementHeight = elementRect.height;
      
      const targetScrollTop = currentScrollTop + elementTopRelativeToMainContent - (mainContentHeight / 2) + (elementHeight / 2);
      
      mainContent.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="sidebar-toc-wrapper">
      <h4 className="sidebar-section-title">포트폴리오 목차</h4>
      <ul className="sidebar-toc-list">
        {sections.map((section) => (
          <li key={section.id} className="sidebar-toc-item">
            <button
              className="sidebar-toc-link"
              onClick={() => handleSectionClick(section.id)}
              type="button"
            >
              <span className="sidebar-toc-text">
                {section.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProfileTableOfContents = () => {
  const profileSections = [
    { id: 'profile-section', label: '프로필' },
    { id: 'awards-section', label: '수상경력' },
    { id: 'certifications-section', label: '자격증' },
    { id: 'languages-section', label: '언어' }
  ];

  const handleSectionClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    const mainContent = document.querySelector('.main-content');
    
    if (element && mainContent) {
      const elementRect = element.getBoundingClientRect();
      const mainContentRect = mainContent.getBoundingClientRect();
      
      const currentScrollTop = mainContent.scrollTop;
      
      const elementTopRelativeToMainContent = elementRect.top - mainContentRect.top;
      const mainContentHeight = mainContent.clientHeight;
      const elementHeight = elementRect.height;
      
      const targetScrollTop = currentScrollTop + elementTopRelativeToMainContent - (mainContentHeight / 2) + (elementHeight / 2);
      
      mainContent.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sidebar-toc-wrapper">
      <h4 className="sidebar-section-title">페이지 목차</h4>
      <ul className="sidebar-toc-list">
        {profileSections.map((section) => (
          <li key={section.id} className="sidebar-toc-item">
            <button
              className="sidebar-toc-link"
              onClick={() => handleSectionClick(section.id)}
              type="button"
            >
              <span className="sidebar-toc-text">
                {section.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentSidebar;