import React from 'react';
import { Button } from '../atoms';
import '../../styles/components/SignupSuccessModal.css';

const SignupSuccessModal = ({ 
  isOpen, 
  buttonText, 
  onButtonClick 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-logo">Experfolio</div>
        <h2 className="modal-title">환영합니다!</h2>
        <p className="modal-desc">인증이 완료 되었습니다.</p>
        
        <div className="modal-action">
          <Button 
            variant="black" 
            size="full" 
            onClick={onButtonClick}
            style={{ height: '48px', fontSize: '14px', fontWeight: '700' }}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccessModal;