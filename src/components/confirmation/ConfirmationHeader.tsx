
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Analytics } from '@/services/analytics';

interface ConfirmationHeaderProps {
  getTranslation: (key: string) => string;
  currentVariant: string;
}

export const ConfirmationHeader: React.FC<ConfirmationHeaderProps> = ({ 
  getTranslation,
  currentVariant
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

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
    <header className="py-4 px-6">
      <Button variant="ghost" onClick={handleBackClick} className="flex items-center">
        {language === 'ar' ? (
          <>
            {getTranslation('back.home')}
            <ArrowLeft className="ml-2 h-4 w-4 rtl:rotate-180" />
          </>
        ) : (
          <>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getTranslation('back.home')}
          </>
        )}
      </Button>
    </header>
  );
};
