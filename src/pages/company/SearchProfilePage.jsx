import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ProfileSummaryCard from '../../components/organisms/ProfileSummaryCard'; 
import { ProfileCareerCards } from '../../components/organisms';
import { PortfolioSectionViewer } from '../../components/molecules';
import SearchResultsSidebar from '../../components/organisms/SearchResultsSidebar';
import api from '../../services/api';
import { useApi } from '../../hooks/useApi';
import useSearchStore from '../../stores/useSearchStore';
import useFavoriteStore from '../../stores/useFavoriteStore';
import { routes } from '../../routes';
import '../../styles/pages/SearchProfilePage.css';

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
  const { id } = useParams(); // id === jobSeekerId
  const navigate = useNavigate();
  const location = useLocation();
  
  const { lastQuery } = useSearchStore();
  // [추가] 즐겨찾기 스토어 함수 사용
  const { addFavorite, removeFavorite, checkIsFavorite } = useFavoriteStore();
  
  const [profile, setProfile] = useState(null);
  const [awards, setAwards] = useState([]);
  const [certs, setCerts] = useState([]);
  const [langs, setLangs] = useState([]);
  const [items, setItems] = useState([]); 
  const [isFavorite, setIsFavorite] = useState(false);
  const searchKeywords = location.state?.searchKeywords || [];

  const fetchPortfolio = useCallback(() => api.get(`/portfolios/${id}`), [id]);
  
  const { 
    data, 
    loading, 
    error 
  } = useApi(fetchPortfolio, [fetchPortfolio]);

  // 1. 포트폴리오 데이터 로드
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

  // 2. [추가] 페이지 진입 시 해당 구직자가 즐겨찾기 되어있는지 확인
  useEffect(() => {
    const checkStatus = async () => {
      if (id) {
        const exists = await checkIsFavorite(id);
        setIsFavorite(exists);
      }
    };
    checkStatus();
  }, [id, checkIsFavorite]);

  const handleClose = () => {
    if (lastQuery) {
      navigate(`${routes.SEARCH_RESULTS}?q=${encodeURIComponent(lastQuery)}`);
    } else {
      navigate(routes.SEARCH);
    }
  };

  const handleContact = () => {
    if (profile?.email) {
      window.location.href = `mailto:${profile.email}`;
    } else {
      alert('등록된 이메일 정보가 없습니다.');
    }
  };

  // 3. [수정] 즐겨찾기 토글 핸들러 (실제 API 연동)
  const handleToggleFavorite = async () => {
    // 낙관적 업데이트 (UI 먼저 반영)
    const previousState = isFavorite;
    const newState = !isFavorite;
    setIsFavorite(newState);

    try {
      if (newState) {
        // 추가: POST /api/v1/favorites
        await addFavorite(id);
      } else {
        // 삭제: DELETE /api/v1/favorites/{id}
        await removeFavorite(id);
      }
    } catch (err) {
      // 실패 시 롤백 및 알림
      console.error('즐겨찾기 변경 실패:', err);
      setIsFavorite(previousState);
      alert('즐겨찾기 설정 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="search-profile-loading">
        <p>프로필 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-profile-error">
        <p>프로필을 불러오는데 실패했습니다.</p>
        <p className="error-message">{error}</p>
        <button onClick={handleClose} className="back-button">

          돌아가기
        </button>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="search-profile-page-container">
      <div className="profile-main-content">
        <ProfileSummaryCard
          profile={{
            ...profile,
            keywords: searchKeywords 
          }}
          onClose={handleClose}
          isFavorite={isFavorite}
          onContact={handleContact}
          onToggleFavorite={handleToggleFavorite}
        />

        <div className="profile-career-section">
          <ProfileCareerCards
            awards={awards}
            certificates={certs}
            languages={langs}
          />
        </div>
        
        {items.length > 0 && (
          <div className="portfolio-sections-container">
            <h3 className="portfolio-sections-divider">포트폴리오 상세</h3>
            {items.map((item) => (
              <PortfolioSectionViewer 
                key={item.id || item.order} 
                item={item} 
              />
            ))}
          </div>
        )}
      </div>

      <SearchResultsSidebar currentUserId={id} />
    </div>
  );
};

export default SearchProfilePage;