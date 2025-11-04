import React, { useState } from 'react'; // 1. useState 임포트
import { 
  ProfileBasicInfoForm, 
  AwardListSection, 
  CertificateListSection, 
  LanguageListSection 
} from '../../components/organisms';
import { Button } from '../../components/atoms'; // 2. Button 임포트
import { useLazyApi } from '../../hooks/useApi'; // 3. API 훅 임포트
import api from '../../services/api'; // 4. api 인스턴스 임포트

const ProfileEditPage = () => {
  // 5. 모든 프로필 데이터를 이 페이지에서 통합 관리합니다.
  const [basicInfo, setBasicInfo] = useState({
    profileImage: null,
    name: '',
    schoolName: '',
    major: '',
    gpa: '',
    desiredJob: '', // (내부 상태 이름)
    links: []       // (내부 상태 이름)
  });
  const [awards, setAwards] = useState([]);
  const [certs, setCerts] = useState([]);
  const [langs, setLangs] = useState([]);
  
  // 6. ProfileBasicInfoForm을 위한 실시간 업데이트 핸들러
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 7. 백엔드 전송을 위한 API 훅 (엔드포인트: PUT /api/portfolios/basic-info)
  const { execute: updateProfile, loading, error } = useLazyApi(
    (profileData) => api.put('/portfolios/basic-info', profileData)
    //(profileData) => api.post('/portfolios', profileData) 
  );

  // 8. 메인 저장 핸들러
  const handleSaveAll = async () => {
    
    // 9. API Request Body 명세에 맞게 데이터 매핑
    const requestBody = {
      // Basic Info
      name: basicInfo.name,
      schoolName: basicInfo.schoolName,
      major: basicInfo.major,
      gpa: parseFloat(basicInfo.gpa) || 0, // API가 숫자를 기대
      desiredPosition: basicInfo.desiredJob, // (키 이름 매핑: desiredJob -> desiredPosition)
      referenceUrl: basicInfo.links.map(link => link.url),

      // Awards
      awards: awards.map(award => ({
        awardName: award.title,       // (title -> awardName)
        achievement: award.prize,     // (prize -> achievement)
        awardY: award.year            // (year -> awardY)
      })),

      // Certifications
      certifications: certs.map(cert => ({
        certificationName: cert.name, // (name -> certificationName)
        issueY: cert.year             // (year -> issueY)
      })),

      // Languages
      languages: langs.map(lang => ({
        testName: lang.testName,
        score: lang.score,
        issueY: lang.year             // (year -> issueY)
      }))
    };
    
    console.log('백엔드로 전송할 최종 Request Body:', requestBody);
    
    try {
      // 10. API 호출
      const result = await updateProfile(requestBody);
      console.log('저장 성공:', result);
      alert('프로필이 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('저장 실패:', err);
      alert(`저장에 실패했습니다: ${err.message}`);
    }
  };
  
  // (기존 isFavorite, handleSubmit 등은 제거)

  return (
    <div className="portfolio-page">
      <div className="portfolio-content">
        {/* 11. ProfileBasicInfoForm에 state와 핸들러를 props로 전달 */}
        <ProfileBasicInfoForm 
          formData={basicInfo} 
          onFormChange={handleBasicInfoChange} 
        />
      </div>

      {/* 12. AwardListSection에 state와 핸들러를 props로 전달 */}
      <AwardListSection
        awards={awards}
        onAdd={(newAward) => setAwards(prev => [...prev, { ...newAward, id: Date.now() }])}
        onDelete={(id) => setAwards(prev => prev.filter(a => a.id !== id))}
      />
      
      {/* 13. CertificateListSection에 state와 핸들러를 props로 전달 */}
      <CertificateListSection
        certs={certs}
        onAdd={(newCert) => setCerts(prev => [...prev, { ...newCert, id: Date.now() }])}
        onDelete={(id) => setCerts(prev => prev.filter(c => c.id !== id))}
      />
        
      {/* 14. LanguageListSection에 state와 핸들러를 props로 전달 */}
      <LanguageListSection
        langs={langs}
        onAdd={(newLang) => setLangs(prev => [...prev, { ...newLang, id: Date.now() }])}
        onDelete={(id) => setLangs(prev => prev.filter(l => l.id !== id))}
      />
        
      {/* 15. 페이지 하단에 저장 버튼 추가 */}
      <div style={{ padding: '24px', maxWidth: '990px', margin: '24px auto 0' }}>
        <Button 
          variant="black" 
          size="full" 
          onClick={handleSaveAll}
          disabled={loading} // API 호출 중 비활성화
        >
          {loading ? '저장 중...' : '프로필 저장하기'}
        </Button>
        {/* API 에러 메시지 표시 */}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error.message || '저장 중 오류가 발생했습니다.'}</p>}
      </div>
    </div>
  );
};

export default ProfileEditPage;