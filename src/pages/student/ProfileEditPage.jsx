// shelter-of-the-old-people/experfolio_frontend/Experfolio_frontend--/src/pages/student/ProfileEditPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { 
  ProfileBasicInfoForm, 
  AwardListSection, 
  CertificateListSection, 
  LanguageListSection 
} from '../../components/organisms';
import { Button } from '../../components/atoms';
import { useApi, useLazyApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

// --- (데이터 매핑 헬퍼 함수들은 변경 없습니다) ---
const getIconByTypeOrUrl = (type, url) => {
 if (type === 'github' || (url && url.includes('github.com')))
  return <img src="/github.svg" alt="GitHub" />;
 if (type === 'notion' || (url && url.includes('notion.so')))
  return <img src="/notion.svg" alt="Notion" />;
 if (type === 'portfolio' || (url && url.includes('portfolio')))
   return <img src="/portfolio.svg" alt="Portfolio" />;
  return null; 
};
const mapApiToBasicInfoState = (apiBasicInfo) => {
  return {
    profileImage: null,
    name: apiBasicInfo.name || '',
    schoolName: apiBasicInfo.schoolName || '',
    major: apiBasicInfo.major || '',
    gpa: apiBasicInfo.gpa ? String(apiBasicInfo.gpa) : '',
    desiredJob: apiBasicInfo.desiredPosition || '',
    links: (apiBasicInfo.referenceUrl || []).map(url => ({
      url,
      label: new URL(url).hostname,
      icon: getIconByTypeOrUrl(null, url)
    }))
  };
};
const mapApiToAwardsState = (apiAwards) => {
  return (apiAwards || []).map((award, index) => ({
    id: `award-${index}`,
    title: award.awardName,
    prize: award.achievement,
    year: award.awardY || award.issueY,
    month: '',
    description: '',
  }));
};
const mapApiToCertsState = (apiCerts) => {
  return (apiCerts || []).map((cert, index) => ({
    id: `cert-${index}`,
    name: cert.certificationName,
    year: cert.issueY,
    month: '',
  }));
};
const mapApiToLangsState = (apiLangs) => {
  return (apiLangs || []).map((lang, index) => ({
    id: `lang-${index}`,
    testName: lang.testName,
    score: lang.score,
    year: lang.issueY,
    month: '',
  }));
};
// --- (변환 함수 끝) ---


const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  // --- (useState 훅들은 변경 없습니다) ---
  const [basicInfo, setBasicInfo] = useState({
    profileImage: null, name: '', schoolName: '', major: '', gpa: '', desiredJob: '', links: []
  });
  const [awards, setAwards] = useState([]);
  const [certs, setCerts] = useState([]);
  const [langs, setLangs] = useState([]);
  
  // --- (handleBasicInfoChange 핸들러는 변경 없습니다) ---
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  // --- (저장 API(useLazyApi)는 변경 없습니다) ---
  const { 
    execute: executeSave, 
    loading: saveLoading, 
    error: saveError      
  } = useLazyApi(
    (profileData) => 
    api.put('/portfolios/basic-info', profileData)
  );

  // --- (useApi 훅은 변경 없습니다) ---
  const fetchApi = useCallback(() => api.get('/portfolios/me'), []);
  const { 
    data: portfolioData, 
    loading: fetchLoading, 
    error: fetchError 
  } = useApi(fetchApi, []); 
  
  // --- (createInitialPortfolio 함수는 변경 없습니다) ---
  const createInitialPortfolio = async () => {
    try {
      const initialBasicInfo = {
        name: user?.name || "사용자", 
        schoolName: "", 
        major: "", 
        gpa: 0.0,
        desiredPosition: "", 
        referenceUrl: [], 
        awards: [], 
        certifications: [], 
        languages: []
      };
      
      const response = await api.post('/portfolios', initialBasicInfo); 
      
      if (response && response.data && response.data.basicInfo) {
        console.log('ProfileEditPage: 초기 프로필 생성 성공', response.data.basicInfo);
        const { basicInfo: apiBasicInfo } = response.data;
        setBasicInfo(mapApiToBasicInfoState(apiBasicInfo));
        setAwards(mapApiToAwardsState(apiBasicInfo.awards));
        setCerts(mapApiToCertsState(apiBasicInfo.certifications));
        setLangs(mapApiToLangsState(apiBasicInfo.languages));
      }
    } catch (createError) {
      console.error("ProfileEditPage: 초기 포트폴리오 생성 실패:", createError);
      alert("초기 프로필 생성에 실패했습니다. 페이지를 새로고침해주세요.");
    }
  };
  
  // 7. [수정] useEffect 데이터 로딩 훅
  useEffect(() => {
    if (portfolioData) {
      // (기존 성공 로직)
      if (portfolioData.data && typeof portfolioData.data === 'object') {
        const { basicInfo: apiBasicInfo } = portfolioData.data;
        if (apiBasicInfo) {
          console.log('ProfileEditPage: 데이터 로드 성공', apiBasicInfo);
          setBasicInfo(mapApiToBasicInfoState(apiBasicInfo));
          setAwards(mapApiToAwardsState(apiBasicInfo.awards));
          setCerts(mapApiToCertsState(apiBasicInfo.certifications));
          setLangs(mapApiToLangsState(apiBasicInfo.languages));
        } else {
          console.warn('ProfileEditPage: API는 성공했으나 basicInfo가 없습니다.');
        }
      } else if (portfolioData.data) {
         console.warn('ProfileEditPage: ngrok 경고 페이지가 수신되었습니다.', portfolioData.data);
      }
    } else if (fetchError) {
      // --- (핵심 수정 지점) ---
      // 'fetchError'는 'useApi' 훅에서 문자열로 설정됩니다.
      // '.message' 속성을 읽지 않고 'fetchError' 문자열 자체를 검사합니다.
      const errorMsg = fetchError || ''; 
      
      // 백엔드가 500 오류에도 "포트폴리오를 찾을 수 없습니다" 메시지를 보내는
      // 현재 상황(Constraint)에 맞춘 유일한 분기 처리입니다.
      if (errorMsg.includes('포트폴리오를 찾을 수 없습니다')) {
        console.log('ProfileEditPage: 404/500(Not Found) 감지. 초기 프로필 생성을 시도합니다.');
        createInitialPortfolio();
      } else {
        // "포트폴리오를 찾을 수 없습니다"가 아닌 다른 모든 오류 (e.g., "서버 오류가 발생했습니다.")
        console.error('ProfileEditPage: 데이터 로드 실패!', fetchError);
      }
    }
  }, [portfolioData, fetchError, user]); 
  
  
  // --- (handleSaveAll 핸들러는 변경 없습니다) ---
  const handleSaveAll = async () => {
    
    const requestBody = {
      name: basicInfo.name,
      schoolName: basicInfo.schoolName,
      major: basicInfo.major,
      gpa: parseFloat(basicInfo.gpa) || 0, 
      desiredPosition: basicInfo.desiredJob, 
      referenceUrl: basicInfo.links.map(link => link.url),
      awards: awards.map(award => ({
        awardName: award.title,
        achievement: award.prize,
        awardY: award.year
      })),
      certifications: certs.map(cert => ({
        certificationName: cert.name,
        issueY: cert.year
      })),
      languages: langs.map(lang => ({
        testName: lang.testName,
        score: lang.score,
        issueY: lang.year
      }))
    };
    
    console.log('백엔드로 전송할 최종 Request Body:', requestBody);
    
    try {
      const result = await executeSave(requestBody);
      console.log('저장 성공:', result);
      alert('프로필이 성공적으로 저장되었습니다.');
      
      navigate(routes.PORTFOLIO); 

    } catch (err) {
      console.error('저장 실패:', err);
      alert(`저장에 실패했습니다: ${err.message}`);
    }
  };
  
  // --- (로딩 스피너는 변경 없습니다) ---
  if (fetchLoading && !portfolioData && !fetchError) {
    return <div className="portfolio-page"><p>프로필 정보를 불러오는 중입니다...</p></div>;
  }
  
  // [수정] 404(포트폴리오 없음) 메시지를 제외한 실제 오류만 화면에 표시
  if (fetchError && !(fetchError || '').includes('포트폴리오를 찾을 수 없습니다')) {
     return <div className="portfolio-page" style={{ color: 'red' }}>
       <p>데이터 로드 중 오류가 발생했습니다: {fetchError}</p>
     </div>;
  }

  return (
    <div className="portfolio-page">
      <div className="portfolio-content">
        <ProfileBasicInfoForm 
          formData={basicInfo} 
          onFormChange={handleBasicInfoChange} 
        />
      </div>

      <AwardListSection
        awards={awards}
        onAdd={(newAward) => setAwards(prev => [...prev, { ...newAward, id: Date.now() }])}
        onDelete={(id) => setAwards(prev => prev.filter(a => a.id !== id))}
      />
      
      <CertificateListSection
        certs={certs}
        onAdd={(newCert) => setCerts(prev => [...prev, { ...newCert, id: Date.now() }])}
        onDelete={(id) => setCerts(prev => prev.filter(c => c.id !== id))}
      />
        
      <LanguageListSection
        langs={langs}
        onAdd={(newLang) => setLangs(prev => [...prev, { ...newLang, id: Date.now() }])}
        onDelete={(id) => setLangs(prev => prev.filter(l => l.id !== id))}
      />
        
      <div style={{ padding: '24px', maxWidth: '990px', margin: '24px auto 0' }}>
        <Button 
          variant="black" 
          size="full" 
          onClick={handleSaveAll}
          disabled={saveLoading}
        >
          {saveLoading ? '저장 중...' : '프로필 저장하기'}
        </Button>
        {saveError && <p style={{ color: 'red', marginTop: '10px' }}>{saveError.message || '저장 중 오류가 발생했습니다.'}</p>}
      </div>
    </div>
  );
};

export default ProfileEditPage;