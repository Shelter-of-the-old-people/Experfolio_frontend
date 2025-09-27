import React, { useState } from 'react';

// 각 컴포넌트들을 import (실제로는 atoms 폴더에서 import)
// import { Button, TextInput, PasswordInput, NumberInput } from './components/atoms';

// 임시로 컴포넌트들을 여기에 정의 (실제로는 import해서 사용)

// Button 컴포넌트
const Button = ({ variant = 'black', size = 'default', type = 'button', icon, children, disabled = false, onClick, ...props }) => {
  const getClassName = () => {
    let classes = ['btn'];
    classes.push(`btn-${variant}`);
    classes.push(`btn-${size}`);
    if (disabled) classes.push('btn-disabled');
    return classes.join(' ');
  };

  return (
    <button type={type} className={getClassName()} onClick={onClick} disabled={disabled} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
};

// TextInput 컴포넌트
const TextInput = ({ variant = 'text', value = '', onChange, placeholder, disabled = false, error = false, errorMessage, label, required = false, maxLength, prefix, suffix, ...props }) => {
  const getInputClassName = () => {
    let classes = ['input'];
    if (error) classes.push('input-error');
    if (disabled) classes.push('input-disabled');
    return classes.join(' ');
  };

  const getInputType = () => {
    switch(variant) {
      case 'number': return 'number';
      case 'password': return 'password';
      case 'email': return 'email';
      default: return 'text';
    }
  };

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input
          type={getInputType()}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={getInputClassName()}
          {...props}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && errorMessage && (
        <span className="input-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

// PasswordInput 컴포넌트
const PasswordInput = ({ value = '', onChange, placeholder, disabled = false, error = false, errorMessage, label, required = false, showPasswordToggle = true, strengthIndicator = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { level: 1, text: '약함' };
    if (score <= 3) return { level: 2, text: '보통' };
    if (score <= 4) return { level: 3, text: '강함' };
    return { level: 4, text: '매우 강함' };
  };

  const strength = strengthIndicator ? getPasswordStrength(value) : null;

  const getInputClassName = () => {
    let classes = ['input'];
    if (error) classes.push('input-error');
    if (disabled) classes.push('input-disabled');
    return classes.join(' ');
  };

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {strengthIndicator && value && (
        <div className="password-strength">
          <div className={`password-strength-bar strength-${strength.level}`}>
            <div className="password-strength-fill"></div>
          </div>
          <span className="password-strength-text">{strength.text}</span>
        </div>
      )}
      {error && errorMessage && (
        <span className="input-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

// NumberInput 컴포넌트
const NumberInput = ({ value, onChange, min, max, step = 1, placeholder, disabled = false, error = false, errorMessage, label, required = false, ...props }) => {
  const handleChange = (e) => {
    const numValue = e.target.value === '' ? undefined : Number(e.target.value);
    onChange?.(numValue);
  };

  const getInputClassName = () => {
    let classes = ['input'];
    if (error) classes.push('input-error');
    if (disabled) classes.push('input-disabled');
    return classes.join(' ');
  };

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        <input
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          {...props}
        />
      </div>
      {error && errorMessage && (
        <span className="input-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

// 스타일 가이드 페이지 메인 컴포넌트
const StyleGuidePage = () => {
  const [demoValues, setDemoValues] = useState({
    // TextInput values
    text1: 'Sample text',
    text2: 'user@example.com',
    textPrefix: '',
    textSuffix: '',
    textBoth: '',
    textError: '',
    
    // PasswordInput values
    password1: 'weakpass',
    password2: 'StrongPass123!',
    passwordNoToggle: '',
    passwordError: '',
    
    // NumberInput values
    number1: 25,
    number2: '',
    numberPrice: '',
    numberRating: '',
    numberError: ''
  });

  const updateValue = (key, value) => {
    setDemoValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: 1.5 }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#1a1a1a' }}>
        🎨 Experfolio 컴포넌트 스타일 가이드
      </h1>
      
      {/* Button 섹션 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🔘 Button 컴포넌트
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Variants</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Button variant="black">Black Button</Button>
            <Button variant="trans">Trans Button</Button>
            <Button variant="circle">+</Button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Sizes</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Button variant="black" size="default">Default Size</Button>
            <Button variant="black" size="full">Full Width Button</Button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>With Icons</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Button variant="black" icon="🔍">Search</Button>
            <Button variant="trans" icon="📤">Upload</Button>
            <Button variant="circle">❌</Button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>States</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Button variant="black">Normal</Button>
            <Button variant="black" disabled>Disabled</Button>
            <Button variant="trans">Normal Trans</Button>
            <Button variant="trans" disabled>Disabled Trans</Button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Types</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Button variant="black" type="button">Button</Button>
            <Button variant="black" type="submit">Submit</Button>
            <Button variant="black" type="reset">Reset</Button>
          </div>
        </div>
      </section>

      {/* TextInput 섹션 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          📝 TextInput 컴포넌트
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Variants</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <TextInput
                variant="text"
                label="Text Input"
                placeholder="일반 텍스트 입력"
                value={demoValues.text1}
                onChange={(value) => updateValue('text1', value)}
              />
              <TextInput
                variant="email"
                label="Email Input"
                placeholder="이메일 입력"
                value={demoValues.text2}
                onChange={(value) => updateValue('text2', value)}
              />
              <TextInput
                variant="password"
                label="Password Input"
                placeholder="비밀번호 입력"
              />
              <TextInput
                variant="number"
                label="Number Input"
                placeholder="숫자 입력"
              />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>With Prefix/Suffix</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <TextInput
                label="With Prefix"
                placeholder="검색어 입력"
                prefix="🔍"
                value={demoValues.textPrefix}
                onChange={(value) => updateValue('textPrefix', value)}
              />
              <TextInput
                label="With Suffix"
                placeholder="나이 입력"
                suffix="세"
                value={demoValues.textSuffix}
                onChange={(value) => updateValue('textSuffix', value)}
              />
              <TextInput
                label="Both Prefix & Suffix"
                placeholder="가격 입력"
                prefix="₩"
                suffix="원"
                value={demoValues.textBoth}
                onChange={(value) => updateValue('textBoth', value)}
              />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>States</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <TextInput
                label="Normal State"
                placeholder="일반 상태"
                value={demoValues.textError}
                onChange={(value) => updateValue('textError', value)}
              />
              <TextInput
                label="Error State"
                placeholder="에러 상태"
                error={true}
                errorMessage="필수 입력 항목입니다"
                required
                value={demoValues.textError}
                onChange={(value) => updateValue('textError', value)}
              />
              <TextInput
                label="Disabled State"
                placeholder="비활성화"
                value="수정 불가"
                disabled={true}
              />
            </div>
          </div>

        </div>
      </section>

      {/* PasswordInput 섹션 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🔒 PasswordInput 컴포넌트
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Basic Password</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <PasswordInput
                label="기본 비밀번호"
                placeholder="비밀번호 입력"
                value={demoValues.password1}
                onChange={(value) => updateValue('password1', value)}
                required
              />
              <PasswordInput
                label="토글 없는 비밀번호"
                placeholder="토글 버튼 없음"
                showPasswordToggle={false}
                value={demoValues.passwordNoToggle}
                onChange={(value) => updateValue('passwordNoToggle', value)}
              />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>With Strength Indicator</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <PasswordInput
                label="약한 비밀번호"
                placeholder="약한 비밀번호 예시"
                value={demoValues.password1}
                onChange={(value) => updateValue('password1', value)}
                strengthIndicator={true}
              />
              <PasswordInput
                label="강한 비밀번호"
                placeholder="강한 비밀번호 예시"
                value={demoValues.password2}
                onChange={(value) => updateValue('password2', value)}
                strengthIndicator={true}
              />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Error & Disabled</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <PasswordInput
                label="에러 상태"
                placeholder="비밀번호 확인"
                error={true}
                errorMessage="비밀번호가 일치하지 않습니다"
                value={demoValues.passwordError}
                onChange={(value) => updateValue('passwordError', value)}
                required
              />
              <PasswordInput
                label="비활성화"
                placeholder="수정 불가"
                value="disabled123"
                disabled={true}
              />
            </div>
          </div>

        </div>
      </section>

      {/* NumberInput 섹션 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🔢 NumberInput 컴포넌트
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Basic Number Input</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <NumberInput
                label="나이"
                placeholder="나이 입력"
                value={demoValues.number1}
                onChange={(value) => updateValue('number1', value)}
                min={1}
                max={100}
                required
              />
              <NumberInput
                label="점수 (제한 없음)"
                placeholder="점수 입력"
                value={demoValues.number2}
                onChange={(value) => updateValue('number2', value)}
              />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>With Min/Max/Step</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <NumberInput
                label="가격 (1000원 단위)"
                placeholder="가격 입력"
                min={0}
                step={1000}
                value={demoValues.numberPrice}
                onChange={(value) => updateValue('numberPrice', value)}
              />
              <NumberInput
                label="평점 (0.0 - 5.0)"
                placeholder="평점 입력"
                min={0}
                max={5}
                step={0.1}
                value={demoValues.numberRating}
                onChange={(value) => updateValue('numberRating', value)}
              />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Error & Disabled</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <NumberInput
                label="에러 상태"
                placeholder="1-10 사이 입력"
                min={1}
                max={10}
                error={true}
                errorMessage="1-10 사이의 숫자를 입력하세요"
                required
                value={demoValues.numberError}
                onChange={(value) => updateValue('numberError', value)}
              />
              <NumberInput
                label="비활성화"
                value={100}
                disabled={true}
              />
            </div>
          </div>

        </div>
      </section>

      {/* CSS 클래스 참조 */}
      <section>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🎨 CSS 클래스 참조
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div>
            <h3 style={{ marginBottom: '10px', color: '#4b5563' }}>Button Classes</h3>
            <pre style={{ background: '#f3f4f6', padding: '12px', fontSize: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`.btn { }
.btn-black { }
.btn-trans { }
.btn-circle { }
.btn-default { }
.btn-full { }
.btn-disabled { }
.btn-icon { }
.btn-text { }`}
            </pre>
          </div>

          <div>
            <h3 style={{ marginBottom: '10px', color: '#4b5563' }}>Input Classes</h3>
            <pre style={{ background: '#f3f4f6', padding: '12px', fontSize: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`.input-wrapper { }
.input-label { }
.input-required { }
.input-container { }
.input { }
.input-prefix { }
.input-suffix { }
.input-error { }
.input-disabled { }
.input-error-message { }`}
            </pre>
          </div>

          <div>
            <h3 style={{ marginBottom: '10px', color: '#4b5563' }}>Password Classes</h3>
            <pre style={{ background: '#f3f4f6', padding: '12px', fontSize: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`.password-toggle { }
.password-strength { }
.password-strength-bar { }
.password-strength-fill { }
.strength-1 { /* 약함 */ }
.strength-2 { /* 보통 */ }
.strength-3 { /* 강함 */ }
.strength-4 { /* 매우 강함 */ }
.password-strength-text { }`}
            </pre>
          </div>

        </div>
      </section>

    </div>
  );
};

export default StyleGuidePage;