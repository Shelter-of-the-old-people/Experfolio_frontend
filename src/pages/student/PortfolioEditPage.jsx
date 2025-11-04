import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PortfolioEditor } from '../../components/organisms';
import { useApi, useLazyApi } from '../../hooks/useApi';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

// 1. 자동 저장 UI 및 커스텀 훅 임포트
import SaveStatusIndicator from '../../components/molecules/SaveStatusIndicator';
import { TextInput, NumberInput } from '../../components/atoms';
import { PortfolioSection } from '../../components/molecules';

// (TempSideNav는 변경 없음 - 이전 단계에서 basicInfo prop 추가됨)
const TempSideNav = ({ sections, basicInfo }) => ( 
  <nav className="temp-sidenav">
    <h4 className="temp-sidenav-header">포트폴리오 목차</h4>
    <ul className="temp-sidenav-list">
      {/* 기본 정보 링크 */}
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
  
  // 2. 저장 상태 및 타이머 Ref 추가
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'unsaved', 'saving', 'saved', 'error'
  const [dirtySectionId, setDirtySectionId] = useState(null); // 변경되었으나 저장되지 않은 섹션 ID
  const saveTimerRef = useRef(null); // 8초 지연 타이머

  // --- [수정 1] 무한 루프 해결 ---
  // 1.1. api.get('/portfolios/me') 함수를 useCallback으로 감싸 안정적인 참조를 생성합니다.
  const fetchApi = useCallback(() => api.get('/portfolios/me'), []);

  // 1.2. useApi 훅에 인라인 함수 대신 안정적인 fetchApi 함수를 전달합니다.
  // (useApi 훅은 기본적으로 마운트 시 1회 fetchApi를 실행합니다)
  const { 
    data: portfolioData, 
    loading: pageLoading,
    error: fetchError,
    execute: fetchPortfolio // (재호출이 필요할 경우를 위해 execute는 유지)
  } = useApi(fetchApi, []); // (기존의 [], false 인자는 []로 통일)

  // 1.3. [삭제] useApi가 이미 데이터를 로드하므로 중복된 fetchPortfolio() 호출을 제거합니다.
  /*
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);
  */
  
  // --- [수정 2] 데이터 파싱 오류 해결 ---
  useEffect(() => {
    if (portfolioData) {
      // 2.1. 'portfolioData.data.data'가 아닌 'portfolioData.data'에서 직접 파싱합니다.
      const { portfolioItems } = portfolioData.data;
      setSections(portfolioItems || []);
      setSaveStatus('saved'); // 로드 완료 = 저장된 상태
    } else if (fetchError && fetchError.message.includes('404')) {
      createInitialPortfolio();
    }
  }, [portfolioData, fetchError]); // (createInitialPortfolio는 의존성에서 제거하여 404 발생 시 1회만 실행되도록 함)

  // (createInitialPortfolio는 POST 요청이므로 .data.data 구조를 사용할 수 있어 수정하지 않음)
  const createInitialPortfolio = async () => {
    setSaveStatus('saving');
    try {
      const basicInfo = {
        name: user?.name || "사용자", schoolName: "학교명 입력", major: "전공 입력", gpa: 0.0,
        desiredPosition: "", referenceUrl: [], awards: [], certifications: [], languages: []
      };
      const response = await api.post('/portfolios', basicInfo);
      const { portfolioItems } = response.data;
      setSections(portfolioItems || []);
      setSaveStatus('saved');
    } catch (createError) {
      console.error("초기 포트폴리오 생성 실패:", createError);
      setSaveStatus('error');
      // (에러 시 최소한의 UI)
      setSections([ { id: `temp-${Date.now()}`, title: '', layout: 'unselected', content: '', file: null } ]);
    }
  };

  // --- (이하 나머지 핸들러는 변경 사항 없음) ---
  const { 
    execute: updateItem, 
    loading: isUpdating 
  } = useLazyApi((itemId, formData) => 
    api.put(`/portfolios/items/${itemId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  );

  const executeSave = async (sectionId) => {
    if (isUpdating || !dirtySectionId || sectionId !== dirtySectionId || String(sectionId).startsWith('temp-')) {
      return;
    }
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setSaveStatus('saving');
    const sectionToSave = sections.find(s => s.id === sectionId);
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

  // (handleAddSection도 POST 응답을 사용하므로 .data.data 유지)
  const handleAddSection = async () => {
    if (dirtySectionId) {
      await executeSave(dirtySectionId);
    }
    const defaultItemDto = { type: 'other', title: '새 섹션', content: '내용을 입력하세요.' };
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(defaultItemDto)], { type: 'application/json' }));
    try {
      const response = await createItem(formData);
      const updatedPortfolio = response.data.data;
      setSections(updatedPortfolio.portfolioItems || []);
      setSaveStatus('saved');
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

  // (로딩 및 에러 UI)
  if (pageLoading && sections.length === 0) {
    return (
      <div className="portfolio-edit-page">
        <div className="portfolio-main-editor" style={{ textAlign: 'center' }}>
          <h2>포트폴리오 불러오는 중...</h2>
        </div>
      </div>
    );
  }
  if (fetchError && !portfolioData && !fetchError.message.includes('404')) {
    return (
      <div className="portfolio-edit-page">
        <div className="portfolio-main-editor" style={{ textAlign: 'center', color: 'var(--color-error)' }}>
          <h2>오류가 발생했습니다.</h2>
          <p>{fetchError.message}</p>
        </div>
      </div>
    );
  }

  const isEditorBusy = isCreating || isDeleting || isUpdating;
  
  // --- [수정 2.2] basicInfo 파싱 수정 ---
  const basicInfo = portfolioData?.data?.basicInfo; // 'data.data'가 아닌 'data'에서 파싱

  return (
    <div className="portfolio-edit-page">
      <TempSideNav sections={sections} basicInfo={basicInfo} />

      <div className="portfolio-main-editor">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>포트폴리오</h2>
          <SaveStatusIndicator status={isUpdating ? 'saving' : saveStatus} />
        </header>
        
        {/* basicInfo 폼 (병합 예정)
          <div id="section-basic-info" className="portfolio-section">
             ... (TextInput, NumberInput for name, major, gpa...)
          </div>
        */}

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