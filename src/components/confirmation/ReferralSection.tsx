
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Analytics } from '@/services/analytics';

interface ReferralSectionProps {
  getTranslation: (key: string) => string;
  referralCode: string;
  currentVariant: string;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({ 
  getTranslation,
  referralCode,
  currentVariant
}) => {
  const { language } = useLanguage();

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {getTranslation('confirmation.referral_title')}
      </h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        {getTranslation('confirmation.referral_description')}
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
          {getTranslation('confirmation.copy')}
        </Button>
      </div>
      
      <Button onClick={handleShareClick} className="w-full bg-tarabut-dark hover:bg-tarabut-dark/80 text-white">
        {getTranslation('confirmation.share')}
      </Button>
    </div>
  );
};
