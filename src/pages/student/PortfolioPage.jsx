// shelter-of-the-old-people/experfolio_frontend/Experfolio_frontend-kmh/src/pages/student/PortfolioPage.jsx

import React, { useState, useEffect } from 'react';
import { MyProfileSummaryCard, ProfileCareerCards } from '../../components/organisms';
import { useLazyApi } from '../../hooks/useApi'; // 1. useLazyApi 사용
import api from '../../services/api'; // 2. api 인스턴스

// --- 헬퍼 함수: API 응답 -> 컴포넌트 Props로 변환 ---

// API 응답(basicInfo)을 MyProfileSummaryCard의 props로 매핑
const mapBasicInfoToProfile = (basicInfo) => {
  if (!basicInfo) return null;

  // referenceUrl을 github, notion, 기타 링크로 분리
  const github = basicInfo.referenceUrl.find(url => url.includes('github.com')) || null;
  const notion = basicInfo.referenceUrl.find(url => url.includes('notion.so')) || null;
  const portfolioLinks = basicInfo.referenceUrl
    .filter(url => !url.includes('github.com') && !url.includes('notion.so'))
    .map(url => ({
      url,
      label: new URL(url).hostname // 간단하게 도메인을 라벨로 사용
    }));

  return {
    name: basicInfo.name,
    avatar: null, // (API 응답에 아바타가 없으므로 null)
    school: basicInfo.schoolName,     // (키 이름 매핑: schoolName -> school)
    major: basicInfo.major,
    gpa: basicInfo.gpa,
    wishJob: basicInfo.desiredPosition, // (키 이름 매핑: desiredPosition -> wishJob)
    wishArea: null, // (API 응답에 wishArea가 없으므로 null)
    github,
    notion,
    portfolioLinks,
  };
};

// API 응답(awards)을 AwardItemCard의 props로 매핑
const mapApiAwardsToCard = (apiAwards) => {
  return (apiAwards || []).map((award, index) => ({
    id: `award-${index}`, // (id가 없으므로 임시 id 생성)
    title: award.awardName,       // (키 이름 매핑: awardName -> title)
    prize: award.achievement,     // (키 이름 매핑: achievement -> prize)
    year: award.issueY || award.awardY, // (키 이름 매핑: issueY/awardY -> year)
    month: '', // (API 응답에 month가 없으므로 빈 값)
  }));
};

// API 응답(certifications)을 CertificateItemCard의 props로 매핑
const mapApiCertsToCard = (apiCerts) => {
  return (apiCerts || []).map((cert, index) => ({
    id: `cert-${index}`,
    name: cert.certificationName, // (키 이름 매핑: certificationName -> name)
    year: cert.issueY,
    month: '', // (API 응답에 month가 없으므로 빈 값)
  }));
};

// API 응답(languages)을 LanguageItemCard의 props로 매핑
const mapApiLangsToCard = (apiLangs) => {
  return (apiLangs || []).map((lang, index) => ({
    id: `lang-${index}`,
    testName: lang.testName, //
    score: lang.score, //
    year: lang.issueY,
    month: '', //
  }));
};

// --- 메인 컴포넌트 ---
const PortfolioPage = () => {
  // 3. 컴포넌트에 전달할 최종 데이터를 state로 관리
  const [profile, setProfile] = useState(null);
  const [awards, setAwards] = useState([]);
  const [certs, setCerts] = useState([]);
  const [langs, setLangs] = useState([]);

  // 4. API 호출 훅 (lazy = 수동 호출)
  const { 
    data, loading, error, execute: fetchPortfolio
  } = useLazyApi(() => api.get('/portfolios/me'));

  // 5. 페이지 로드 시 API를 1회 호출 (에러 핸들링 포함)
  useEffect(() => {
    console.log('PortfolioPage: /api/portfolios/me API 호출 시도...');
    
    fetchPortfolio()
      .catch(err => {
        // API 호출이 실패하면 (500, 401 등) 이 로그가 콘솔에 찍힙니다.
        console.error('PortfolioPage: 데이터 로드 실패!', err);
      });
      
  }, []); // 빈 배열 []: 마운트 시 1회만 실행

  // 6. API 응답(data)이 오면, state를 업데이트
  useEffect(() => {
    console.log('PortfolioPage: [data] useEffect 실행. 수신된 data 객체:', data);

    // ngrok 경고(HTML)가 아닌, 정상적인 JSON 응답인지 확인
    if (data && data.data && typeof data.data === 'object') {
      console.log('PortfolioPage: data.data 객체 확인:', data.data);

      const { basicInfo } = data.data; 
      console.log('PortfolioPage: basicInfo 객체 확인:', basicInfo);

      if (basicInfo) {
        // 데이터가 있으면 state에 저장
        console.log('PortfolioPage: 데이터 로드 성공! (basicInfo 확인)', basicInfo);
        setProfile(mapBasicInfoToProfile(basicInfo));
        setAwards(mapApiAwardsToCard(basicInfo.awards));
        setCerts(mapApiCertsToCard(basicInfo.certifications));
        setLangs(mapApiLangsToCard(basicInfo.languages));
      } else {
        // JSON은 왔으나 basicInfo가 없는 경우 (예: 진짜 빈 포트폴리오)
        console.warn('PortfolioPage: data.data는 있으나, basicInfo가 없습니다.');
      }
    } else if (data) {
      // ngrok 경고 페이지(HTML)가 수신된 경우
      console.warn('PortfolioPage: data 객체는 있으나, data.data가 JSON 객체가 아닙니다. (ngrok 경고 페이지일 수 있음)', data.data);
    }
  }, [data]); // data가 변경될 때마다 실행

  // 7. 로딩 상태 표시
  if (loading) {
    return <div className="portfolio-page"><p>데이터를 불러오는 중입니다...</p></div>;
  }

  // 8. API 에러 상태 또는 프로필 데이터가 없는 경우 (작성해달라"는 메시지)
  if (error || !profile) {
    return (
      <div className="portfolio-page">
        {error && <p style={{ color: 'red' }}>오류가 발생했습니다: {error.message}</p>}
        <p>아직 등록된 포트폴리오가 없습니다. [프로필 수정] 페이지에서 작성해주세요.</p>
        <button 
          onClick={() => window.location.href = '/profile/edit'}
          style={{ padding: '8px 12px', background: '#1e1e1e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          프로필 수정 페이지로 이동
        </button>
      </div>
    );
  }

  // 9. 데이터가 성공적으로 로드된 경우
  return (
    <div className="portfolio-page">
      <MyProfileSummaryCard 
        profile={profile} 
        onEdit={() => {
          // '수정' 버튼 클릭 시 /profile/edit 페이지로 이동
          window.location.href = '/profile/edit';
        }}
      />
      <ProfileCareerCards
        awards={awards}
        certificates={certs}
        languages={langs}
      />
      
      {/* (추후 포트폴리오 항목(portfolioItems) 렌더링 부분 추가) */}
    </div>
  );
};

export default PortfolioPage;