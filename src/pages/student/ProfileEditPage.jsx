// shelter-of-the-old-people/experfolio_frontend/Experfolio_frontend-kmh/src/pages/student/ProfileEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 임포트
import { routes } from '../../routes'; // 2. routes 임포트
import { 
  ProfileBasicInfoForm, 
  AwardListSection, 
  CertificateListSection, 
  LanguageListSection 
} from '../../components/organisms';
import { Button } from '../../components/atoms';
import { useLazyApi } from '../../hooks/useApi'; 
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
    profileImage: null, // (API에 프로필 이미지 없으므로 null)
    name: apiBasicInfo.name || '',
    schoolName: apiBasicInfo.schoolName || '',
    major: apiBasicInfo.major || '',
    gpa: apiBasicInfo.gpa ? String(apiBasicInfo.gpa) : '', // 숫자를 문자열로 변환
    desiredJob: apiBasicInfo.desiredPosition || '', // (키 이름 매핑: desiredPosition -> desiredJob)
    links: (apiBasicInfo.referenceUrl || []).map(url => ({
      url,
      label: new URL(url).hostname, // 간단히 도메인을 라벨로
      icon: getIconByTypeOrUrl(null, url)
    }))
  };
};
const mapApiToAwardsState = (apiAwards) => {
  return (apiAwards || []).map((award, index) => ({
    id: `award-${index}`, // (임시 ID)
    title: award.awardName,       // (키 매핑: awardName -> title)
    prize: award.achievement,     // (키 매핑: achievement -> prize)
    year: award.awardY || award.issueY, // (키 매핑: awardY/issueY -> year)
    month: '', // (API에 month가 없으므로 빈 값)
    description: '', // (API에 description이 없으므로 빈 값)
  }));
};
const mapApiToCertsState = (apiCerts) => {
  return (apiCerts || []).map((cert, index) => ({
    id: `cert-${index}`, // (임시 ID)
    name: cert.certificationName, // (키 매핑: certificationName -> name)
    year: cert.issueY,
    month: '', // (API에 month가 없으므로 빈 값)
  }));
};
const mapApiToLangsState = (apiLangs) => {
  return (apiLangs || []).map((lang, index) => ({
    id: `lang-${index}`, // (임시 ID)
    testName: lang.testName,
    score: lang.score,
    year: lang.issueY,
    month: '', // (API에 month가 없으므로 빈 값)
  }));
};
// --- (변환 함수 끝) ---


const ProfileEditPage = () => {
  const navigate = useNavigate(); // 3. navigate 함수 생성

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

  // --- (API 호출 로직(useLazyApi)은 변경 없습니다) ---
  const { 
    execute: executeSave, 
    loading: saveLoading, 
    error: saveError      
  } = useLazyApi(
    (profileData) => 
        //api.post('/portfolios', profileData) 
    api.put('/portfolios/basic-info', profileData)
  );
  const { 
    execute: fetchPortfolio, 
    loading: fetchLoading 
  } = useLazyApi(() => api.get('/portfolios/me'));
  
  // --- (useEffect 데이터 로딩 훅은 변경 없습니다) ---
  useEffect(() => {
    fetchPortfolio()
      .then(response => {
        if (response && response.data && typeof response.data === 'object') {
          const { basicInfo: apiBasicInfo } = response.data;
          if (apiBasicInfo) {
            console.log('ProfileEditPage: 데이터 로드 성공', apiBasicInfo);
            setBasicInfo(mapApiToBasicInfoState(apiBasicInfo));
            setAwards(mapApiToAwardsState(apiBasicInfo.awards));
            setCerts(mapApiToCertsState(apiBasicInfo.certifications));
            setLangs(mapApiToLangsState(apiBasicInfo.languages));
          } else {
            console.warn('ProfileEditPage: API는 성공했으나 basicInfo가 없습니다.');
          }
        } else if (response && response.data) {
           console.warn('ProfileEditPage: ngrok 경고 페이지가 수신되었습니다.', response.data);
        }
      })
      .catch(err => {
        console.error('ProfileEditPage: 데이터 로드 실패!', err);
      });
  }, []); 
  
  // 9. (수정) 저장 핸들러
  const handleSaveAll = async () => {
    
    // --- (requestBody 생성 로직은 변경 없습니다) ---
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
      
      // --- ▼ 4. (핵심) 저장 성공 후 포트폴리오 페이지로 이동 ---
      navigate(routes.PORTFOLIO); 
      // --- ▲ 수정 완료 ▲ ---

    } catch (err) {
      console.error('저장 실패:', err);
      alert(`저장에 실패했습니다: ${err.message}`);
    }
  };
  
  // --- (로딩 스피너 및 return 문은 변경 없습니다) ---
  if (fetchLoading) {
    return <div className="portfolio-page"><p>프로필 정보를 불러오는 중입니다...</p></div>;
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