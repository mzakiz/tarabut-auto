
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LoadingScreen: React.FC = () => {
  const { language } = useLanguage();
  
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
};
