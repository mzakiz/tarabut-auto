
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/waitlist/FormField';
import { useWaitlistValidation } from '@/hooks/useWaitlistValidation';
import { useWaitlistSubmission } from '@/hooks/useWaitlistSubmission';
import { useAnalyticsPage, Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const WaitlistSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { validationErrors, validateField } = useWaitlistValidation();
  const { isSubmitting, handleSubmit } = useWaitlistSubmission();

  useAnalyticsPage('Waitlist Form', { language });

  const handleFieldFocus = (fieldName: string) => {
    Analytics.trackFormFieldEntered({
      field_name: fieldName,
      screen: 'waitlist_form',
      language
    });
  };
  
  const handleFieldBlur = async (fieldName: string, value: string) => {
    setFormTouched(prev => ({ ...prev, [fieldName]: true }));
    
    if (!value && fieldName !== 'referralCode') {
      Analytics.trackFormFieldLeftBlank({
        field_name: fieldName,
        screen: 'waitlist_form',
        language
      });
    }

    await validateField(fieldName, value);
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit({ name, email, phoneNumber, referralCode });
  };
  
  const handleBack = () => {
    Analytics.trackCTAClicked({
      element: 'back_to_home',
      screen: 'waitlist_form',
      language
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back.home')}
        </Button>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/Logos/Tarabut_Auto-2.png" 
                alt="Tarabut Auto Logo" 
                className="max-h-[120px] w-auto object-contain" 
              />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {t('waitlist.title')}
            </h1>
            <p className="text-center text-gray-600 mb-8">
              {t('waitlist.description')}
            </p>

            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <FormField
                  id="name"
                  label={t('form.name')}
                  value={name}
                  onChange={setName}
                  onFocus={() => handleFieldFocus('full_name')}
                  onBlur={() => handleFieldBlur('full_name', name)}
                  error={formTouched['full_name'] ? validationErrors.name : ''}
                  required
                  placeholder={t('form.placeholder.name')}
                />
                
                <FormField
                  id="email"
                  label={t('form.email')}
                  value={email}
                  onChange={setEmail}
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={() => handleFieldBlur('email', email)}
                  error={formTouched['email'] ? validationErrors.email : ''}
                  required
                  type="email"
                  placeholder={t('form.placeholder.email')}
                />
                
                <FormField
                  id="phone"
                  label={t('form.phone')}
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value.replace(/\D/g, ''))}
                  onFocus={() => handleFieldFocus('phone')}
                  onBlur={() => handleFieldBlur('phone', phoneNumber)}
                  error={formTouched['phone'] ? validationErrors.phone : ''}
                  required
                  placeholder={t('form.placeholder.phone')}
                  maxLength={9}
                  inputMode="numeric"
                  prefix="+966"
                />
                
                <FormField
                  id="referralCode"
                  label={t('form.referral')}
                  value={referralCode}
                  onChange={setReferralCode}
                  onFocus={() => handleFieldFocus('referral_code')}
                  onBlur={() => handleFieldBlur('referral_code', referralCode)}
                  error={formTouched['referral_code'] ? validationErrors.referralCode : ''}
                  placeholder={t('form.placeholder.referral')}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('form.submitting') : t('waitlist.join')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSignup;
