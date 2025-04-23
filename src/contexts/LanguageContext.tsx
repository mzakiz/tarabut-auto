
import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [language, setLanguage] = useState<Language>(
    location.pathname.startsWith('/ar') ? 'ar' : 'en'
  );

  const translations = {
    en: {
      'cta.speed': 'Get Pre-Approved in 2 Minutes',
      'cta.personal': 'Find Your Perfect Car Deal',
      'cta.budget': 'Calculate What You Can Afford',
      'waitlist.join': 'Get on the Waitlist',
      'dealership.cta': 'Are you a dealership?',
      // Add more translations as needed
    },
    ar: {
      'cta.speed': 'احصل على الموافقة المسبقة في دقيقتين',
      'cta.personal': 'اعثر على صفقة سيارتك المثالية',
      'cta.budget': 'احسب ما يمكنك تحمله',
      'waitlist.join': 'انضم إلى قائمة الانتظار',
      'dealership.cta': 'هل أنت وكالة سيارات؟',
      // Add more translations as needed
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
