import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PortfolioEditor } from '../../components/organisms';
import { useApi, useLazyApi } from '../../hooks/useApi';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import SaveStatusIndicator from '../../components/molecules/SaveStatusIndicator';

const TempSideNav = ({ sections, basicInfo }) => ( 
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
      const normalizedResponse = portfolioData.data;
      const actualData = normalizedResponse.data;
      
      const { portfolioItems } = actualData || {};
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
        name: user?.name || "사용자", 
        schoolName: "학교명 입력", 
        major: "전공 입력", 
        gpa: 0.0,
        desiredPosition: "", 
        referenceUrl: [], 
        awards: [], 
        certifications: [], 
        languages: []
      };
      const response = await api.post('/portfolios', basicInfo);
      
      const actualData = response.data.data;
      const { portfolioItems } = actualData || {};
      setSections(portfolioItems || []);
      setSaveStatus('saved');
    } catch (createError) {
      console.error("초기 포트폴리오 생성 실패:", createError);
      setSaveStatus('error');
      setSections([{ 
        id: `temp-${Date.now()}`, 
        title: '', 
        layout: 'unselected', 
        content: '', 
        file: null 
      }]);
    }
  };

  const { 
    execute: updateItem, 
    loading: isUpdating 
  } = useLazyApi((itemId, formData) => 
    api.put(`/portfolios/items/${itemId}`, formData)
  );

  // **근본적인 해결책 적용:** Guard Clause에서 dirtySectionId 검사를 완전히 제거
  const executeSave = useCallback(async (sectionIdToSave) => {
    // 1. 임시 섹션 검사 (변경 없음)
    if (String(sectionIdToSave).startsWith('temp-')) {
      console.log('임시 섹션은 저장하지 않습니다:', sectionIdToSave);
      return;
    }
    
    // 2. **근본적인 해결:** Guard Clause는 동시성(isUpdating)만 확인합니다.
    // dirtySectionId가 null이어도 이전에 예약된 저장 요청은 진행되어야 합니다.
    if (isUpdating) { 
      return;
    }
    
    // 3. 타이머 클리어 (변경 없음)
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    
    setSaveStatus('saving');
    
    // 섹션 찾기: sections 상태를 직접 참조 (useCallback 덕분에 최신 값)
    const sectionToSave = sections.find(s => s.id === sectionIdToSave);

    // 섹션을 찾지 못하면 조용히 리턴 (경고만 표시)
    if (!sectionToSave) {
      console.warn('저장할 섹션을 찾을 수 없습니다. 이미 삭제되었거나 ID가 변경되었을 수 있습니다:', sectionIdToSave);
      setSaveStatus('saved');
      return;
    }
    
    const { file, ...itemDto } = sectionToSave;
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
    
    if (file instanceof File) {
      formData.append('files', file); 
    }
    
    try {
      const response = await updateItem(sectionIdToSave, formData);
      
      // 응답에서 업데이트된 전체 portfolioItems를 받아 state 갱신
      const actualData = response.data.data;
      const { portfolioItems } = actualData || {};
      
      if (portfolioItems) {
        setSections(portfolioItems);
      }
      
      setSaveStatus('saved');
      
      // 4. **조건부 리셋 유지:** 저장된 ID가 dirtySectionId와 일치할 때만 null로 초기화합니다.
      // 이는 이후 발생할지 모르는 경쟁 조건으로부터 dirty 상태를 보호합니다.
      if (sectionIdToSave === dirtySectionId) {
        setDirtySectionId(null);
      }
      
    } catch (err) {
      console.error("섹션 저장 실패:", err);
      setSaveStatus('error');
      // 실패 시 dirtySectionId는 그대로 유지하여 unload 시 다시 저장 시도
    }
  }, [isUpdating, dirtySectionId, sections, updateItem]);

  const { execute: createItem, loading: isCreating } = useLazyApi((formData) => 
    api.post('/portfolios/items', formData)
  );

  const handleAddSection = async () => {
    // dirty 섹션이 있으면 먼저 저장 시도
    if (dirtySectionId) {
      // 섹션이 실제로 존재하는지 확인
      const sectionExists = sections.some(s => s.id === dirtySectionId);
      if (sectionExists && !String(dirtySectionId).startsWith('temp-')) {
        // Guard Clause 제거 덕분에 이 호출은 isUpdating이 아니면 항상 진행됩니다.
        await executeSave(dirtySectionId);
      } else {
        // 섹션이 없으면 dirty 상태만 초기화
        setDirtySectionId(null);
      }
    }
    
    const defaultItemDto = { type: 'other', title: '', content: '' };
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(defaultItemDto)], { type: 'application/json' }));
    
    try {
      const response = await createItem(formData);
      
      const actualData = response.data.data;
      const { portfolioItems } = actualData || {};
      
      if (portfolioItems) {
        setSections(portfolioItems);
      }
      
      setSaveStatus('saved');
      setDirtySectionId(null);

    } catch (err) {
      console.error("섹션 추가 실패:", err);
      setSaveStatus('error');
    }
  };

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
    
    // **수정:** 삭제하려는 섹션이 dirtySectionId와 일치할 때만 reset 합니다.
    if (dirtySectionId === sectionId) {
      setDirtySectionId(null);
    }
    
    try {
      const response = await deleteItem(sectionId);
      
      // 응답에서 업데이트된 전체 portfolioItems를 받아 state 갱신
      const actualData = response.data.data;
      const { portfolioItems } = actualData || {};
      
      if (portfolioItems) {
        setSections(portfolioItems);
      } else {
        // 응답에 portfolioItems가 없으면 로컬에서 제거
        setSections(prevSections => prevSections.filter(section => section.id !== sectionId));
      }
      
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
    // 타이머를 설정하는 조건은 유지
    if (dirtySectionId && dirtySectionId === sectionId) {
      setSaveStatus('waiting'); 
      saveTimerRef.current = setTimeout(() => {
        executeSave(sectionId);
      }, 8000);
    }
  };
  
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
        // 이 시점에서는 dirtySectionId에 있는 가장 최근의 ID만 저장됩니다. (언로드 시)
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

  if (pageLoading && sections.length === 0) {
    return (
      <div className="portfolio-edit-page">
        <div className="portfolio-main-editor" style={{ textAlign: 'center' }}>
          <h2>포트폴리오 불러오는 중...</h2>
        </div>
      </div>
    );
  }
  
  if (fetchError && !portfolioData && !(fetchError || '').includes('포트폴리오를 찾을 수 없습니다')) {
    return (
      <div className="portfolio-edit-page">
        <div className="portfolio-main-editor" style={{ textAlign: 'center', color: 'var(--color-error)' }}>
          <h2>오류가 발생했습니다.</h2>
          <p>{fetchError}</p>
        </div>
      </div>
    );
  }

  const isEditorBusy = isCreating || isDeleting || isUpdating;
  
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