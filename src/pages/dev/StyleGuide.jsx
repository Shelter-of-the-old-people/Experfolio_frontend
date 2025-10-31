import React, { useState, useEffect } from 'react';
import { Button, TextInput, PasswordInput, NumberInput, BusinessNumberInput } from '../../components/atoms';

// --- 로직 주입을 위한 임포트 ---
import { useLazyApi } from '../../hooks/useApi';
// .backup이 제거된 BusinessNumberAPIService.js에서 클래스들을 임포트합니다.
import { 
  BusinessNumberAPIService, 
  BusinessNumberValidationResult 
} from '../../services/BusinessNumberAPIService'; 
const apiKey = import.meta.env.VITE_BUSINESS_API_KEY;
const businessNumberService = new BusinessNumberAPIService(apiKey);
const validateApi = (businessNumber) => {
  if (!apiKey) {
    console.error("VITE_BUSINESS_API_KEY is not set in .env.local");
    return Promise.reject(new Error("API 키가 .env.local에 설정되지 않았습니다."));
  }
  return businessNumberService.validateBusinessNumber(businessNumber);
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

  const { 
    data: validationData1, 
    loading: isValidating1, 
    error: validationError1,
    execute: executeValidation1 
  } = useLazyApi(validateApi);

  const handleValidation1 = (businessNumber) => {
    console.log('StyleGuide: (실제 API) 수동 검증 시작', businessNumber);
    executeValidation1(businessNumber);
  };
  
  const { 
    data: validationData2, 
    loading: isValidating2, 
    error: validationError2,
    execute: executeValidation2 
  } = useLazyApi(validateApi);

  useEffect(() => {
    const { part1, part2, part3 } = demoValues.businessNumber2;
    if (part1.length === 3 && part2.length === 2 && part3.length === 5) {
      const fullNumber = `${part1}${part2}${part3}`;
      console.log('StyleGuide: (실제 API) 자동 검증 시작', fullNumber);
      executeValidation2(fullNumber);
    }
  }, [demoValues.businessNumber2, executeValidation2]);


  const getValidationProps = (data, error, loading) => {
    const result = data; 
    const message = error ? (error.message || '알 수 없는 오류') : (result ? result.getStatusMessage() : '');
    
    return {
      isValidating: loading,
      isValid: !error && result?.isValid, 
      validationMessage: message,
      companyName: result?.companyName || '',
    };
  };

  const validationProps1 = getValidationProps(validationData1, validationError1, isValidating1);
  const validationProps2 = getValidationProps(validationData2, validationError2, isValidating2);


  return (
    <div style={{ padding: '40px', lineHeight: 1.5 }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#1a1a1a' }}>
        Experfolio 컴포넌트 스타일 가이드
      </h1>
      
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          Button 컴포넌트
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
      </section>

      {/* TextInput 섹션 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          TextInput 컴포넌트
        </h2>
      </section>

      {/* PasswordInput 섹션 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🔒 PasswordInput 컴포넌트
        </h2>
      </section>

      {/* NumberInput 섹션 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🔢 NumberInput 컴포넌트
        </h2>
      </section>

      {/* BusinessNumberInput 섹션 (리팩토링 반영) */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '30px' }}>
          🏢 BusinessNumberInput 컴포넌트 (실제 API 연동됨)
        </h2>
        
        <div style={{ 
          backgroundColor: apiKey ? '#e0f2fe' : '#fef3c7',
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: `1px solid ${apiKey ? '#0284c7' : '#f59e0b'}`
        }}>
          {apiKey ? (
            <p style={{ margin: 0, fontSize: '14px', color: '#0369a1' }}>
              ℹ️ <strong>안내:</strong> `.env.local` 파일에서 `VITE_BUSINESS_API_KEY`를
              성공적으로 로드했습니다. <br />
              이제 공공데이터포털 API를 **실시간으로 호출**하여 검증합니다.
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
              ⚠️ <strong>경고:</strong> `VITE_BUSINESS_API_KEY`가 `.env.local`에 설정되지 않았습니다.
              <br /> API 호출이 실패합니다. 프로젝트 루트에 `.env.local` 파일을 생성하고 키를 추가한 후 서버를 재시작하세요.
            </p>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
          
          {/* 수동 검증 */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>수동 검증 (실제 API)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <BusinessNumberInput
                label="사업자등록번호"
                value={demoValues.businessNumber1}
                onChange={(value) => updateValue('businessNumber1', value)}
                required
                
                // --- 검증 로직 및 상태 주입 ---
                onValidate={handleValidation1} // 실제 API 호출 함수 주입
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
                • 상위 컴포넌트(StyleGuide)가 `useLazyApi(validateApi)`로 로직 소유<br/>
                • '검증' 버튼 클릭 시 `onValidate` prop이 (실제 API) 호출됨<br/>
                • `isValidating`, `isValid` 등 상태를 props로 주입받음
              </div>
            </div>
          </div>

          {/* 자동 검증 */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>자동 검증 (실제 API)</h3>
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
                • 10자리 완성 시 `useLazyApi(validateApi)` 자동 실행<br/>
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
              <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>테스트용 사업자 번호 (API 기준):</p>
              <div style={{ fontFamily: 'monospace', color: '#374151' }}>
                • <strong>123-45-67890</strong> (국세청 등록번호가 아님)<br/>
                • <strong>105-87-75618</strong> (유효: (주)에스비에스)<br/>
                • <strong>220-81-62517</strong> (유효: (주)문화방송)<br/>
                • <strong>111-11-11111</strong> (국세청 등록번호가 아님)
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default StyleGuidePage;