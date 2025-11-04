import React, {useState} from 'react';
import { ProfileBasicInfoForm, AwardListSection, CertificateListSection, LanguageListSection, ProfileCareerCards, MyProfileSummaryCard } from '../../components/organisms';
import ProfileSummaryCard from '../../components/organisms/ProfileSummaryCard';

const ProfileEditPage = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // TODO: API 호출 등 추가 로직 구현
  };
  // 3. 즐겨찾기 상태를 토글하는 핸들러 함수를 만듭니다.
  const handleToggleFavorite = () => {
    setIsFavorite(prev => !prev);
    // (추후 API로 이 상태를 서버에 저장하는 로직 추가)
  };

  return (
    <div className="portfolio-page">
      <div className="portfolio-content">
        <ProfileBasicInfoForm onSubmit={handleSubmit} />
      </div>
      <AwardListSection />
      <div>
        <CertificateListSection />
        </div>
        <LanguageListSection />
        
    </div>
  );
};

export default ProfileEditPage;