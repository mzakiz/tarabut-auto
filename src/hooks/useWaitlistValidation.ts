
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ValidationErrors = Record<string, string>;

export const useWaitlistValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+966[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const validateReferralCode = async (code: string) => {
    if (!code) return true;
    const { data } = await supabase
      .from('waitlist_users')
      .select('referral_code')
      .eq('referral_code', code)
      .maybeSingle();
    
    return !!data;
  };

  const validateField = async (fieldName: string, value: string) => {
    let error = '';
    if (fieldName === 'email' && value && !validateEmail(value)) {
      error = 'Please enter a valid email address';
    } else if (fieldName === 'phone') {
      const fullPhone = `+966${value}`;
      if (value && !validatePhone(fullPhone)) {
        error = 'Phone number must be 9 digits after +966';
      }
    } else if (fieldName === 'referralCode' && value && !(await validateReferralCode(value))) {
      error = 'Invalid referral code';
    }

    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return error;
  };

  return {
    validationErrors,
    setValidationErrors,
    validateField,
    validateEmail,
    validatePhone,
    validateReferralCode
  };
};
