import React from 'react'; // 1. useState, useEffect 임포트 제거
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
  // 2. Props 변경: initialData/onSubmit -> formData/onFormChange
  formData, 
  onFormChange, 
  disabled = false
}) => {
  // 4. 핸들러가 내부 setFormData 대신 부모의 onFormChange를 호출하도록 수정
  const handleInputChange = (field, value) => {
    onFormChange(field, value); // 부모의 state 업데이트
  };

  const handleAddLink = async (url) => {
    try {
      const linkData = await fetchLinkMetadata(url); 
      // 5. 부모의 'links' 배열을 업데이트
      onFormChange('links', [...formData.links, linkData]);
    } catch (error) {
      onFormChange('links', [...formData.links, {
        url,
        label: new URL(url).hostname,
        icon: getIconByTypeOrUrl(null, url)
      }]);
    }
  };

  // ... (fetchLinkMetadata 함수는 동일) ...
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
    // 6. 부모의 'links' 배열을 업데이트
    onFormChange('links', formData.links.filter((_, i) => i !== index));
  };

  // 7. 내부 handleSubmit 함수 제거 (저장 버튼은 부모에 있음)
  // const handleSubmit = (e) => { ... };

  return (
    <div className="profile-basic-info-form">
      <span className='headline'>프로필</span>
      {/* 8. <form> 태그에서 onSubmit 제거 */}
      <form className="profile-content"> 
        <div className="profile-side">
          <ProfileImageUpload
            // 9. value가 내부 state가 아닌 props.formData를 바라보도록 수정
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
              value={formData.name} // 9. props.formData 사용
              onChange={(value) => handleInputChange('name', value)}
              placeholder="본인의 프로필에 표시될 이름(별칭)을 입력하세요."
              disabled={disabled}
              required
            />
            <TextInput
              label="학교명"
              value={formData.schoolName} // 9. props.formData 사용
              onChange={(value) => handleInputChange('schoolName', value)}
              placeholder="학교명"
              disabled={disabled}
            />
            <TextInput
              label="전공"
              value={formData.major} // 9. props.formData 사용
              onChange={(value) => handleInputChange('major', value)}
              placeholder="전공"
              disabled={disabled}
            />
            <TextInput
              label="성적"
              value={formData.gpa} // 9. props.formData 사용
              onChange={(value) => handleInputChange('gpa', value)}
              placeholder="성적"
              disabled={disabled}
            />
            <TextInput
              label="희망 직무"
              value={formData.desiredJob} // 9. props.formData 사용
              onChange={(value) => handleInputChange('desiredJob', value)}
              placeholder="희망 직무"
              disabled={disabled}
            />
          </div>
          <div className="linkcard-section">
            {/* 9. formData.links도 props에서 옴 */}
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