import React, { useState, useEffect } from 'react';
import { ProfileImageUpload, TextInput, LinkCard } from '../atoms';
import { LinkInputSection } from '../molecules';
import '../../styles/components/ProfileBasicInfoForm.css';

const ProfileBasicInfoForm = ({
  initialData = {},
  onSubmit,
  disabled = false
}) => {
  const [formData, setFormData] = useState({
    profileImage: null,
    name: '',
    schoolName: '',
    major: '',
    gpa: '',
    desiredJob: '',
    links: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLink = async (url) => {
    try {
      const linkData = await fetchLinkMetadata(url);
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, linkData]
      }));
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, {
          url,
          label: new URL(url).hostname,
          icon: null
        }]
      }));
    }
  };

  const fetchLinkMetadata = async (url) => {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    let icon = null;
    let label = hostname;
    if (hostname.includes('github.com')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      label = pathParts[1] || 'Repository_Name';
      icon = '🔗';
    } else if (hostname.includes('notion')) {
      label = '페이지_이름';
      icon = '📄';
    } else if (hostname.includes('velog')) {
      label = '페이지_이름';
      icon = '✍️';
    } else {
      label = '페이지_이름';
      icon = '🔗';
    }
    return { url, label, icon };
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="profile-basic-info-form">
      <span className='headline'>프로필</span>
    <form className="profile-content" onSubmit={handleSubmit}>
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
