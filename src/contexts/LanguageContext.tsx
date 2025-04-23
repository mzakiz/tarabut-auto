import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with English by default
  const [language, setLanguage] = useState<Language>('en');

  const translations = {
    en: {
      // Speed (Time Sensitivity) Hypothesis Messages
      'speed.tagline': "Skip 3-week bank waits for financing",
      'speed.subtitle': "Get exclusive access to 1-minute approvals",
      
      // Offer Optimization Hypothesis Messages
      'offer.tagline': "We negotiate with 12 banks so you don't have to",
      'offer.subtitle': "Experience the Kingdom's best-selling sedan from SAR 1,299/month",
      
      // Affordability Positioning Hypothesis Messages
      'budget.tagline': "Drive your dream car without breaking your salary",
      'budget.subtitle': "Experience the Kingdom's best-selling sedan from SAR 1,299/month",
      
      // Common translations
      'waitlist.join': 'Get on the waitlist',
      'dealership.cta': 'Are you a dealership?',
    },
    ar: {
      // Speed (Time Sensitivity) Hypothesis Messages
      'speed.tagline': "تخطى فترات انتظار البنوك لمدة 3 أسابيع للتمويل",
      'speed.subtitle': "احصل على وصول حصري للموافقات في دقيقة واحدة",
      
      // Offer Optimization Hypothesis Messages
      'offer.tagline': "نحن نتفاوض مع 12 بنكًا حتى لا تضطر إلى ذلك",
      'offer.subtitle': "جرب أفضل سيدان مبيعاً في المملكة من 1,299 ريال/شهر",
      
      // Affordability Positioning Hypothesis Messages
      'budget.tagline': "قد سيارة أحلامك دون كسر ميزانية راتبك",
      'budget.subtitle': "جرب أفضل سيدان مبيعاً في المملكة من 1,299 ريال/شهر",
      
      // Common translations
      'waitlist.join': 'انضم إلى قائمة الانتظار',
      'dealership.cta': 'هل أنت وكالة سيارات؟',
    }
  };

  const t = (key: string): string => {
    // @ts-ignore - We know the translations object has these keys
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
