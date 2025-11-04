// shelter-of-the-old-people/experfolio_frontend/Experfolio_frontend--/src/pages/student/PortfolioEditPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PortfolioEditor } from '../../components/organisms';
import { useApi, useLazyApi } from '../../hooks/useApi';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

import SaveStatusIndicator from '../../components/molecules/SaveStatusIndicator';
import { TextInput, NumberInput } from '../../components/atoms';
import { PortfolioSection } from '../../components/molecules';

const TempSideNav = ({ sections, basicInfo }) => ( 
  <nav className="temp-sidenav">
    <h4 className="temp-sidenav-header">포트폴리오 목차</h4>
    <ul className="temp-sidenav-list">
      <li className="temp-sidenav-item">
        <a href="#section-basic-info">
          {basicInfo?.name || '기본 정보'}
        </a>
      </li>
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

const PortfolioEditPage = () => {
  const [sections, setSections] = useState([]);
  const { user } = useAuth();
  
  const [saveStatus, setSaveStatus] = useState('idle');
  const [dirtySectionId, setDirtySectionId] = useState(null);
  const saveTimerRef = useRef(null);
  
  const stateForCleanup = useRef();

  const fetchApi = useCallback(() => api.get('/portfolios/me'), []);
  const { 
    data: portfolioData, 
    loading: pageLoading,
    error: fetchError
  } = useApi(fetchApi, []); 

  useEffect(() => {
    if (portfolioData) {
      const { portfolioItems } = portfolioData.data; 
      setSections(portfolioItems || []);
      setSaveStatus('saved'); 
    } else if (fetchError) {
      const errorMsg = fetchError || '';
      if (errorMsg.includes('포트폴리오를 찾을 수 없습니다') || errorMsg.includes('404')) {
        createInitialPortfolio();
      }
    }
  }, [portfolioData, fetchError, user]); 

  const createInitialPortfolio = async () => {
    setSaveStatus('saving');
    try {
      const basicInfo = {
        name: user?.name || "사용자", schoolName: "학교명 입력", major: "전공 입력", gpa: 0.0,
        desiredPosition: "", referenceUrl: [], awards: [], certifications: [], languages: []
      };
      const response = await api.post('/portfolios', basicInfo);
      // 3. (수정) 데이터 파싱 경로 수정 (data.data 추가)
      const { portfolioItems } = response.data;
      setSections(portfolioItems || []);
      setSaveStatus('saved');
    } catch (createError) {
      console.error("초기 포트폴리오 생성 실패:", createError);
      setSaveStatus('error');
      setSections([ { id: `temp-${Date.now()}`, title: '', layout: 'unselected', content: '', file: null } ]);
    }
  };

  const { 
    execute: updateItem, 
    loading: isUpdating 
  } = useLazyApi((itemId, formData) => 
    api.put(`/portfolios/items/${itemId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  );

  // 4. (수정) executeSave가 최신 'sections'를 참조하도록 수정
  const executeSave = async (sectionId) => {
    if (isUpdating || !dirtySectionId || sectionId !== dirtySectionId || String(sectionId).startsWith('temp-')) {
      return;
    }
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setSaveStatus('saving');
    
    let sectionToSave;
    setSections(currentSections => {
      sectionToSave = currentSections.find(s => s.id === sectionId);
      return currentSections; // 상태 변경 없음, 참조만
    });

    if (!sectionToSave) {
      setSaveStatus('error');
      return;
    }
    const { file, ...itemDto } = sectionToSave;
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
    if (file instanceof File) {
      formData.append('files', file); 
    }
    try {
      await updateItem(sectionId, formData);
      setSaveStatus('saved');
      setDirtySectionId(null); 
    } catch (err) {
      console.error("섹션 저장 실패:", err);
      setSaveStatus('error');
    }
  };

  const { execute: createItem, loading: isCreating } = useLazyApi((formData) => 
    api.post('/portfolios/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  );

  const handleAddSection = async () => {
    if (dirtySectionId) {
      await executeSave(dirtySectionId);
    }
    const defaultItemDto = { type: 'other', title: '', content: '' };
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(defaultItemDto)], { type: 'application/json' }));
    try {
      const response = await createItem(formData);
      // 5. (수정) 데이터 파싱 경로 수정 (data.data 추가)
      const updatedPortfolio = response.data;
      setSections(updatedPortfolio.portfolioItems || []);
      setSaveStatus('saved');
    } catch (err) {
      console.error("섹션 추가 실패:", err);
      setSaveStatus('error');
    }
  };

  // ... (handleDeleteSection, handleUpdateSection, ... 는 변경 없음) ...
  const { execute: deleteItem, loading: isDeleting } = useLazyApi((itemId) => 
    api.delete(`/portfolios/items/${itemId}`)
  );

  const handleDeleteSection = async (sectionId) => {
    if (sections.length <= 1) {
      alert("포트폴리오는 최소 1개의 섹션이 필요합니다.");
      return;
    }
    if (String(sectionId).startsWith('temp-')) {
       setSections(prevSections => prevSections.filter(section => section.id !== sectionId));
       return;
    }
    if (!window.confirm("이 섹션을 정말 삭제하시겠습니까? (서버에서 영구 삭제됩니다)")) {
      return;
    }
    clearTimeout(saveTimerRef.current);
    if (dirtySectionId === sectionId) {
      setDirtySectionId(null);
    }
    try {
      await deleteItem(sectionId);
      setSections(prevSections => prevSections.filter(section => section.id !== sectionId));
      setSaveStatus('saved');
    } catch (err) {
      console.error("섹션 삭제 실패:", err);
      setSaveStatus('error');
    }
  };

  const handleUpdateSection = (updatedSection) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    setDirtySectionId(updatedSection.id);
    setSaveStatus('unsaved');
  };

  const handleSectionFocusGained = (sectionId) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      if (dirtySectionId === sectionId) {
         setSaveStatus('unsaved');
      }
    }
  };

  const handleSectionFocusLost = (sectionId) => {
    if (dirtySectionId && dirtySectionId === sectionId) {
      setSaveStatus('waiting'); 
      saveTimerRef.current = setTimeout(() => {
        executeSave(sectionId);
      }, 8000); // 8초
    }
  };
  
  // --- (페이지 이탈 시 자동 저장 로직 - 변경 없음) ---
  useEffect(() => {
    stateForCleanup.current = {
      dirtySectionId,
      saveStatus,
      executeSave,
      saveTimerRef
    };
  }, [dirtySectionId, saveStatus, executeSave]);

  useEffect(() => {
    const saveImmediately = () => {
      const { dirtySectionId, executeSave, saveTimerRef } = stateForCleanup.current || {};
      if (dirtySectionId && executeSave) {
        if (saveTimerRef && saveTimerRef.current) {
          clearTimeout(saveTimerRef.current);
          saveTimerRef.current = null;
        }
        executeSave(dirtySectionId);
      }
    };
    const handleBeforeUnload = (e) => {
      const { dirtySectionId, saveStatus } = stateForCleanup.current || {};
      if (dirtySectionId || saveStatus === 'unsaved' || saveStatus === 'waiting') {
        saveImmediately();
        e.preventDefault();
        e.returnValue = '저장되지 않은 변경 사항이 있습니다. 페이지를 벗어나시겠습니까?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveImmediately();
    };
  }, []); 

  // --- (로딩 스피너 UI - 변경 없음) ---
  if (pageLoading && sections.length === 0) {
    return (
      <div className="portfolio-edit-page">
        <div className="portfolio-main-editor" style={{ textAlign: 'center' }}>
          <h2>포트폴리오 불러오는 중...</h2>
        </div>
      </div>
    );
  }
  
  // 6. [수정] 404 메시지를 제외한 실제 오류만 화면에 표시
  if (fetchError && !portfolioData && !(fetchError || '').includes('포트폴리오를 찾을 수 없습니다')) {
    return (
      <div className="portfolio-edit-page">
        <div className="portfolio-main-editor" style={{ textAlign: 'center', color: 'var(--color-error)' }}>
          <h2>오류가 발생했습니다.</h2>
          {/* 6.1 (수정) fetchError.message -> fetchError (문자열) */}
          <p>{fetchError}</p>
        </div>
      </div>
    );
  }

  const isEditorBusy = isCreating || isDeleting || isUpdating;
  
  // 7. [수정] 데이터 파싱 경로 수정 (data.data 추가)
  const basicInfo = portfolioData?.data?.data?.basicInfo; 

  return (
    <div className="portfolio-edit-page">
      <TempSideNav sections={sections} basicInfo={basicInfo} />

      <div className="portfolio-main-editor">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>포트폴리오</h2>
          <SaveStatusIndicator status={isUpdating ? 'saving' : saveStatus} />
        </header>
        
        <PortfolioEditor
          sections={sections}
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection}
          onAddSection={handleAddSection}
          onSectionFocusGained={handleSectionFocusGained}
          onSectionFocusLost={handleSectionFocusLost}
          disabled={isEditorBusy}
        />
      </div>
    </div>
  );
};

export default PortfolioEditPage;