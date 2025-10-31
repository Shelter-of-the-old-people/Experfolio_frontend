import React, { useState } from 'react';
import { Button, TextInput, PasswordInput, NumberInput, BusinessNumberInput } from '../../components/atoms';
import '../../components/atoms/BusinessNumberInput.css';

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
    number1: '25',
    number2: '',
    numberPrice: '',
    numberRating: '',
    numberError: '',
    
    // BusinessNumber values (3개 필드로 분리)
    businessNumber1: { part1: '', part2: '', part3: '' },
    businessNumber2: { part1: '', part2: '', part3: '' }
  });

  const updateValue = (key, value) => {
    setDemoValues(prev => ({ ...prev, [key]: value }));
  };

  // 사업자 번호 검증 콜백 함수들
  const handleValidationComplete = (result) => {
    console.log('검증 완료:', result.toJSON());
    alert(`검증 결과: ${result.getStatusMessage()}\n회사명: ${result.companyName || '없음'}`);
  };

  const handleValidationError = (error) => {
    console.error('검증 에러:', error);
    alert(`검증 에러: ${error.message}`);
  };

  return (
    <div style={{ padding: '40px', lineHeight: 1.5 }}>
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
          <div style={{ display: 'flex', gap: '15px', height: '120px' }}>
            <div style={{ flex: '1', display: 'flex' }}>
              <Button variant="black" size="allfull">All Full Button</Button>
            </div>
            
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
              <Button variant="black" size="default">Default Size</Button>
              <Button variant="black" size="full">Full Width Button</Button>
            </div>
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

      {/* BusinessNumberInput 섹션 (3개 NumberInput 방식) */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🏢 BusinessNumberInput 컴포넌트 (3개 NumberInput)
        </h2>
        
        <div style={{ 
          backgroundColor: '#fef3c7', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #f59e0b'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
            ⚠️ <strong>주의:</strong> 실제 API 호출을 위해서는 공공데이터포털에서 발급받은 유효한 API 키가 필요합니다.
            <br />아래 예시는 UI 동작만 확인할 수 있습니다.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
          
          {/* 기본 사업자 번호 입력 */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>기본 사업자 번호 입력</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <BusinessNumberInput
                label="사업자등록번호"
                value={demoValues.businessNumber1}
                onChange={(value) => updateValue('businessNumber1', value)}
                required
                businessNumberApiKey="demo-api-key"
                onValidationComplete={handleValidationComplete}
                onValidationError={handleValidationError}
              />
              
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                backgroundColor: '#f9fafb', 
                padding: '8px', 
                borderRadius: '4px' 
              }}>
                • 3개의 NumberInput으로 구성 (XXX-XX-XXXXX)<br/>
                • 각 필드별 자릿수 제한 (3-2-5자리)<br/>
                • '검증' 버튼으로 수동 검증
              </div>
            </div>
          </div>

          {/* 자동 검증 */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>자동 검증 (모든 필드 입력 시 자동)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <BusinessNumberInput
                label="사업자등록번호 (자동검증)"
                value={demoValues.businessNumber2}
                onChange={(value) => updateValue('businessNumber2', value)}
                required
                businessNumberApiKey="demo-api-key"
                autoValidate={true}
                showValidationButton={false}
                onValidationComplete={handleValidationComplete}
                onValidationError={handleValidationError}
              />
              
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                backgroundColor: '#f9fafb', 
                padding: '8px', 
                borderRadius: '4px' 
              }}>
                • 모든 필드 (10자리) 입력 시 자동 API 호출<br/>
                • 검증 아이콘 표시: ⏳ ✓ ✗<br/>
                • 간단하고 직관적인 UI
              </div>
            </div>
          </div>

          {/* 테스트 데이터 */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>테스트 데이터</h3>
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '15px', 
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>테스트용 사업자 번호:</p>
              <div style={{ fontFamily: 'monospace', color: '#374151' }}>
                • 123-45-67890 (각각 123, 45, 67890 입력)<br/>
                • 000-00-00000 (무효한 체크섬)<br/>
                • 각 필드는 길이 제한이 있어 자동 자르기
              </div>
              
              <p style={{ margin: '15px 0 5px 0', fontWeight: '600' }}>장점:</p>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>
                • 포맷팅 로직 불필요<br/>
                • 각 필드별 유효성 검사 쉬움<br/>
                • 사용자 경험 직관적<br/>
                • 코드 유지보수 용이
              </div>
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

          <div>
            <h3 style={{ marginBottom: '10px', color: '#4b5563' }}>BusinessNumber Classes</h3>
            <pre style={{ background: '#f3f4f6', padding: '12px', fontSize: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`.business-number-input-wrapper { }
.business-number-inputs { }
.business-number-separator { }
.validation-icon { }
.validation-icon.validating { }
.validation-icon.valid { }
.validation-icon.invalid { }
.business-validation-button { }
.business-company-info { }
.company-name { }
.business-status { }`}
            </pre>
          </div>

        </div>
      </section>

    </div>
  );
};

export default StyleGuidePage;