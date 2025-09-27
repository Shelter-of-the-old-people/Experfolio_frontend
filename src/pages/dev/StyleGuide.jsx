import React, { useState } from 'react';
import { Button, TextInput, PasswordInput, NumberInput } from '../../components/atoms';

// 폰트 테스트용 인라인 스타일
const fontTestStyle = {
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
};

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
        <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Font Weight Test - Pretendard</h3>
          <div style={{ fontFamily: '"Pretendard", sans-serif', fontSize: '18px', lineHeight: '1.8' }}>
            <div style={{fontWeight: 100}}>100 - Thin (얇은 글꼴)</div>
            <div style={{fontWeight: 200}}>200 - Extra Light (매우 가벼운 글꼴)</div>
            <div style={{fontWeight: 300}}>300 - Light (가벼운 글꼴)</div>
            <div style={{fontWeight: 400}}>400 - Regular (기본 글꼴)</div>
            <div style={{fontWeight: 500}}>500 - Medium (보통 글꼴)</div>
            <div style={{fontWeight: 600}}>600 - Semi Bold (약간 굵은 글꼴)</div>
            <div style={{fontWeight: 700}}>700 - Bold (굵은 글꼴)</div>
            <div style={{fontWeight: 800}}>800 - Extra Bold (매우 굵은 글꼴)</div>
            <div style={{fontWeight: 900}}>900 - Black (가장 굵은 글꼴)</div>
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