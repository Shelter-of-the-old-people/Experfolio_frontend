import React, { useState, useEffect, useCallback } from 'react';
import { PortfolioEditor } from '../../components/organisms';
import { SaveStatusIndicator } from '../../components/molecules';
import { useApi, useLazyApi } from '../../hooks/useApi';
import api from '../../services/api';

const TempSideNav = ({ sections }) => (
  <nav className="temp-sidenav">
    <h4 className="temp-sidenav-header">포트폴리오 목차</h4>
    <ul className="temp-sidenav-list">
      {sections.map((section) => (
        <li key={section.id} className="temp-sidenav-item">
          <a href={`#section-${section.id}`}>
            {section.title || '(제목 없음)'}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const MOCK_BASIC_INFO = {
  name: "테스트 학생",
  schoolName: "Experfolio 대학교",
  major: "컴퓨터공학부",
  gpa: 4.0,
  desiredPosition: "AI 엔지니어",
  referenceUrl: ["https://github.com/mock"],
  awards: [],
  certifications: [],
  languages: []
};

const PortfolioEditPage = () => {
  const [sections, setSections] = useState([]);
  const [portfolioId, setPortfolioId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');
  
  const { execute: loadPortfolio } = useLazyApi(() => api.get('/api/portfolios/me'));
  const { execute: createPortfolio } = useLazyApi((basicInfo) => api.post('/api/portfolios', basicInfo));
  const { execute: addSectionApi } = useLazyApi((dto) => {
    const formData = new FormData();
    formData.append('item', JSON.stringify(dto));
    return api.post('/api/portfolios/items', formData);
  });
  const { execute: updateSectionApi } = useLazyApi(({ itemId, itemDto, file }) => {
    const formData = new FormData();
    formData.append('item', JSON.stringify(itemDto));
    if (file) {
      formData.append('files', file);
    }
    return api.put(`/api/portfolios/items/${itemId}`, formData);
  });
  const { execute: deleteSectionApi } = useLazyApi((itemId) => api.delete(`/api/portfolios/items/${itemId}`));

  const callApi = async (apiFunc, ...args) => {
    setSaveStatus('saving');
    try {
      const response = await apiFunc(...args);
      setSaveStatus('saved');
      return response;
    } catch (error) {
      console.error("API Error:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      throw error;
    }
  };

  useEffect(() => {
    const initializePortfolio = async () => {
      try {
        const response = await loadPortfolio();
        setSections(response.data.portfolioItems || []);
        setPortfolioId(response.data.portfolioId);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const createResponse = await callApi(createPortfolio, MOCK_BASIC_INFO);
            setSections(createResponse.data.portfolioItems || []);
            setPortfolioId(createResponse.data.portfolioId);
          } catch (createError) {
            console.error("Mock 포트폴리오 생성 실패:", createError);
            setSaveStatus('error');
          }
        } else {
          console.error("포트폴리오 로드 실패:", error);
          setSaveStatus('error');
        }
      }
    };
    initializePortfolio();
  }, []);

  const handleAddSection = async () => {
    if (!portfolioId) return;

    const newSectionDto = { 
      title: '', 
      type: 'unselected', 
      content: '' 
    };
    
    try {
      const response = await callApi(addSectionApi, newSectionDto);
      setSections(response.data.portfolioItems || []);
    } catch (error) {
      // callApi가 에러 처리
    }
  };

  const handleUpdateSection = useCallback(async (updatedSection) => {
    if (!portfolioId) return;

    const { id: itemId, title, type, content, file } = updatedSection;
    const itemDto = { title, type, content };

    try {
      const response = await callApi(updateSectionApi, { itemId, itemDto, file });
      setSections(response.data.portfolioItems || []);
    } catch (error) {
      // callApi가 에러 처리
    }
  }, [portfolioId]);

  const handleDeleteSection = async (sectionId) => {
    if (sections.length <= 1) {
      alert("포트폴리오는 최소 1개의 섹션이 필요합니다.");
      return;
    }
    
    try {
      await callApi(deleteSectionApi, sectionId);
      setSections(prevSections =>
        prevSections.filter(section => section.id !== sectionId)
      );
    } catch (error) {
      // callApi가 에러 처리
    }
  };

  return (
    <div className="portfolio-edit-page">
      <TempSideNav sections={sections} />

      <div className="portfolio-main-editor">
        <header>
          <h2>포트폴리오</h2>
          <SaveStatusIndicator status={saveStatus} />
        </header>

        <PortfolioEditor
          sections={sections}
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection}
          onAddSection={handleAddSection}
        />
      </div>
    </div>
  );
};

export default PortfolioEditPage;