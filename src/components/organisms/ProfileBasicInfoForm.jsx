import React from 'react'; 
import { ProfileImageUpload, TextInput, LinkCard } from '../atoms';
import { LinkInputSection } from '../molecules';
import '../../styles/components/ProfileBasicInfoForm.css';

const getIconByTypeOrUrl = (type, url) => {
 if (type === 'github' || (url && url.includes('github.com')))
  return <img src="/github.svg" alt="GitHub" />;
 if (type === 'notion' || (url && url.includes('notion.so')))
  return <img src="/notion.svg" alt="Notion" />;
 if (type === 'portfolio' || (url && url.includes('portfolio')))
   return <img src="/portfolio.svg" alt="Portfolio" />;
  return null; 
};

const ProfileBasicInfoForm = ({
  formData, 
  onFormChange, 
  disabled = false
}) => {
  const handleInputChange = (field, value) => {
    onFormChange(field, value);
  };

  const handleAddLink = async (url) => {
    try {
      const linkData = await fetchLinkMetadata(url); 
      onFormChange('links', [...formData.links, linkData]);
    } catch (error) {
      onFormChange('links', [...formData.links, {
        url,
        label: new URL(url).hostname,
        icon: getIconByTypeOrUrl(null, url)
      }]);
    }
  };

  const fetchLinkMetadata = async (url) => {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    let icon = getIconByTypeOrUrl(null, url); 
    let label = hostname;
    
    if (hostname.includes('github.com')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      label = pathParts[1] || 'Repository_Name';
    } else if (hostname.includes('notion')) {
      label = '페이지_이름';
    } else if (hostname.includes('velog')) {
      label = '페이지_이름';
    } else {
      label = '페이지_이름';
    }
    
    return { url, label, icon };
  };

  const handleRemoveLink = (index) => {
    onFormChange('links', formData.links.filter((_, i) => i !== index));
  };


  return (
    <div className="profile-basic-info-form">
      <span className='headline'>프로필</span>
      <form className="profile-content"> 
        <div className="profile-side">
          <ProfileImageUpload
            value={formData.profileImage} 
            onChange={(file) => handleInputChange('profileImage', file)}
            disabled={disabled}
          />
        </div>

        <div className="profile-main">
          <div className="profile-header">
            <span className="profile-title">프로필</span>
            <span className="profile-description">본인의 프로필 정보를 입력하세요.</span>
          </div>
          <div className="profile-form-section">
            <TextInput
              label="이름"
              value={formData.name} 
              onChange={(value) => handleInputChange('name', value)}
              placeholder="본인의 프로필에 표시될 이름(별칭)을 입력하세요."
              disabled={disabled}
              required
            />
            <TextInput
              label="학교명"
              value={formData.schoolName} 
              onChange={(value) => handleInputChange('schoolName', value)}
              placeholder="학교명"
              disabled={disabled}
            />
            <TextInput
              label="전공"
              value={formData.major} 
              onChange={(value) => handleInputChange('major', value)}
              placeholder="전공"
              disabled={disabled}
            />
            <TextInput
              label="성적"
              value={formData.gpa} 
              onChange={(value) => handleInputChange('gpa', value)}
              placeholder="성적"
              disabled={disabled}
            />
            <TextInput
              label="희망 직무"
              value={formData.desiredJob}
              onChange={(value) => handleInputChange('desiredJob', value)}
              placeholder="희망 직무"
              disabled={disabled}
            />
          </div>
          <div className="linkcard-section">
            {formData.links.length > 0 && (
              <div className="linkcard-list">
                {formData.links.map((link, index) => (
                  <LinkCard
                    key={index}
                    icon={link.icon}
                    label={link.label}
                    url={link.url}
                    onRemove={() => handleRemoveLink(index)}
                    disabled={disabled}
                  />
                ))}
              </div>
            )}
            <div className="add-link-row">
              <LinkInputSection
                onAdd={handleAddLink}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileBasicInfoForm;