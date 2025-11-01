import React, { useState } from 'react';
import TextInput from '../atoms/TextInput';
import Select from '../atoms/Select';
import DateInput from '../atoms/DateInput';
import Button from '../atoms/Button';

const prizeOptions = [
  { value: '대상', label: '대상' },
  { value: '최우수상', label: '최우수상' },
  { value: '우수상', label: '우수상' },
  { value: '장려상', label: '장려상' },
  { value: '기타', label: '기타' },
];

const AwardInputForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    prize: '',
    description: '',
    date: '',
  });

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleAdd = () => {
    if (!form.title || !form.prize) return alert('필수 입력');
    onAdd(form);
    setForm({ title: '', prize: '', description: '', date: '' });
  };

  return (
    <div className="award-input-form">
      <TextInput label="대회명" value={form.title} onChange={(v) => handleChange('title', v)} required />
      <Select label="결과" value={form.prize} options={prizeOptions} onChange={(v) => handleChange('prize', v)} required />
      <TextInput label="설명" value={form.description} onChange={(v) => handleChange('description', v)} />
      <DateInput label="연도" value={form.date} onChange={(v) => handleChange('date', v)} />
      <Button onClick={handleAdd} size="default" variant="black">+ 추가하기</Button>
    </div>
  );
};

export default AwardInputForm;
