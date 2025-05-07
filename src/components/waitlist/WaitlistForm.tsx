
import React from 'react';
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
  const { isSubmitting, submissionProgress, handleSubmit } = useWaitlistSubmission();
  const { validateAllFields, validateField, validationErrors } = useWaitlistValidation();
  
  const { register, handleSubmit: formSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      referralCode: referralCode || ''
    }
  });
  
  const onSubmit = async (data: {
    name: string;
    email: string;
    phoneNumber: string;
    referralCode: string;
  }) => {
    const isValid = await validateAllFields(data);
    if (!isValid) return;
    
    handleSubmit({
      ...data,
      variant
    });
  };
  
  // Create state-bound handlers that don't require event parameters
  const handleNameBlur = () => {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    validateField('name', nameInput.value);
  };
  
  const handleEmailBlur = () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    validateField('email', emailInput.value);
  };
  
  const handlePhoneBlur = () => {
    const phoneInput = document.getElementById('phoneNumber') as HTMLInputElement;
    validateField('phone', phoneInput.value);
  };
  
  const handleReferralBlur = () => {
    const referralInput = document.getElementById('referralCode') as HTMLInputElement;
    validateField('referralCode', referralInput.value);
  };
  
  // Create focus handlers that don't use event parameters
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
        onSubmit={formSubmit(onSubmit)}
        className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <FormField
          type="text"
          id="name"
          name="name"
          label={t('form.name')}
          value={register('name').value}
          onChange={(value) => register('name').onChange({ target: { value } })}
          placeholder={t('form.placeholder.name')}
          error={validationErrors.name || errors.name?.message}
          onBlur={handleNameBlur}
          onFocus={handleNameFocus}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="email"
          id="email"
          name="email"
          label={t('form.email')}
          value={register('email').value}
          onChange={(value) => register('email').onChange({ target: { value } })}
          placeholder={t('form.placeholder.email')}
          error={validationErrors.email || errors.email?.message}
          onBlur={handleEmailBlur}
          onFocus={handleEmailFocus}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          label={t('form.phone')}
          value={register('phoneNumber').value}
          onChange={(value) => register('phoneNumber').onChange({ target: { value } })}
          placeholder={t('form.placeholder.phone')}
          error={validationErrors.phone || errors.phoneNumber?.message}
          onBlur={handlePhoneBlur}
          onFocus={handlePhoneFocus}
          prefix={isRTL ? '' : '+966'}
          suffix={isRTL ? '966+' : ''}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="text"
          id="referralCode"
          name="referralCode"
          label={t('form.referral')}
          value={register('referralCode').value}
          onChange={(value) => register('referralCode').onChange({ target: { value } })}
          placeholder={t('form.placeholder.referral')}
          error={validationErrors.referralCode || errors.referralCode?.message}
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
            {t('form.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WaitlistForm;
