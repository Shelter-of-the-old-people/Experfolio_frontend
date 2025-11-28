import React, { useState } from 'react';
import TextInput from '../atoms/TextInput';
import Button from '../atoms/Button';
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
    <div className="award-input-form"> 
      <TextInput
        label="자격명"
        placeholder={"자격명"}
        value={form.name}
        onChange={v => handleChange('name', v)}
        required
      />
      
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

      <Button 
        className="award-add-btn"
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