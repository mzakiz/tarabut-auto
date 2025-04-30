
import React, { useState } from 'react';
import { useWaitlistSubmission } from '@/hooks/useWaitlistSubmission';
import { FormField } from '@/components/waitlist/FormField';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useWaitlistValidation, ValidationErrors } from '@/hooks/useWaitlistValidation';
import { LoadingScreen } from '@/components/confirmation/LoadingScreen';

interface WaitlistFormProps {
  variant?: string;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ variant }) => {
  const { t, language } = useTranslation();
  const { handleSubmit, isSubmitting } = useWaitlistSubmission();
  const { validateField, validationErrors, setValidationErrors } = useWaitlistValidation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    referralCode: '',
    variant: variant || 'speed',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleBlur = async (field: string) => {
    await validateField(field, formData[field as keyof typeof formData]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: ValidationErrors = {};
    
    for (const field of ['name', 'email', 'phoneNumber']) {
      const error = await validateField(field, formData[field as keyof typeof formData]);
      if (error) errors[field] = error;
    }
    
    if (formData.referralCode) {
      const error = await validateField('referralCode', formData.referralCode);
      if (error) errors.referralCode = error;
    }
    
    // If any errors, don't submit
    if (Object.values(errors).some(error => !!error)) {
      return;
    }
    
    // Submit the form
    handleSubmit(formData);
  };
  
  // Show loading screen when submitting
  if (isSubmitting) {
    return <LoadingScreen />;
  }

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <form onSubmit={onSubmit} className="space-y-4" dir={dir}>
      <FormField
        id="name"
        label={t('form.name')}
        value={formData.name}
        onChange={value => handleChange('name', value)}
        onBlur={() => handleBlur('name')}
        error={validationErrors.name}
        required
        placeholder={t('form.namePlaceholder')}
        dir={dir}
      />
      
      <FormField
        id="email"
        label={t('form.email')}
        value={formData.email}
        onChange={value => handleChange('email', value)}
        onBlur={() => handleBlur('email')}
        error={validationErrors.email}
        required
        type="email"
        placeholder={t('form.emailPlaceholder')}
        dir={dir}
      />
      
      <FormField
        id="phoneNumber"
        label={t('form.phone')}
        value={formData.phoneNumber}
        onChange={value => handleChange('phoneNumber', value)}
        onBlur={() => handleBlur('phoneNumber')}
        error={validationErrors.phoneNumber}
        required
        type="tel"
        placeholder="50XXXXXXX"
        prefix="+966"
        maxLength={9}
        inputMode="numeric"
        dir={dir}
      />
      
      <FormField
        id="referralCode"
        label={t('form.referralCode')}
        value={formData.referralCode}
        onChange={value => handleChange('referralCode', value)}
        onBlur={() => handleBlur('referralCode')}
        error={validationErrors.referralCode}
        placeholder={t('form.referralCodePlaceholder')}
        dir={dir}
      />
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {t('form.submit')}
      </Button>
    </form>
  );
};
