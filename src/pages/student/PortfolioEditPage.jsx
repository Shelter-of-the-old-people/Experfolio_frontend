import React, { useState } from 'react';
import { PortfolioEditor } from '../../components/organisms'; // Organism 임포트

// (이 페이지의 CSS는 main.jsx에서 전역으로 임포트됩니다)

// 임시 네비게이션 컴포넌트
const TempSideNav = ({ sections }) => (
  <nav style={{ borderRight: '1px solid #eee', padding: '20px', minWidth: '200px' }}>
    <h4 style={{ marginBottom: '20px' }}>포트폴리오 목차</h4>
    <ul>
      {sections.map((section) => (
        <li key={section.id} style={{ marginBottom: '10px' }}>
          {/* 스크롤 네비게이션: <a href="#id"> 사용 */}
          <a href={`#section-${section.id}`}>
            {section.title || '(제목 없음)'}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const PortfolioEditPage = () => {
  // 23.11.01 요구사항 변경으로 전체 제목 상태 제거
  // const [mainTitle, setMainTitle] = useState('');

  // 2. 전체 섹션 목록 상태
  const [sections, setSections] = useState([
    { 
      id: 1, 
      title: '', 
      layout: 'unselected', // 'unselected'로 초기화
      content: '', 
      file: null 
    }
  ]);

  // 3. 섹션 추가 핸들러
  const handleAddSection = () => {
    setSections(prevSections => [
      ...prevSections,
      {
        id: (prevSections[prevSections.length - 1]?.id || 0) + 1, // 고유 ID 보장
        title: '',
        layout: 'unselected', // 'unselected'로 초기화
        content: '',
        file: null
      }
    ]);
  };

  // 4. 섹션 업데이트 핸들러 (Organism을 통해 Molecule로 전달)
  const handleUpdateSection = (updatedSection) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      )
    );
  };

  // --- 5. [신규] 섹션 삭제 핸들러 ---
  const handleDeleteSection = (sectionId) => {
    // 1개 남은 섹션은 삭제하지 않음 (선택 사항)
    if (sections.length <= 1) {
      alert("포트폴리오는 최소 1개의 섹션이 필요합니다.");
      return;
    }

    setSections(prevSections =>
      prevSections.filter(section => section.id !== sectionId)
    );
  };
  // ---

  return (
    <div className="portfolio-edit-page" style={{ display: 'flex', height: '100%' }}>
      
      {/* 임시 네비게이션 (요구사항 4) */}
      <TempSideNav sections={sections} />

      {/* --- 수정된 부분: 인라인 style 제거, className만 사용 --- */}
      <div className="portfolio-main-editor">
      {/* --- */}
        
        {/* 23.11.01 요구사항 변경으로 전체 제목 <header> 제거 */}
        <header style={{ marginBottom: '30px' }}>
          <h2>포트폴리오 수정</h2>
        </header>

        <PortfolioEditor
          sections={sections}
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection} // <-- 삭제 핸들러 전달
          onAddSection={handleAddSection}
        />
      </div>
    </div>
  );
};

export default PortfolioEditPage;