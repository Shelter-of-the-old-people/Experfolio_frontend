import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileSummaryCard from '../../components/organisms/ProfileSummaryCard'; 
import { ProfileCareerCards } from '../../components/organisms';
import api from '../../services/api';
import { useApi } from '../../hooks/useApi';

const viewerStyles = {
  container: {
    width: '900px',
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom:"200px"
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: '32px',
    border: '1px solid #eee'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1a1a1a',
    fontFamily: 'Pretendard Variable'
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-wrap',
    fontFamily: 'Pretendard Variable'
  },
  divider: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#000'
  }
};

const PortfolioSectionViewer = ({ item }) => {
  return (
    <div style={viewerStyles.sectionCard}>
      <h4 style={viewerStyles.title}>{item.title}</h4>
      <div style={viewerStyles.content}>
        {item.content}
      </div>
      {item.attachments && item.attachments.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>📎 첨부파일 {item.attachments.length}개</p>
        </div>
      )}
    </div>
  );
};

const getIconByTypeOrUrl = (type, url) => {
  if (type === 'github' || (url && url.includes('github.com')))
    return <img src="/github.svg" alt="GitHub" />;
  if (type === 'notion' || (url && url.includes('notion.so')))
    return <img src="/notion.svg" alt="Notion" />;
  if (type === 'portfolio' || (url && url.includes('portfolio')))
    return <img src="/portfolio.svg" alt="Portfolio" />;
  return null;
};

const mapBasicInfoToProfile = (basicInfo) => {
  if (!basicInfo) return null;

  const github = basicInfo.referenceUrl?.find(url => url.includes('github.com')) || null;
  const notion = basicInfo.referenceUrl?.find(url => url.includes('notion.so')) || null;
  const portfolioLinks = (basicInfo.referenceUrl || [])
    .filter(url => !url.includes('github.com') && !url.includes('notion.so'))
    .map(url => ({
      url,
      label: new URL(url).hostname,
      icon: getIconByTypeOrUrl(null, url)
    }));

  return {
    name: basicInfo.name,
    avatar: null, 
    school: basicInfo.schoolName,
    major: basicInfo.major,
    gpa: basicInfo.gpa,
    wishJob: basicInfo.desiredPosition,
    wishArea: null,
    keywords: basicInfo.keywords || [], 
    github,
    notion,
    portfolioLinks,
    email: basicInfo.email,
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

const SearchProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [awards, setAwards] = useState([]);
  const [certs, setCerts] = useState([]);
  const [langs, setLangs] = useState([]);
  
  const [items, setItems] = useState([]); 
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchPortfolio = useCallback(() => api.get(`/portfolios/${id}`), [id]);
  
  const { 
    data, 
    loading, 
    error 
  } = useApi(fetchPortfolio, [fetchPortfolio]);

  useEffect(() => {
    if (data) {
      const normalizedResponse = data.data; 
      const portfolioData = normalizedResponse.data; 
      
      if (portfolioData) {
        if (portfolioData.basicInfo) {
          const { basicInfo } = portfolioData;
          setProfile(mapBasicInfoToProfile(basicInfo));
          setAwards(mapApiAwardsToCard(basicInfo.awards));
          setCerts(mapApiCertsToCard(basicInfo.certifications));
          setLangs(mapApiLangsToCard(basicInfo.languages));
        }

        if (portfolioData.portfolioItems) {
          const sortedItems = [...portfolioData.portfolioItems].sort((a, b) => a.order - b.order);
          setItems(sortedItems);
        }
      }
    }
  }, [data]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleContact = () => {
    if (profile?.email) {
      window.location.href = `mailto:${profile.email}`;
    } else {
      alert('등록된 이메일 정보가 없습니다.');
    }
  };

  const handleToggleFavorite = async () => {
    const newState = !isFavorite;
    setIsFavorite(newState);

    try {
      if (newState) {
        await api.post(`/bookmarks/${id}`);
      } else {
        await api.delete(`/bookmarks/${id}`);
      }
    } catch (err) {
      console.error('즐겨찾기 변경 실패:', err);
      setIsFavorite(!newState);
      alert('즐겨찾기 설정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>프로필 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-error)' }}>
        <p>프로필을 불러오는데 실패했습니다.</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>{error}</p>
        <button 
          onClick={handleClose}
          style={{ marginTop: '20px', padding: '8px 16px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          돌아가기
        </button>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="search-profile-page" >
      <ProfileSummaryCard
        profile={profile}
        onClose={handleClose}
        isFavorite={isFavorite}
        onContact={handleContact}
        onToggleFavorite={handleToggleFavorite}
      />

      <div style={{ marginTop: '24px' }}>
        <ProfileCareerCards
          awards={awards}
          certificates={certs}
          languages={langs}
        />
      </div>
      
      {items.length > 0 && (
        <div style={viewerStyles.container}>
          <h3 style={viewerStyles.divider}>포트폴리오 상세</h3>
          {items.map((item) => (
            <PortfolioSectionViewer 
              key={item.id || item.order} 
              item={item} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProfilePage;