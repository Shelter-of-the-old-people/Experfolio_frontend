import React from 'react';
import AwardItemCard from '../molecules/AwardItemCard';
import CertificateItemCard from '../molecules/CertificateItemCard';
import LanguageItemCard from '../molecules/LanguageItemCard';
import '../../styles/components/ProfileCareerCards.css';

const ProfileCareerCards = ({ awards, certificates, languages }) => (
  <div className="career-main-flex">
    <div className="career-col">
      <div className="career-title">수상경력</div>
      {awards.map((award, i) =>
        <AwardItemCard key={award.id} award={award} />
      )}
    </div>
    <div className="career-col">
      <div className="career-title">자격증</div>
      {certificates.map((cert, i) =>
        <CertificateItemCard key={cert.id} cert={cert} />
      )}
    </div>
    <div className="career-col">
      <div className="career-title">언어</div>
      {languages.map((lang, i) =>
        <LanguageItemCard key={lang.id} lang={lang} />
      )}
    </div>
  </div>
);


export default ProfileCareerCards;
