import React from 'react'; // 1. useState 임포트 제거
import LanguageItemCard from '../molecules/LanguageItemCard';
import LanguageInputForm from '../molecules/LanguageInputForm';
// Award 폼 CSS를 임포트하여 섹션 스타일 재사용
import '../../styles/components/AwardInputForm.css';

// 2. props로 langs, onAdd, onDelete, onEdit 등을 받도록 수정
const LanguageListSection = ({ langs = [], onAdd, onDelete, onEdit = () => {} }) => {
  
  // 3. 내부 useState 제거
  // const [langs, setLangs] = useState([]);
  
  // 4. 핸들러가 부모(ProfileEditPage)가 넘겨준 props 함수를 호출
  const handleAdd = lang => onAdd(lang);
  const handleEdit = id => onEdit(id);
  const handleDelete = id => onDelete(id);
  
  return (
    // 1. Award 섹션과 동일한 래퍼 클래스 적용
    <div className="award-section">
      
      {/* 2. 목록 상단에 타이틀 추가 */}
      <div className='awards-list-section'>
        <h3 className="award-title">언어</h3>
        <div className="langs-list">
          {/* 5. props로 받은 langs를 렌더링 */}
          {langs.map(item => (
            <LanguageItemCard
              key={item.id}
              lang={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* 3. 입력 폼 상단에 헤더(타이틀+설명) 추가 */}
      <div className='award-input-section'>
        <div className="award-section-header">
          <span className="award-title">언어 능력</span>
          <span className="award-desc">언어 관련 시험 결과를 추가해주세요.</span>
        </div>
        {/* 6. onAdd 핸들러를 InputForm에 그대로 전달 */}
        <LanguageInputForm onAdd={handleAdd} />
      </div>

    </div>
  );
};
export default LanguageListSection;