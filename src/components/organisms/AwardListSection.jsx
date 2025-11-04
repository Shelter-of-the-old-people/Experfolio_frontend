import React from 'react'; // 1. useState 임포트 제거
import AwardInputForm from '../molecules/AwardInputForm';
import AwardItemCard from '../molecules/AwardItemCard';
import '../../styles/components/AwardInputForm.css';

// 2. props로 awards, onAdd, onDelete, onEdit 등을 받도록 수정
const AwardListSection = ({ awards = [], onAdd, onDelete, onEdit = () => {} }) => {
  
  // 3. 내부 useState 제거
  // const [awards, setAwards] = useState([]);

  // 4. 핸들러가 내부 state 대신 부모(ProfileEditPage)가 넘겨준 props 함수를 호출
  const handleAdd = (award) => onAdd(award); 
  const handleDelete = (id) => onDelete(id);
  const handleEdit = (id) => onEdit(id);

  return (
    <div className="award-section">
      
      <div className='awards-list-section'>
        <h3 className="award-title">수상경력</h3>
        <div className="awards-list">
          {/* 5. props로 받은 awards를 렌더링 */}
          {awards.map(item => (
            <AwardItemCard
              key={item.id}
              award={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <div className='award-input-section'>
        <div className="award-section-header">
          <span className="award-title">수상경력</span>
          <span className="award-desc">수상경력을 추가해주세요.</span>
        </div>
        {/* 6. onAdd 핸들러를 InputForm에 그대로 전달 */}
        <AwardInputForm onAdd={handleAdd} />
      </div>

    </div>
  );
};

export default AwardListSection;