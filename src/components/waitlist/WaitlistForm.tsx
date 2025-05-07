
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/waitlist/FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from '@/hooks/useTranslation';
import { useWaitlistSubmission } from '@/hooks/useWaitlistSubmission';
import { useWaitlistValidation } from '@/hooks/useWaitlistValidation';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface WaitlistFormProps {
  variant?: string;
  referralCode?: string;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ 
  variant = 'speed',
  referralCode = ''
}) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { isSubmitting, submissionProgress, handleSubmit: submitWaitlist } = useWaitlistSubmission();
  const { validateAllFields, validateField, validationErrors } = useWaitlistValidation();
  
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      referralCode: referralCode || ''
    }
  });
  
  // Update referral code if passed as prop
  useEffect(() => {
    if (referralCode) {
      setValue('referralCode', referralCode);
    }
  }, [referralCode, setValue]);
  
  // Get current form values
  const name = watch('name');
  const email = watch('email');
  const phoneNumber = watch('phoneNumber');
  const currentReferralCode = watch('referralCode');
  
  const onSubmit = async (data: {
    name: string;
    email: string;
    phoneNumber: string;
    referralCode: string;
  }) => {
    const isValid = await validateAllFields(data);
    if (!isValid) return;
    
    submitWaitlist({
      ...data,
      variant
    });
  };
  
  // Handle field changes
  const handleNameChange = (value: string) => {
    setValue('name', value);
  };
  
  const handleEmailChange = (value: string) => {
    setValue('email', value);
  };
  
  const handlePhoneChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    setValue('phoneNumber', numericValue);
  };
  
  const handleReferralChange = (value: string) => {
    setValue('referralCode', value);
  };
  
  // Field event handlers
  const handleNameBlur = () => {
    validateField('name', name);
  };
  
  const handleEmailBlur = () => {
    validateField('email', email);
  };
  
  const handlePhoneBlur = () => {
    validateField('phone', phoneNumber);
  };
  
  const handleReferralBlur = () => {
    validateField('referralCode', currentReferralCode);
  };
  
  const handleNameFocus = () => {
    // Focus handling for name field
  };
  
  const handleEmailFocus = () => {
    // Focus handling for email field
  };
  
  const handlePhoneFocus = () => {
    // Focus handling for phone field
  };
  
  const handleReferralFocus = () => {
    // Focus handling for referral code field
  };
  
  const isRTL = language === 'ar';
  
  return (
    <div className="relative">
      {isSubmitting && (
        <LoadingOverlay 
          message={t('form.submitting') || 'Submitting...'}
          showProgress={true}
          progress={submissionProgress}
        />
      )}
      
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <FormField
          type="text"
          id="name"
          label={t('form.name')}
          value={name}
          onChange={handleNameChange}
          placeholder={t('form.placeholder.name')}
          error={validationErrors.name}
          onBlur={handleNameBlur}
          onFocus={handleNameFocus}
          required={true}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="email"
          id="email"
          label={t('form.email')}
          value={email}
          onChange={handleEmailChange}
          placeholder={t('form.placeholder.email')}
          error={validationErrors.email}
          onBlur={handleEmailBlur}
          onFocus={handleEmailFocus}
          required={true}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="tel"
          id="phoneNumber"
          label={t('form.phone')}
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={t('form.placeholder.phone')}
          error={validationErrors.phone}
          onBlur={handlePhoneBlur}
          onFocus={handlePhoneFocus}
          prefix="+966"
          required={true}
          maxLength={9}
          inputMode="numeric"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="text"
          id="referralCode"
          label={t('form.referral')}
          value={currentReferralCode}
          onChange={handleReferralChange}
          placeholder={t('form.placeholder.referral')}
          error={validationErrors.referralCode}
          onBlur={handleReferralBlur}
          onFocus={handleReferralFocus}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-ksa-primary text-white hover:bg-ksa-primary/90 py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('form.submitting') : t('form.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WaitlistForm;
