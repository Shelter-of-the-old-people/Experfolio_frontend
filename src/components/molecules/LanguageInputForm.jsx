import React, { useState } from 'react';
import TextInput from '../atoms/TextInput';
import Button from '../atoms/Button';
// 1. Award 폼의 CSS를 재사용하기 위해 임포트
import '../../styles/components/AwardInputForm.css';

const years = Array.from({ length: 15 }, (_, i) => (2025 - i).toString());
const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0'));

const LanguageInputForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    testName: '', score: '', year: '', month: '',
  });
  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const handleAdd = () => {
    if (!form.testName || !form.year || !form.month || !form.score) return alert('필수 입력');
    onAdd(form);
    setForm({ testName: '', score: '', year: '', month: '' });
  };

  return (
    // 2. 폼 클래스 이름을 Award 폼과 맞추어 CSS가 적용되도록 함
    <div className="award-input-form">
      
      {/* '시험명'은 이미 TextInput이라 OK */}
      <TextInput 
        label="시험명" 
        value={form.testName} 
        onChange={v => handleChange('testName', v)} 
        required 
      />

      {/* --- ▼ 3. '점수' 섹션 레이아웃 수정 --- */}
      <div className="input-wrapper">
        <div className="input-label-wrapper">
          <label className="input-label">점수</label>
        </div>
        <div className="input-container award-date-selects" style={{ gap: '8px' }}>
          <div style={{ width: '100px' }}> 
            <TextInput
              value={form.score}
              onChange={v => handleChange('score', v)}
              required
              style={{ width: '100%' }} 
            />
          </div>

          <span style={{ color: '#000' }}>점</span>
        </div>
      </div>
      
      {/* --- ▼ 4. '취득 연도' 섹션 레이아웃 수정 --- */}
      <div className="input-wrapper">
        <div className="input-label-wrapper">
          <label className="input-label">취득 연도</label>
        </div>
        <div className="input-container award-date-selects"> 
          <select 
            className="award-select" 
            value={form.year} 
            onChange={e => handleChange('year', e.target.value)}
          >
            <option value="">연도</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select 
            className="award-select" 
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
export default LanguageInputForm;