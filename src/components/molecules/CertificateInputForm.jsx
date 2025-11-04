import React, { useState } from 'react';
import TextInput from '../atoms/TextInput';
import Button from '../atoms/Button';
// 1. Award 폼의 CSS를 재사용하기 위해 임포트
import '../../styles/components/AwardInputForm.css'; 

const years = Array.from({ length: 15 }, (_, i) => (2025 - i).toString());
const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0'));

const CertificateInputForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    year: '',
    month: '',
  });
  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const handleAdd = () => {
    if (!form.name || !form.year || !form.month) return alert('필수 입력');
    onAdd(form);
    setForm({ name: '', year: '', month: '' });
  };

  return (
    // 2. 폼 클래스 이름을 Award 폼과 맞추어 CSS가 적용되도록 함
    <div className="award-input-form"> 
      <TextInput
        label="자격명"
        placeholder={"자격명"}
        value={form.name}
        onChange={v => handleChange('name', v)}
        required
      />
      
      {/* --- ▼ 3. '취득 연도' 섹션 레이아웃 수정 --- */}
      <div className="input-wrapper">
        <div className="input-label-wrapper">
          <label className="input-label">취득 연도</label>
        </div>
        {/* Award 폼에서 만든 CSS 클래스를 재사용 */}
        <div className="input-container award-date-selects"> 
          <select 
            className="award-select" /* Award 폼 CSS 재사용 */
            value={form.year} 
            onChange={e => handleChange('year', e.target.value)}
          >
            <option value="">연도</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select 
            className="award-select" /* Award 폼 CSS 재사용 */
            value={form.month} 
            onChange={e => handleChange('month', e.target.value)}
          >
            <option value="">월</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      {/* --- ▲ 수정 끝 --- */}

      <Button 
        className="award-add-btn" /* Award 폼 CSS 재사용 */
        onClick={handleAdd} 
        size="default" 
        variant="black"
      >
        + 추가하기
      </Button>
    </div>
  );
};

export default CertificateInputForm;