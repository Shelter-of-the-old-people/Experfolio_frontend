import React, { useState } from 'react';
import { TextInput } from '../../components/atoms';
import { PortfolioEditor } from '../../components/organisms'; // Organism 임포트

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
  // 1. 포트폴리오 전체 제목 상태
  const [mainTitle, setMainTitle] = useState('');

  // 2. 전체 섹션 목록 상태
  const [sections, setSections] = useState([
    { id: 1, title: '', layout: 'text-only', content: '', file: null }
  ]);

  // 3. 섹션 추가 핸들러
  const handleAddSection = () => {
    setSections(prevSections => [
      ...prevSections,
      {
        id: (prevSections[prevSections.length - 1]?.id || 0) + 1, // 고유 ID 보장
        title: '',
        layout: 'text-only',
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

  return (
    <div className="portfolio-edit-page" style={{ display: 'flex', height: '100%' }}>
      
      {/* 임시 네비게이션 (요구사항 4) */}
      <TempSideNav sections={sections} />

      <div className="portfolio-main-editor" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h2>포트폴리오 수정</h2>
          <TextInput
            label="포트폴리오 전체 제목"
            value={mainTitle}
            onChange={setMainTitle}
            placeholder="예: '열정적인 프론트엔드 개발자 OOO입니다'"
          />
        </header>

        {/* --- 수정된 부분: 임시 구현을 실제 컴포넌트로 교체 --- */}
        <PortfolioEditor
          sections={sections}
          onUpdateSection={handleUpdateSection}
          onAddSection={handleAddSection}
        />
        {/* --- */}

      </div>
    </div>
  );
};

export default PortfolioEditPage;