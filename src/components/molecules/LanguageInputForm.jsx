import React, { useState } from 'react';
import TextInput from '../atoms/TextInput';
import Button from '../atoms/Button';

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
    <div className="language-input-form">
      <TextInput label="시험명" value={form.testName} onChange={v => handleChange('testName', v)} required />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '14px' }}>
        <TextInput
          label="점수"
          value={form.score}
          onChange={v => handleChange('score', v)}
          required
          style={{ width: '100px' }}
        />
        <span style={{ marginLeft: '8px' }}>점</span>
      </div>
      <div className="year-month-row" style={{ marginTop: '14px' }}>
        <select value={form.year} onChange={e => handleChange('year', e.target.value)}>
          <option value="">연도</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={form.month} onChange={e => handleChange('month', e.target.value)}>
          <option value="">월</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <Button onClick={handleAdd} size="default" variant="black">+ 추가하기</Button>
    </div>
  );
};
export default LanguageInputForm;
