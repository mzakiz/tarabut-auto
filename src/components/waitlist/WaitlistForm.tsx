
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

  const handleBlur = (field: string, value: string) => {
    validateField(field, value);
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
          name="name"
          register={register}
          label={t('form.name')}
          placeholder={t('form.placeholder.name')}
          error={validationErrors.name || errors.name?.message}
          onBlur={(e) => handleBlur('name', e.target.value)}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="email"
          name="email"
          register={register}
          label={t('form.email')}
          placeholder={t('form.placeholder.email')}
          error={validationErrors.email || errors.email?.message}
          onBlur={(e) => handleBlur('email', e.target.value)}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="tel"
          name="phoneNumber"
          register={register}
          label={t('form.phone')}
          placeholder={t('form.placeholder.phone')}
          error={validationErrors.phone || errors.phoneNumber?.message}
          onBlur={(e) => handleBlur('phone', e.target.value)}
          prefix={isRTL ? '' : '+966'}
          suffix={isRTL ? '966+' : ''}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        
        <FormField
          type="text"
          name="referralCode"
          register={register}
          label={t('form.referral')}
          placeholder={t('form.placeholder.referral')}
          error={validationErrors.referralCode || errors.referralCode?.message}
          onBlur={(e) => handleBlur('referralCode', e.target.value)}
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
