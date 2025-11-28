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

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [basicInfo, setBasicInfo] = useState({
    profileImage: null, 
    name: '', 
    schoolName: '', 
    major: '', 
    gpa: '', 
    desiredJob: '', 
    links: []
  });
  const [awards, setAwards] = useState([]);
  const [certs, setCerts] = useState([]);
  const [langs, setLangs] = useState([]);
  
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const { 
    execute: executeSave, 
    loading: saveLoading, 
    error: saveError      
  } = useLazyApi(
    (profileData) => api.put('/portfolios/basic-info', profileData)
  );

  const fetchApi = useCallback(() => api.get('/portfolios/me'), []);
  const { 
    data: portfolioData, 
    loading: fetchLoading, 
    error: fetchError 
  } = useApi(fetchApi, []); 
  
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
      
      const actualData = response.data.data;
      
      if (actualData && actualData.basicInfo) {
        console.log('ProfileEditPage: 초기 프로필 생성 성공', actualData.basicInfo);
        const { basicInfo: apiBasicInfo } = actualData;
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
  
  useEffect(() => {
    if (portfolioData) {
      const normalizedResponse = portfolioData.data;
      
      const actualData = normalizedResponse.data;
      
      if (actualData && actualData.basicInfo) {
        console.log('ProfileEditPage: 데이터 로드 성공', actualData.basicInfo);
        const { basicInfo: apiBasicInfo } = actualData;
        setBasicInfo(mapApiToBasicInfoState(apiBasicInfo));
        setAwards(mapApiToAwardsState(apiBasicInfo.awards));
        setCerts(mapApiToCertsState(apiBasicInfo.certifications));
        setLangs(mapApiToLangsState(apiBasicInfo.languages));
      } else {
        console.warn('ProfileEditPage: API는 성공했으나 basicInfo가 없습니다.');
      }
    } else if (fetchError) {
      const errorMsg = fetchError || '';
      
      if (errorMsg.includes('포트폴리오를 찾을 수 없습니다')) {
        console.log('ProfileEditPage: 404 감지. 초기 프로필 생성을 시도합니다.');
        createInitialPortfolio();
      } else {
        console.error('ProfileEditPage: 데이터 로드 실패!', fetchError);
      }
    }
  }, [portfolioData, fetchError, user]); 
  
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
  
  if (fetchLoading && !portfolioData && !fetchError) {
    return <div className="portfolio-page"><p>프로필 정보를 불러오는 중입니다...</p></div>;
  }
  
  if (fetchError && !(fetchError || '').includes('포트폴리오를 찾을 수 없습니다')) {
    return (
      <div className="portfolio-page">
        <p style={{ color: 'red' }}>오류가 발생했습니다: {fetchError}</p>
      </div>
    );
  }
  
return (
  <div className="profile-edit-page">
    
    <div id="profile-section">
      <ProfileBasicInfoForm 
        formData={basicInfo}
        onFormChange={handleBasicInfoChange}
      />
    </div>
    
    <div id="awards-section">
      <AwardListSection 
        awards={awards}
        onAdd={(newAward) => {
          setAwards(prev => [...prev, { 
            ...newAward, 
            id: `award-${Date.now()}`
          }]);
        }}
        onDelete={(id) => {
          setAwards(prev => prev.filter(award => award.id !== id));
        }}
      />
    </div>
    
    <div id="certifications-section">
      <CertificateListSection 
        certs={certs}
        onAdd={(newCert) => {
          setCerts(prev => [...prev, { 
            ...newCert, 
            id: `cert-${Date.now()}`
          }]);
        }}
        onDelete={(id) => {
          setCerts(prev => prev.filter(cert => cert.id !== id));
        }}
      />
    </div>
    
    <div id="languages-section">
      <LanguageListSection 
        langs={langs}
        onAdd={(newLang) => {
          setLangs(prev => [...prev, { 
            ...newLang, 
            id: `lang-${Date.now()}`
          }]);
        }}
        onDelete={(id) => {
          setLangs(prev => prev.filter(lang => lang.id !== id));
        }}
      />
    </div>
    
    <div>
      <Button 
        variant="black" 
        size="default"
        onClick={handleSaveAll}
        disabled={saveLoading}
      >
        {saveLoading ? '저장 중...' : '전체 저장'}
      </Button>
      
      {saveError && (
        <p style={{ color: 'red', marginTop: '8px' }}>
          저장 실패: {saveError}
        </p>
      )}
    </div>
  </div>
);
};

export default ProfileEditPage;