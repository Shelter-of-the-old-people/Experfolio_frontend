import React, { useState, useEffect } from 'react';
import { Button, TextInput, PasswordInput, NumberInput, BusinessNumberInput } from '../../components/atoms';
import '../../components/atoms/BusinessNumberInput.css';

// --- 로직 주입을 위한 임포트 ---
import { useLazyApi } from '../../hooks/useApi';
// .backup이 제거된
// BusinessNumberAPIService.js에서 클래스들을 임포트합니다.
import { 
  BusinessNumberAPIService, 
  BusinessNumberValidationResult 
} from '../../services/BusinessNumberAPIService'; 

// --- StyleGuide 페이지 내에서 서비스 인스턴스 생성 (데모용) ---
// 'demo-api-key'는 실제로는 동작하지 않지만, 로직 흐름을 보여줍니다.
const businessNumberService = new BusinessNumberAPIService('demo-api-key');

// --- 데모용 모의 검증 함수 ---
// 실제 페이지에서는 이 로직이 API 서비스 호출을 담당합니다.
const mockValidateApi = (businessNumber) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 로컬 체크섬 검증 (BusinessNumberAPIService의 static 메서드 사용)
      const isValid = BusinessNumberAPIService.validateFormat(businessNumber);
      
      if (isValid) {
        // 성공 모의 응답
        resolve(new BusinessNumberValidationResult({
          businessNumber: businessNumber,
          isValid: true,
          status: '01', // '01': 계속사업자
          companyName: '(주)스타일가이드모의업체',
        }));
      } else {
        // 실패 모의 응답
        resolve(new BusinessNumberValidationResult({
          businessNumber: businessNumber,
          isValid: false,
          errorMessage: '국세청 체크섬 검증에 실패했습니다.',
        }));
      }
    }, 1000); // 1초 지연 시뮬레이션
  });
};


// --- StyleGuide 컴포넌트 ---
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

  // --- API 검증 로직 1 (수동 검증용) ---
  const { 
    data: validationData1, 
    loading: isValidating1, 
    error: validationError1,
    execute: executeValidation1 
  } = useLazyApi(mockValidateApi); // 모의 API 함수 사용

  // 수동 검증 버튼 핸들러
  const handleValidation1 = (businessNumber) => {
    console.log('StyleGuide: 수동 검증 시작', businessNumber);
    executeValidation1(businessNumber);
  };
  
  // --- API 검증 로직 2 (자동 검증용) ---
  const { 
    data: validationData2, 
    loading: isValidating2, 
    error: validationError2,
    execute: executeValidation2 
  } = useLazyApi(mockValidateApi); // 모의 API 함수 사용

  // 자동 검증을 위한 useEffect
  useEffect(() => {
    const { part1, part2, part3 } = demoValues.businessNumber2;
    // 10자리를 모두 채웠는지 확인
    if (part1.length === 3 && part2.length === 2 && part3.length === 5) {
      const fullNumber = `${part1}${part2}${part3}`;
      console.log('StyleGuide: 자동 검증 시작', fullNumber);
      executeValidation2(fullNumber);
    }
  }, [demoValues.businessNumber2, executeValidation2]);


  // 검증 결과를 컴포넌트 prop에 맞게 가공하는 헬퍼 함수
  const getValidationProps = (data, error, loading) => {
    const result = data; // data가 BusinessNumberValidationResult 객체
    const message = error ? error.message : (result ? result.getStatusMessage() : '');
    
    return {
      isValidating: loading,
      isValid: result?.isValid || false,
      validationMessage: message,
      companyName: result?.companyName || '',
    };
  };

  // 각 입력 필드에 전달할 props 계산
  const validationProps1 = getValidationProps(validationData1, validationError1, isValidating1);
  const validationProps2 = getValidationProps(validationData2, validationError2, isValidating2);


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

      {/* BusinessNumberInput 섹션 (리팩토링 반영) */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🏢 BusinessNumberInput 컴포넌트 (로직 분리됨)
        </h2>
        
        <div style={{ 
          backgroundColor: '#fef3c7', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #f59e0b'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
            ⚠️ <strong>주의:</strong> `BusinessNumberAPIService`가 모의 로직을 사용하도록 설정되었습니다.
            <br />이 예제는 실제 API 대신 로컬 체크섬 검증(1초 지연)을 시뮬레이션합니다.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
          
          {/* 수동 검증 */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>수동 검증 (로직 주입)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <BusinessNumberInput
                label="사업자등록번호"
                value={demoValues.businessNumber1}
                onChange={(value) => updateValue('businessNumber1', value)}
                required
                
                // --- 검증 로직 및 상태 주입 ---
                onValidate={handleValidation1} // 검증 함수 주입
                isValidating={validationProps1.isValidating}
                isValid={validationProps1.isValid}
                validationMessage={validationProps1.validationMessage}
                companyName={validationProps1.companyName}
                // ---
              />
              
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                backgroundColor: '#f9fafb', 
                padding: '8px', 
                borderRadius: '4px' 
              }}>
                • 상위 컴포넌트(StyleGuide)가 `useLazyApi`로 검증 로직 소유<br/>
                • '검증' 버튼 클릭 시 `onValidate` prop이 호출됨<br/>
                • `isValidating`, `isValid` 등 상태를 props로 주입받음
              </div>
            </div>
          </div>

          {/* 자동 검증 */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>자동 검증 (로직 주입)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <BusinessNumberInput
                label="사업자등록번호 (자동검증)"
                value={demoValues.businessNumber2}
                onChange={(value) => updateValue('businessNumber2', value)}
                required
                showValidationButton={false} // 검증 버튼 숨김
                
                // --- 검증 로직 및 상태 주입 ---
                onValidate={null} // 자동 검증이므로 버튼 핸들러 없음
                isValidating={validationProps2.isValidating}
                isValid={validationProps2.isValid}
                validationMessage={validationProps2.validationMessage}
                companyName={validationProps2.companyName}
                // ---
              />
              
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                backgroundColor: '#f9fafb', 
                padding: '8px', 
                borderRadius: '4px' 
              }}>
                • 상위 컴포넌트(StyleGuide)가 `useEffect`로 값 변경 감지<br/>
                • 10자리 완성 시 `useLazyApi` 자동 실행<br/>
                • 검증 아이콘(⏳ ✓ ✗)으로 상태 표시
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
              <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>테스트용 사업자 번호 (체크섬 기준):</p>
              <div style={{ fontFamily: 'monospace', color: '#374151' }}>
                • <strong>123-45-67890</strong> (유효: 123, 45, 67890 입력)<br/>
                • <strong>111-11-11111</strong> (유효: 111, 11, 11111 입력)<br/>
                • <strong>000-00-00000</strong> (무효: 000, 00, 00000 입력)
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default StyleGuidePage;