
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/waitlist/FormField';
import { useWaitlistValidation } from '@/hooks/useWaitlistValidation';
import { useWaitlistSubmission } from '@/hooks/useWaitlistSubmission';
import { useAnalyticsPage, Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { preloadAllTranslations, storeTranslationsInSession } from '@/utils/translationPreloader';

const WaitlistSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { validationErrors, validateField } = useWaitlistValidation();
  const { isSubmitting, handleSubmit } = useWaitlistSubmission();
  
  // Force preload translations
  useEffect(() => {
    preloadAllTranslations();
    storeTranslationsInSession();
  }, []);
  
  // Extract variant from URL params or pathname
  const getVariant = () => {
    // First try to get it from the URL parameters
    if (params.variant) {
      return params.variant;
    }
    
    // If not available in params, extract from pathname
    const pathParts = location.pathname.split('/');
    const variantIndex = pathParts.findIndex(part => 
      part === 'speed' || part === 'offer' || part === 'budget'
    );
    
    return variantIndex !== -1 ? pathParts[variantIndex] : 'speed';
  };
  
  const variant = getVariant();

  useAnalyticsPage('Waitlist Form', { language, variant });

  const handleFieldFocus = (fieldName: string) => {
    Analytics.trackFormFieldEntered({
      field_name: fieldName,
      screen: 'waitlist_form',
      language,
      variant
    });
  };
  
  const handleFieldBlur = async (fieldName: string, value: string) => {
    setFormTouched(prev => ({ ...prev, [fieldName]: true }));
    
    if (!value && fieldName !== 'referralCode') {
      Analytics.trackFormFieldLeftBlank({
        field_name: fieldName,
        screen: 'waitlist_form',
        language,
        variant
      });
    }

    await validateField(fieldName, value);
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure translations are preloaded before submission
    preloadAllTranslations();
    storeTranslationsInSession();
    
    await handleSubmit({ 
      name, 
      email, 
      phoneNumber, 
      referralCode,
      variant // Pass the variant to the submission handler
    });
  };
  
  const handleBack = () => {
    Analytics.trackCTAClicked({
      element_type: 'button',
      element_location: 'waitlist_form',
      element_context: 'back_to_home',
      screen: 'waitlist_form',
      language,
      variant
    });
    
    // Navigate back to the variant-specific home page
    navigate(`/${language}/${variant}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 relative">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}
        >
          {language === 'ar' ? (
            <>
              {t('back.home')}
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </>
          ) : (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back.home')}
            </>
          )}
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

            <h1 className={`text-2xl font-bold text-center text-gray-800 mb-2`}>
              {t('waitlist.title')}
            </h1>
            <p className={`text-center text-gray-600 mb-8`}>
              {t('waitlist.description')}
            </p>

            <form onSubmit={handleFormSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                  className={language === 'ar' ? 'text-right' : 'text-left'}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
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
                  className={language === 'ar' ? 'text-right' : 'text-left'}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
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
                  className={language === 'ar' ? 'text-right' : 'text-left'}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
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
                  className={language === 'ar' ? 'text-right' : 'text-left'}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
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
