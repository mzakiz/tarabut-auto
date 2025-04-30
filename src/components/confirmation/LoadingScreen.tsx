
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Analytics } from '@/services/analytics';

export const LoadingScreen: React.FC = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Track loading screen view
    Analytics.page('Loading Screen', {
      language,
      screen: 'loading_screen'
    });
  }, [language]);
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <img 
        src="/Logos/Tarabut_Auto-2.png" 
        alt="Tarabut Auto Logo" 
        className="h-16 mb-6"
      />
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="h-4 w-20 bg-gray-300 mx-auto rounded"></div>
        </div>
        <p className="text-gray-600">
          {language === 'ar' ? 'جاري التقديم...' : 'Submitting...'}
        </p>
      </div>
    </div>
  );
};
