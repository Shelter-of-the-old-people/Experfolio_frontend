import React, { useState, useEffect, useRef } from 'react';
import { PortfolioEditor } from '../../components/organisms';
import { useApi, useLazyApi } from '../../hooks/useApi';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth'; // ../../contexts' -> '../../hooks/useAuth'

// 1. 자동 저장 UI 및 커스텀 훅 임포트
import SaveStatusIndicator from '../../components/molecules/SaveStatusIndicator'; // 경로 수정
import { TextInput, NumberInput } from '../../components/atoms';
import { PortfolioSection } from '../../components/molecules'; // PortfolioEditor가 사용하므로 임포트 (경로 가정)

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

// (페이지 컴포넌트의 나머지 로직은 이전 단계와 동일합니다.)
// ... (이전 단계의 PortfolioEditPage.jsx 코드) ...
const PortfolioEditPage = () => {
  const [sections, setSections] = useState([]);
  const { user } = useAuth();
  
  // 2. 저장 상태 및 타이머 Ref 추가
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'unsaved', 'saving', 'saved', 'error'
  const [dirtySectionId, setDirtySectionId] = useState(null); // 변경되었으나 저장되지 않은 섹션 ID
  const saveTimerRef = useRef(null); // 8초 지연 타이머

  // (기존) GET /api/portfolios/me (이름 변경)
  const { 
    data: portfolioData, 
    loading: pageLoading,
    error: fetchError,
    execute: fetchPortfolio 
  } = useApi(() => api.get('/portfolios/me'), [], false); 

  // (기존) 데이터 로드 로직
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    if (portfolioData) {
      const { portfolioItems } = portfolioData.data.data;
      setSections(portfolioItems || []);
      setSaveStatus('saved'); // 로드 완료 = 저장된 상태
    } else if (fetchError && fetchError.message.includes('404')) {
      createInitialPortfolio();
    }
  }, [portfolioData, fetchError]);

  const createInitialPortfolio = async () => {
    setSaveStatus('saving');
    try {
      const basicInfo = {
        name: user?.name || "사용자", schoolName: "학교명 입력", major: "전공 입력", gpa: 0.0,
        desiredPosition: "", referenceUrl: [], awards: [], certifications: [], languages: []
      };
      const response = await api.post('/portfolios', basicInfo);
      const { portfolioItems } = response.data.data;
      setSections(portfolioItems || []);
      setSaveStatus('saved');
    } catch (createError) {
      console.error("초기 포트폴리오 생성 실패:", createError);
      setSaveStatus('error');
      // (에러 시 최소한의 UI)
      setSections([ { id: `temp-${Date.now()}`, title: '', layout: 'unselected', content: '', file: null } ]);
    }
  };

  // --- 3. [신규] 섹션 수정 API (PUT /api/portfolios/items/{itemId}) ---
  const { 
    execute: updateItem, 
    loading: isUpdating 
  } = useLazyApi((itemId, formData) => 
    api.put(`/portfolios/items/${itemId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  );

  // --- 4. [신규] 실제 저장 로직 (즉시 또는 8초 후 호출됨) ---
  const executeSave = async (sectionId) => {
    // 이미 저장 중이거나, 변경 사항이 없거나, 임시 ID인 경우 중단
    if (isUpdating || !dirtySectionId || sectionId !== dirtySectionId || String(sectionId).startsWith('temp-')) {
      return;
    }
    
    // 기존 8초 타이머가 있다면 취소 (중복 실행 방지)
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

    // DTO와 파일(file)을 FormData로 구성
    const { file, ...itemDto } = sectionToSave;
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
    
    // file이 File 객체인 경우 (새로 업로드된 파일)에만 추가
    if (file instanceof File) {
      formData.append('files', file); 
    }
    // (file이 null이거나 단순 문자열 경로(기존 파일)이면 'files'를 보내지 않음)

    try {
      await updateItem(sectionId, formData);
      setSaveStatus('saved');
      setDirtySectionId(null); // 저장 완료 후 'dirty' 상태 해제
    } catch (err) {
      console.error("섹션 저장 실패:", err);
      setSaveStatus('error');
    }
  };

  // (기존) 섹션 추가 API
  const { execute: createItem, loading: isCreating } = useLazyApi((formData) => 
    api.post('/portfolios/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  );

  // --- 5. [수정] handleAddSection (요구사항 3) ---
  const handleAddSection = async () => {
    // 섹션 추가 전, 저장할 변경 사항이 있는지 확인
    if (dirtySectionId) {
      await executeSave(dirtySectionId); // 8초 딜레이 없이 즉시 저장
    }

    // (기존 추가 로직)
    const defaultItemDto = { type: 'other', title: '새 섹션', content: '내용을 입력하세요.' };
    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(defaultItemDto)], { type: 'application/json' }));

    try {
      const response = await createItem(formData);
      const updatedPortfolio = response.data.data;
      setSections(updatedPortfolio.portfolioItems || []);
      setSaveStatus('saved'); // 새 섹션 추가 후 '저장됨' 상태
    } catch (err) {
      console.error("섹션 추가 실패:", err);
      setSaveStatus('error');
    }
  };

  // (기존) 섹션 삭제 API
  const { execute: deleteItem, loading: isDeleting } = useLazyApi((itemId) => 
    api.delete(`/portfolios/items/${itemId}`)
  );

  // (기존) handleDeleteSection
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

    // 삭제 전, 혹시 저장 중이거나 대기 중인 타이머가 있다면 취소
    clearTimeout(saveTimerRef.current);
    if (dirtySectionId === sectionId) {
      setDirtySectionId(null);
    }

    try {
      await deleteItem(sectionId);
      setSections(prevSections => prevSections.filter(section => section.id !== sectionId));
      setSaveStatus('saved'); // 삭제도 '저장됨' 상태로 간주
    } catch (err) {
      console.error("섹션 삭제 실패:", err);
      setSaveStatus('error');
    }
  };

  // --- 6. [수정] handleUpdateSection (요구사항 1) ---
  const handleUpdateSection = (updatedSection) => {
    // 1. UI는 즉시 반응하도록 로컬 상태를 업데이트
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    // 2. 변경 사항이 발생했음을 기록
    setDirtySectionId(updatedSection.id);
    setSaveStatus('unsaved');
    // 3. 8초 타이머는 여기(onChange)가 아닌, onBlur 핸들러에서 시작
  };

  // --- 7. [신규] 포커스 이벤트 핸들러 (요구사항 1, 2) ---
  const handleSectionFocusGained = (sectionId) => {
    // 포커스를 얻으면, 8초 저장 타이머를 취소
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      if (dirtySectionId === sectionId) {
         setSaveStatus('unsaved'); // 'waiting' -> 'unsaved'로 복귀
      }
    }
  };

  const handleSectionFocusLost = (sectionId) => {
    // 포커스를 잃은 섹션이 'dirty' 상태일 때만 8초 타이머 시작
    if (dirtySectionId && dirtySectionId === sectionId) {
      setSaveStatus('waiting'); // '저장 대기 중' (UI 표시용)
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
    // ... (에러 UI)
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
  const basicInfo = portfolioData?.data?.data?.basicInfo; // 로드된 basicInfo

  return (
    <div className="portfolio-edit-page">
      {/* TempSideNav에 basicInfo와 sections를 모두 전달합니다.
        basicInfo가 로드되기 전(null)일 수 있으므로 TempSideNav에서 null 체크 필요
      */}
      <TempSideNav sections={sections} basicInfo={basicInfo} />

      <div className="portfolio-main-editor">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>포트폴리오</h2>
          {/* 8. [신규] 저장 상태 표시기 */}
          <SaveStatusIndicator status={isUpdating ? 'saving' : saveStatus} />
        </header>
        
        {/* basicInfo 폼 (병합 예정)
          <div id="section-basic-info" className="portfolio-section">
             ... (TextInput, NumberInput for name, major, gpa...)
          </div>
        */}

        <PortfolioEditor
          sections={sections}
          // 9. [신규] 핸들러 전달
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection}
          onAddSection={handleAddSection}
          onSectionFocusGained={handleSectionFocusGained}
          onSectionFocusLost={handleSectionFocusLost}
          // (isEditorBusy는 PortfolioEditor 내부에서 버튼 비활성화 등에 사용될 수 있음)
          disabled={isEditorBusy}
        />
      </div>
    </div>
  );
};

export default PortfolioEditPage;