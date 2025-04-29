
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Head } from '@/components/Head';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Analytics } from '@/services/analytics';
import { 
  preloadAllTranslations, 
  storeTranslationsInSession, 
  getCriticalTranslation,
  enTranslationData,
  arTranslationData
} from '@/utils/translationPreloader';
import confetti from 'canvas-confetti';

// Force preload translations when this module loads
preloadAllTranslations();

const Confirmation = () => {
  // Immediately preload translations as early as possible
  preloadAllTranslations();
  storeTranslationsInSession();

  // Custom hook to get language
  const { language } = useLanguage();
  const { t, refreshTranslations } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [confettiShown, setConfettiShown] = useState(false);
  const [searchParams] = useSearchParams();
  
  // For direct access to translations when hook fails
  const translations = language === 'ar' ? arTranslationData : enTranslationData;

  // Get parameters from URL query params
  const referralCode = searchParams.get('referralCode') || sessionStorage.getItem('waitlist_referralCode') || '';
  const position = parseInt(searchParams.get('position') || sessionStorage.getItem('waitlist_position') || '0', 10);
  const points = parseInt(searchParams.get('points') || sessionStorage.getItem('waitlist_points') || '100', 10); 
  const statusId = searchParams.get('statusId') || sessionStorage.getItem('waitlist_statusId') || '';
  const variant = searchParams.get('variant') || sessionStorage.getItem('waitlist_variant') || 'speed';

  // Get the variant from the URL if available
  const getVariantFromUrl = () => {
    const pathParts = location.pathname.split('/');
    const variantIndex = pathParts.findIndex(part => 
      part === 'speed' || part === 'offer' || part === 'budget'
    );
    
    return variantIndex !== -1 ? pathParts[variantIndex] : variant;
  };
  
  const currentVariant = getVariantFromUrl();

  // Function to get translation, with direct access fallback
  const getTranslation = useCallback((key: string): string => {
    const translated = t(key);
    
    // If the translation hook returns the key, try direct access
    if (translated === key || !translated) {
      return translations[key] || key;
    }
    
    return translated;
  }, [t, translations]);

  // Force a refresh if translations aren't ready
  useEffect(() => {
    // Log confirmation page initialization for debugging
    console.log('[Confirmation] Page initializing');
    console.log('[Confirmation] Current language:', language);
    console.log('[Confirmation] Forcefully preloading translations');
    
    // Refresh translations multiple times to ensure they're loaded
    refreshTranslations();
    preloadAllTranslations();
    storeTranslationsInSession();
    
    // Store data in session in case of refresh
    if (referralCode) sessionStorage.setItem('waitlist_referralCode', referralCode);
    if (position) sessionStorage.setItem('waitlist_position', position.toString());
    if (points) sessionStorage.setItem('waitlist_points', points.toString());
    if (statusId) sessionStorage.setItem('waitlist_statusId', statusId);
    if (variant) sessionStorage.setItem('waitlist_variant', variant);
    
    // Short delay to ensure translations are loaded
    const timer = setTimeout(() => {
      console.log('[Confirmation] Finished loading. Displaying content.');
      setIsLoading(false);
      
      // Only fire confetti once when the component mounts
      if (!confettiShown) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setConfettiShown(true);
      }
      
      // Track page view
      Analytics.trackPageViewed({
        page_name: 'waitlist_confirmation',
        language,
        variant: currentVariant
      });
      
      // Force another refresh of translations just to be sure
      refreshTranslations();
    }, 1000);

    return () => clearTimeout(timer);
  }, [language, currentVariant, refreshTranslations]);

  // Function to copy referral code to clipboard
  const handleCopyClick = () => {
    navigator.clipboard.writeText(referralCode);
    
    Analytics.trackCTAClicked({
      element_type: 'button',
      element_location: 'confirmation_page',
      element_context: 'copy_referral_code',
      screen: 'waitlist_confirmation',
      language,
      variant: currentVariant
    });
  };
  
  // Function to handle sharing referral code
  const handleShareClick = async () => {
    const shareMessage = `${getTranslation('confirmation.share_message')} ${referralCode}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Tarabut Auto',
          text: shareMessage,
          url: window.location.origin
        });
      } else {
        navigator.clipboard.writeText(shareMessage);
      }
      
      Analytics.trackCTAClicked({
        element_type: 'button',
        element_location: 'confirmation_page',
        element_context: 'share_referral_code',
        screen: 'waitlist_confirmation',
        language,
        variant: currentVariant
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleBackClick = () => {
    // Navigate back to the appropriate variant home page
    navigate(`/${language}/${currentVariant}`);
    
    Analytics.trackCTAClicked({
      element_type: 'button',
      element_location: 'confirmation_page',
      element_context: 'back_to_home',
      screen: 'waitlist_confirmation',
      language,
      variant: currentVariant
    });
  };

  // Show loading state if we're still loading translations
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <img 
          src="/Logos/Tarabut_Auto-2.png" 
          alt="Tarabut Auto Logo" 
          className="h-16 mb-6"
        />
        <div className="text-center">
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التقديم...' : 'Submitting...'}
          </p>
        </div>
      </div>
    );
  }

  // Get translations directly from the source if needed
  const confirmationTitle = getTranslation('confirmation.title');
  const confirmationSubtitle = getTranslation('confirmation.subtitle');
  const positionMessage = getTranslation('confirmation.position_message');
  const referralTitle = getTranslation('confirmation.referral_title');
  const referralDescription = getTranslation('confirmation.referral_description');
  const copyButtonText = getTranslation('confirmation.copy');
  const shareButtonText = getTranslation('confirmation.share');
  const pointsTitle = getTranslation('confirmation.points_title');
  const pointsDescription = getTranslation('confirmation.points_description');
  const pointsText = getTranslation('confirmation.points');
  const backHome = getTranslation('back.home');

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Head 
        title={confirmationTitle}
        description={confirmationSubtitle}
      />
      <header className="py-4 px-6">
        <Button variant="ghost" onClick={handleBackClick} className="flex items-center">
          {language === 'ar' ? (
            <>
              {backHome}
              <ArrowLeft className="ml-2 h-4 w-4 rtl:rotate-180" />
            </>
          ) : (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backHome}
            </>
          )}
        </Button>
      </header>
      
      <div className="container mx-auto px-4 py-8 max-w-lg flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/Logos/Tarabut_Auto-2.png" 
              alt="Tarabut Auto Logo" 
              className="h-16" 
            />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {confirmationTitle}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {confirmationSubtitle}
          </p>
          
          {/* Enhanced waitlist position display */}
          <div className="bg-gray-50 py-6 px-4 rounded-lg shadow-sm mb-6">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {positionMessage}
            </p>
            <div className="flex justify-center items-center">
              <span className="text-5xl font-bold text-tarabut-dark">{position}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {referralTitle}
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            {referralDescription}
          </p>
          
          <div className="relative mb-6">
            <input 
              type="text" 
              value={referralCode} 
              readOnly 
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-center text-lg font-semibold"
            />
            <Button 
              onClick={handleCopyClick} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-tarabut-teal text-tarabut-dark hover:bg-tarabut-teal/80"
              size="sm"
            >
              {copyButtonText}
            </Button>
          </div>
          
          <Button onClick={handleShareClick} className="w-full bg-tarabut-dark hover:bg-tarabut-dark/80 text-white">
            {shareButtonText}
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 text-center">
            {pointsTitle}
          </h2>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-3xl font-bold text-tarabut-dark">{points}</span>
            <span className="text-gray-600">{pointsText}</span>
          </div>
          <p className="text-sm text-gray-600 text-center">
            {pointsDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
