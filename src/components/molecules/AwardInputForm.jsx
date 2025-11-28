import React, { useState } from 'react';
import { TextInput } from '../atoms'; 
import '../../styles/components/AwardInputForm.css';

const prizeOptions = [
  { value: '대상', label: '대상' },
  { value: '최우수상', label: '최우수상' },
  { value: '우수상', label: '우수상' },
  { value: '장려상', label: '장려상' },
  { value: '기타', label: '기타' },
];
const years = Array.from({ length: 15 }, (_, i) => (2025 - i).toString());
const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0'));

const AwardInputForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    prize: '',
    description: '',
    year: '',
    month: '',
  });

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleAdd = () => {
    if (!form.title || !form.prize || !form.year || !form.month)
      return alert('필수항목을 모두 입력하세요');
    onAdd(form);
    setForm({ title: '', prize: '', description: '', year: '', month: '' });
  };

  return (
    <div className="award-input-form">
      
      <TextInput
        label="대회명"
        value={form.title}
        onChange={(value) => handleChange('title', value)}
        required
        placeholder="대회명(직무와 관련 있는 것만 적어주세요.)"
      />
      
      <div className="input-wrapper">
        <div className="input-label-wrapper">
          <label className="input-label">결과</label>
        </div>
        <div className="input-container award-radio-options">
          {prizeOptions.map((opt) => (
            <label className="award-radio-btn" key={opt.value}>
              <input
                type="radio"
                name="prize"
                value={opt.value}
                checked={form.prize === opt.value}
                onChange={() => handleChange('prize', opt.value)}
                style={{ marginRight: 6 }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      
      <TextInput
        label="설명"
        value={form.description}
        onChange={(value) => handleChange('description', value)}
        placeholder="구체적인 내용을 적어주세요."
      />

      <div className="input-wrapper">
        <div className="input-label-wrapper">
          <label className="input-label">날짜</label>
        </div>
        <div className="input-container award-date-selects">
          <select
            className="award-select"
            value={form.year}
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="">연도</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            className="award-select"
            value={form.month}
            onChange={(e) => handleChange('month', e.target.value)}
          >
            <option value="">월</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="award-add-btn" type="button" onClick={handleAdd}>+ 추가하기</button>
    </div>
  );
};

export default AwardInputForm;