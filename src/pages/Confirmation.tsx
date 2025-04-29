
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ReferralLeaderboard from '@/components/waitlist/ReferralLeaderboard';
import { Head } from '@/components/Head';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Analytics } from '@/services/analytics';
import confetti from 'canvas-confetti';

const Confirmation = () => {
  // Custom hook to get language
  const { language } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Get the referral code and position from location state
  const { 
    referralCode = '', 
    position = 0, 
    points = 100,
    variant = 'speed' // Default to speed if not provided
  } = location.state || {};

  // Get the variant from the URL if available
  const getVariantFromUrl = () => {
    const pathParts = location.pathname.split('/');
    const variantIndex = pathParts.findIndex(part => 
      part === 'speed' || part === 'offer' || part === 'budget'
    );
    
    return variantIndex !== -1 ? pathParts[variantIndex] : variant;
  };
  
  const currentVariant = getVariantFromUrl();

  React.useEffect(() => {
    // Fire confetti when the component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Track page view with variant info
    Analytics.trackPageViewed({
      page_name: 'waitlist_confirmation',
      language,
      variant: currentVariant
    });
  }, [language, currentVariant]);

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
    const shareText = `${t('confirmation.share_message')} ${referralCode}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Tarabut Auto',
          text: shareText,
          url: window.location.origin
        });
      } else {
        navigator.clipboard.writeText(shareText);
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

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Head 
        title={t('confirmation.title')}
        description={t('confirmation.subtitle')}
      />
      <header className="py-4 px-6">
        <Button variant="ghost" onClick={handleBackClick} className="flex items-center">
          {language === 'ar' ? (
            <>
              {t('back.home')}
              <ArrowLeft className="ml-2 h-4 w-4 rtl:rotate-180" />
            </>
          ) : (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back.home')}
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
            {t('confirmation.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('confirmation.subtitle')}
          </p>
          
          {/* Enhanced waitlist position display */}
          <div className="bg-gray-50 py-6 px-4 rounded-lg shadow-sm mb-6">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {t('confirmation.position_message').split('#')[0]}
            </p>
            <div className="flex justify-center items-center">
              <span className="text-5xl font-bold text-tarabut-dark">{position}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {t('confirmation.referral_title')}
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            {t('confirmation.referral_description')}
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
              {t('confirmation.copy')}
            </Button>
          </div>
          
          <Button onClick={handleShareClick} className="w-full bg-tarabut-dark hover:bg-tarabut-dark/80 text-white">
            {t('confirmation.share')}
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 text-center">
            {t('confirmation.points_title')}
          </h2>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-3xl font-bold text-tarabut-dark">{points}</span>
            <span className="text-gray-600">{t('confirmation.points')}</span>
          </div>
          <p className="text-sm text-gray-600 text-center">
            {t('confirmation.points_description')}
          </p>
        </div>
        
        <ReferralLeaderboard users={[]} variant={currentVariant} />
      </div>
    </div>
  );
};

export default Confirmation;
