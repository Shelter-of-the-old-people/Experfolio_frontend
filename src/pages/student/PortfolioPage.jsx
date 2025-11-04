import React, { useState, useEffect } from 'react';
import { MyProfileSummaryCard, ProfileCareerCards } from '../../components/organisms';
import { useLazyApi } from '../../hooks/useApi';
import api from '../../services/api';

const mapBasicInfoToProfile = (basicInfo) => {
  if (!basicInfo) return null;

  const github = basicInfo.referenceUrl.find(url => url.includes('github.com')) || null;
  const notion = basicInfo.referenceUrl.find(url => url.includes('notion.so')) || null;
  const portfolioLinks = basicInfo.referenceUrl
    .filter(url => !url.includes('github.com') && !url.includes('notion.so'))
    .map(url => ({
      url,
      label: new URL(url).hostname
    }));

  return {
    name: basicInfo.name,
    avatar: null,
    school: basicInfo.schoolName,
    major: basicInfo.major,
    gpa: basicInfo.gpa,
    wishJob: basicInfo.desiredPosition,
    wishArea: null,
    github,
    notion,
    portfolioLinks,
  };
};

const mapApiAwardsToCard = (apiAwards) => {
  return (apiAwards || []).map((award, index) => ({
    id: `award-${index}`,
    title: award.awardName,
    prize: award.achievement,
    year: award.issueY || award.awardY,
    month: '',
  }));
};

const mapApiCertsToCard = (apiCerts) => {
  return (apiCerts || []).map((cert, index) => ({
    id: `cert-${index}`,
    name: cert.certificationName,
    year: cert.issueY,
    month: '',
  }));
};

const mapApiLangsToCard = (apiLangs) => {
  return (apiLangs || []).map((lang, index) => ({
    id: `lang-${index}`,
    testName: lang.testName,
    score: lang.score,
    year: lang.issueY,
    month: '',
  }));
};

const PortfolioPage = () => {
  const [profile, setProfile] = useState(null);
  const [awards, setAwards] = useState([]);
  const [certs, setCerts] = useState([]);
  const [langs, setLangs] = useState([]);

  const { 
    data, loading, error, execute: fetchPortfolio
  } = useLazyApi(() => api.get('/portfolios/me'));

  useEffect(() => {
    console.log('PortfolioPage: /api/portfolios/me API 호출 시도...');
    
    fetchPortfolio()
      .catch(err => {
        console.error('PortfolioPage: 데이터 로드 실패!', err);
      });
      
  }, []);

  useEffect(() => {
    console.log('PortfolioPage: [data] useEffect 실행. 수신된 data 객체:', data);

    if (data && data.data) {
      // 정규화된 응답: data.data = { success, message, data, timestamp }
      const normalizedResponse = data.data;
      console.log('PortfolioPage: 정규화된 응답:', normalizedResponse);

      // 실제 포트폴리오 데이터는 data.data 안에
      const actualData = normalizedResponse.data;
      console.log('PortfolioPage: 실제 데이터:', actualData);

      if (actualData && actualData.basicInfo) {
        console.log('PortfolioPage: 데이터 로드 성공!', actualData.basicInfo);
        setProfile(mapBasicInfoToProfile(actualData.basicInfo));
        setAwards(mapApiAwardsToCard(actualData.basicInfo.awards));
        setCerts(mapApiCertsToCard(actualData.basicInfo.certifications));
        setLangs(mapApiLangsToCard(actualData.basicInfo.languages));
      } else {
        console.warn('PortfolioPage: basicInfo가 없습니다.');
      }
    }
  }, [data]);

  if (loading) {
    return <div className="portfolio-page"><p>데이터를 불러오는 중입니다...</p></div>;
  }

  if (error || !profile) {
    return (
      <div className="portfolio-page">
        {error && <p style={{ color: 'red' }}>오류가 발생했습니다: {error.message}</p>}
        <p>아직 등록된 포트폴리오가 없습니다. [프로필 수정] 페이지에서 작성해주세요.</p>
        <button 
          onClick={() => window.location.href = '/profile/edit'}
          style={{ 
            padding: '8px 12px', 
            background: '#1e1e1e', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          프로필 수정 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <MyProfileSummaryCard 
        profile={profile} 
        onEdit={() => {
          window.location.href = '/profile/edit';
        }}
      />
      <ProfileCareerCards
        awards={awards}
        certificates={certs}
        languages={langs}
      />
    </div>
  );
};

export default PortfolioPage;