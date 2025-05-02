
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
    if (field === 'name') {
      setValidationErrors(prev => ({ ...prev, name: '' }));
    } else if (field === 'email') {
      setValidationErrors(prev => ({ ...prev, email: '' }));
    } else if (field === 'phoneNumber') {
      setValidationErrors(prev => ({ ...prev, phone: '' }));
    } else if (field === 'referralCode') {
      setValidationErrors(prev => ({ ...prev, referralCode: '' }));
    }
  };

  const handleBlur = async (field: string) => {
    let fieldName: string;
    let value: string;
    
    switch (field) {
      case 'name':
        fieldName = 'name';
        value = formData.name;
        break;
      case 'email':
        fieldName = 'email';
        value = formData.email;
        break;
      case 'phoneNumber':
        fieldName = 'phone';
        value = formData.phoneNumber;
        break;
      case 'referralCode':
        fieldName = 'referralCode';
        value = formData.referralCode;
        break;
      default:
        fieldName = field;
        value = formData[field as keyof typeof formData] || '';
    }
    
    await validateField(fieldName, value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = await validateAllFields({
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      referralCode: formData.referralCode
    });
    
    if (!isValid) {
      return;
    }
    
    // Submit the form
    handleSubmit(formData);
  };
  
  const validateAllFields = async (fields: {
    name: string;
    email: string;
    phoneNumber: string;
    referralCode: string;
  }) => {
    // Use the validateAllFields method from useWaitlistValidation hook
    return validateField('name', fields.name) === '' &&
           validateField('email', fields.email) === '' &&
           validateField('phone', fields.phoneNumber) === '' &&
           (fields.referralCode === '' || validateField('referralCode', fields.referralCode) === '');
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
        placeholder={t('form.placeholder.name')}
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
        placeholder={t('form.placeholder.email')}
        dir={dir}
      />
      
      <FormField
        id="phoneNumber"
        label={t('form.phone')}
        value={formData.phoneNumber}
        onChange={value => handleChange('phoneNumber', value)}
        onBlur={() => handleBlur('phoneNumber')}
        error={validationErrors.phone}
        required
        type="tel"
        placeholder={t('form.placeholder.phone')}
        prefix="+966"
        maxLength={9}
        inputMode="numeric"
        dir={dir}
      />
      
      <FormField
        id="referralCode"
        label={t('form.referral')}
        value={formData.referralCode}
        onChange={value => handleChange('referralCode', value)}
        onBlur={() => handleBlur('referralCode')}
        error={validationErrors.referralCode}
        placeholder={t('form.placeholder.referral')}
        dir={dir}
      />
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('form.submitting') : t('waitlist.join')}
      </Button>
    </form>
  );
};
