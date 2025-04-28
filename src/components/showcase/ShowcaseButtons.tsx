
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate, useLocation } from 'react-router-dom';
import { Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShowcaseButtonsProps {
  onWaitlistCTAClick?: () => void;
}

const ShowcaseButtons: React.FC<ShowcaseButtonsProps> = ({ onWaitlistCTAClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  const getPathDetails = () => {
    const pathParts = location.pathname.split('/');
    return {
      lang: pathParts[1] || 'en',
      variant: pathParts[2] || 'speed'
    };
  };

  const handleWaitlistClick = () => {
    const { lang, variant } = getPathDetails();
    
    Analytics.trackCTAClicked({
      element_type: 'button',
      element_location: 'hero_section',
      element_context: 'waitlist_signup',
      screen: 'landing_page',
      language,
      variant
    });
    
    if (onWaitlistCTAClick) {
      onWaitlistCTAClick();
    }
    
    navigate(`/${lang}/${variant}/waitlist-signup`);
  };

  const handleDealershipClick = () => {
    const { lang, variant } = getPathDetails();
    
    Analytics.trackCTAClicked({
      element_type: 'button',
      element_location: 'hero_section',
      element_context: 'dealership_signup',
      screen: 'landing_page',
      language,
      variant
    });
    
    navigate(`/${lang}/${variant}/dealership`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
      <Button
        onClick={handleWaitlistClick}
        className="bg-tarabut-teal hover:bg-tarabut-teal/90 text-tarabut-dark min-h-[56px] font-medium text-xl px-10 py-7 w-full sm:w-auto"
      >
        {t('waitlist.join')}
      </Button>
      <Button
        variant="outline"
        onClick={handleDealershipClick}
        className="bg-transparent border-2 border-white text-white hover:bg-white/10 min-h-[56px] text-xl px-10 py-7 w-full sm:w-auto"
      >
        {t('dealership.cta')}
      </Button>
    </div>
  );
};

export default ShowcaseButtons;
