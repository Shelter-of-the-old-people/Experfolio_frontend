import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PortfolioEditor } from '../../components/organisms';
import { useApi, useLazyApi } from '../../hooks/useApi';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import SaveStatusIndicator from '../../components/molecules/SaveStatusIndicator';
import '../../styles/pages/PortfolioEditPage.css';

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
        type: 'unselected', 
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

  const executeSave = useCallback(async (sectionIdToSave, options = {}) => {
    if (isUpdating) {
      console.log('이미 저장 중입니다. 중복 요청을 무시합니다.');
      return;
    }
    
    const sectionToSave = sections.find(s => s.id === sectionIdToSave);
    if (!sectionToSave) {
      console.log('섹션을 찾을 수 없습니다. 이미 삭제되었거나 ID가 변경되었을 수 있습니다:', sectionIdToSave);
      setSaveStatus('saved');
      return;
    }
    
    const { file, ...itemDto } = sectionToSave;
    
    if (options.isPageUnload) {
      if (!file && (!itemDto.attachments || itemDto.attachments.length === 0)) {
        if (itemDto.type !== 'text-only' && itemDto.type !== 'unselected') {
          itemDto.type = 'text-only';
        }
      }
    }
    
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
    
    if (file instanceof File) {
      formData.append('files', file); 
    }
    
    try {
      const response = await updateItem(sectionIdToSave, formData);
      
      const actualData = response.data.data;
      const { portfolioItems } = actualData || {};
      
      if (portfolioItems) {
        setSections(portfolioItems);
      }
      
      setSaveStatus('saved');
      
      if (sectionIdToSave === dirtySectionId) {
        setDirtySectionId(null);
      }
      
    } catch (err) {
      console.error("섹션 저장 실패:", err);
      setSaveStatus('error');
    }
  }, [isUpdating, dirtySectionId, sections, updateItem]);

  const { execute: createItem, loading: isCreating } = useLazyApi((formData) => 
    api.post('/portfolios/items', formData)
  );

  const handleAddSection = async () => {
    if (dirtySectionId) {
      const sectionExists = sections.some(s => s.id === dirtySectionId);
      if (sectionExists && !String(dirtySectionId).startsWith('temp-')) {
        await executeSave(dirtySectionId);
      } else {
        setDirtySectionId(null);
      }
    }
    
    const defaultItemDto = { type: 'unselected', title: '', content: '' };
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
    
    if (dirtySectionId === sectionId) {
      setDirtySectionId(null);
    }
    
    try {
      const response = await deleteItem(sectionId);
      
      const actualData = response.data.data;
      const { portfolioItems } = actualData || {};
      
      if (portfolioItems) {
        setSections(portfolioItems);
      } else {
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

  const handleFileUpload = async (sectionId, file) => {
    if (!file) return;
    
    const sectionToSave = sections.find(s => s.id === sectionId);
    if (!sectionToSave) return;
    
    clearTimeout(saveTimerRef.current);
    setSaveStatus('saving');
    
    const { file: oldFile, ...itemDto } = sectionToSave;
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
    formData.append('files', file);
    
    try {
      const response = await updateItem(sectionId, formData);
      
      const actualData = response.data.data;
      const { portfolioItems } = actualData || {};
      
      if (portfolioItems) {
        setSections(portfolioItems);
      }
      
      setSaveStatus('saved');
      
      if (sectionId === dirtySectionId) {
        setDirtySectionId(null);
      }
      
    } catch (err) {
      console.error("파일 업로드 실패:", err);
      setSaveStatus('error');
      alert('파일 업로드에 실패했습니다.');
    }
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
        executeSave(dirtySectionId, { isPageUnload: true });
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
        <h2>포트폴리오 불러오는 중...</h2>
      </div>
    );
  }
  
  if (fetchError && !portfolioData && !(fetchError || '').includes('포트폴리오를 찾을 수 없습니다')) {
    return (
      <div className="portfolio-edit-page">
        <h2 style={{ color: 'var(--color-error)' }}>오류가 발생했습니다.</h2>
        <p>{fetchError}</p>
      </div>
    );
  }

  const isEditorBusy = isCreating || isDeleting || isUpdating;

  return (
    <div className="portfolio-edit-page">
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
          onFileUpload={handleFileUpload}
          onSectionFocusGained={handleSectionFocusGained}
          onSectionFocusLost={handleSectionFocusLost}
          disabled={isEditorBusy}
        />
      </div>
    </div>
  );
};

export default PortfolioEditPage;