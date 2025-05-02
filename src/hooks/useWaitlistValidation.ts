
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

// Server validation errors interface
export interface ValidationErrors {
  name: string;
  email: string;
  phone: string;
  referralCode: string;
}

export const useWaitlistValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: '',
    email: '',
    phone: '',
    referralCode: ''
  });
  
  const { t, language } = useTranslation();

  const validateField = async (fieldName: string, value: string): Promise<string> => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'full_name':
      case 'name':
        if (!value.trim()) {
          errorMessage = t('validation.name.required') || 'Name is required';
        } else if (value.trim().length < 3) {
          errorMessage = t('validation.name.min_length') || 'Name must be at least 3 characters';
        }
        setValidationErrors(prev => ({ ...prev, name: errorMessage }));
        break;
        
      case 'email':
        if (!value.trim()) {
          errorMessage = t('validation.email.required') || 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = t('validation.email.invalid') || 'Invalid email format';
        }
        setValidationErrors(prev => ({ ...prev, email: errorMessage }));
        break;
        
      case 'phone':
      case 'phoneNumber':
        if (!value.trim()) {
          errorMessage = t('validation.phone.required') || 'Phone number is required';
        } else if (!/^5\d{8}$/.test(value)) {
          errorMessage = t('validation.phone.invalid') || 'Phone number must start with 5 and be 9 digits';
        }
        setValidationErrors(prev => ({ ...prev, phone: errorMessage }));
        break;
        
      case 'referral_code':
      case 'referralCode':
        if (value && !/^[A-Za-z0-9]{6,12}$/.test(value)) {
          errorMessage = t('validation.referral_code.invalid') || 'Invalid referral code format';
        }
        setValidationErrors(prev => ({ ...prev, referralCode: errorMessage }));
        break;
        
      default:
        break;
    }
    
    return errorMessage;
  };
  
  const validateAllFields = async (fields: {
    name: string;
    email: string;
    phoneNumber: string;
    referralCode: string;
  }): Promise<boolean> => {
    const nameError = await validateField('name', fields.name);
    const emailError = await validateField('email', fields.email);
    const phoneError = await validateField('phone', fields.phoneNumber);
    const referralError = await validateField('referralCode', fields.referralCode);
    
    return !nameError && !emailError && !phoneError && !referralError;
  };

  return {
    validationErrors,
    setValidationErrors,
    validateField,
    validateAllFields
  };
};
