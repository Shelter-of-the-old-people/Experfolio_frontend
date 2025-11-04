import React, { useState, useEffect, useCallback } from 'react';
import { PortfolioEditor } from '../../components/organisms';
import { SaveStatusIndicator } from '../../components/molecules';
import { useApi, useLazyApi } from '../../hooks/useApi';
import api from '../../services/api';

// --- API 함수 정의 (경로 수정됨) ---
const addSectionRequest = (formData) => 
  api.post('/portfolios/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

const updateSectionRequest = ({ itemId, formData }) => 
  api.put(`/portfolios/items/${itemId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

const deleteSectionRequest = (itemId) => 
  api.delete(`/portfolios/items/${itemId}`);

// --- 임시 사이드바 (기존과 동일) ---
const TempSideNav = ({ sections }) => (
  <nav className="temp-sidenav">
    <h4 className="temp-sidenav-header">포트폴리오 목차</h4>
    <ul className="temp-sidenav-list">
      {/* [수정됨] sections가 렌더링 초기에 undefined일 수 있으므로 방어 코드 추가 */}
      {(sections || []).map((section) => (
        <li key={section.id} className="temp-sidenav-item">
          <a href={`#section-${section.id}`}>
            {section.title || '(제목 없음)'}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);


const PortfolioEditPage = () => {
  const [sections, setSections] = useState([]);
  const [saveStatus, setSaveStatus] = useState('idle');

  // --- API 훅 정의 ---
  const { 
    data: portfolioData, 
    loading: pageLoading, 
    error: pageError 
  } = useApi(() => api.get('/portfolios/me'));

  const { 
    execute: addSectionApi, 
    loading: isAdding 
  } = useLazyApi(addSectionRequest);
  
  const { 
    execute: updateSectionApi, 
    loading: isUpdating 
  } = useLazyApi(updateSectionRequest);

  const { 
    execute: deleteSectionApi, 
    loading: isDeleting 
  } = useLazyApi(deleteSectionRequest);

  // 1. 초기 데이터 로드 (에러 발생 지점 수정)
  useEffect(() => {
    if (portfolioData?.data) {
      // [수정됨] portfolioData.data.portfolioItems가 null일 경우를 대비해
      // (portfolioData.data.portfolioItems || [])을 사용합니다.
      const loadedSections = (portfolioData.data.portfolioItems || []).map(item => ({ 
        id: item.id,
        title: item.title,
        layout: item.type || 'text-only',
        content: item.content,
        file: null, 
      }));
      setSections(loadedSections);
      setSaveStatus('saved'); 
    } else if (pageError) {
      console.error("포트폴리오 로딩 실패:", pageError);
      setSaveStatus('error');
    }
  }, [portfolioData, pageError]);

  // 2. FormData 생성 헬퍼
  const createSectionFormData = (section) => {
    const formData = new FormData();
    const itemDto = {
      type: section.layout,
      title: section.title,
      content: section.content,
    };
    formData.append('item', new Blob([JSON.stringify(itemDto)], { 
      type: "application/json" 
    }));
    if (section.file instanceof File) {
      formData.append('files', section.file, section.file.name);
    }
    return formData;
  };

  // 3. 섹션 추가 핸들러 (방어 코드 추가)
  const handleAddSection = useCallback(async () => {
    setSaveStatus('saving');
    const newSectionStub = {
      title: '',
      content: '',
      layout: 'text-only',
      file: null
    };
    const formData = createSectionFormData(newSectionStub);
    try {
      const result = await addSectionApi(formData);
      if (result) {
        // [수정됨] (result.data.portfolioItems || [])
        setSections((result.data.portfolioItems || []).map(item => ({
          id: item.id,
          title: item.title,
          layout: item.type || 'text-only',
          content: item.content,
          file: null, 
        })));
        setSaveStatus('saved');
      }
    } catch (err) {
      console.error("섹션 추가 실패:", err);
      setSaveStatus('error');
    }
  }, [addSectionApi]);

  // 4. 섹션 삭제 핸들러
  const handleDeleteSection = useCallback(async (sectionId) => {
    if (sections.length <= 1) {
      alert("포트폴리오는 최소 1개의 섹션이 필요합니다.");
      return;
    }
    setSaveStatus('saving');
    try {
      await deleteSectionApi(sectionId);
      setSections(prevSections =>
        prevSections.filter(section => section.id !== sectionId)
      );
      setSaveStatus('saved');
    } catch (err) {
      console.error("섹션 삭제 실패:", err);
      setSaveStatus('error');
    }
  }, [deleteSectionApi, sections.length]);


  // 5. 섹션 수정 핸들러 (onBlur 시점)
  //    (TextInput/TextEditor의 onBlur 시 호출됨)
  const handleUpdateSection = useCallback(async (updatedSection) => {
    // 1. UI state를 즉시 업데이트
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    
    // 2. API 저장을 즉시 실행
    setSaveStatus('saving');
    const formData = createSectionFormData(updatedSection);
    
    try {
      const result = await updateSectionApi({ itemId: updatedSection.id, formData });
      
      if (result) {
        // [수정됨] (result.data.portfolioItems || [])
        setSections((result.data.portfolioItems || []).map(item => ({
          id: item.id,
          title: item.title,
          layout: item.type || 'text-only',
          content: item.content,
          file: null, 
        })));
        setSaveStatus('saved');
      }
    } catch (err) {
      console.error("섹션 수정 실패:", err);
      setSaveStatus('error');
    }
  }, [updateSectionApi]);


  if (pageLoading) {
    return <div>포트폴리오 로딩 중...</div>;
  }

  if (pageError) {
    return <div>오류가 발생했습니다: {pageError.message}</div>;
  }

  return (
    <div className="portfolio-edit-page">
      <TempSideNav sections={sections} />

      <div className="portfolio-main-editor">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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