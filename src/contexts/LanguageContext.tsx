
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
      'speed.tagline.a': "Skip 3-week bank waits - Get priority access to 1-minute approvals",
      'speed.tagline.b': "Be first for Saudi's fastest auto financing - Approval in <5 mins",
      'speed.tagline.c': "23 hours saved vs traditional loans - Join exclusive waitlist",
      
      // Offer Optimization Hypothesis Messages
      'offer.tagline.a': "We negotiate with 12 banks so you don't have to",
      'offer.tagline.b': "Guaranteed better rates than Abdul Latif Jameel & Al Rajhi",
      'offer.tagline.c': "Custom-matched deals based on your salary profile",
      
      // Affordability Positioning Hypothesis Messages
      'budget.tagline.a': "Drive your dream car without breaking your salary",
      'budget.tagline.b': "Find cars matching your 15,000-25,000 SAR budget",
      'budget.tagline.c': "81% of members find affordable options they didn't know existed",
      
      // Common translations
      'waitlist.join': 'Get on the Waitlist',
      'dealership.cta': 'Are you a dealership?',
    },
    ar: {
      // Speed (Time Sensitivity) Hypothesis Messages
      'speed.tagline.a': "تخطى فترات انتظار البنوك التي تستغرق 3 أسابيع - احصل على وصول مميز للموافقات في دقيقة واحدة",
      'speed.tagline.b': "كن أول من يحصل على أسرع تمويل للسيارات في السعودية - موافقة في أقل من 5 دقائق",
      'speed.tagline.c': "توفير 23 ساعة مقارنة بالقروض التقليدية - انضم إلى قائمة الانتظار الحصرية",
      
      // Offer Optimization Hypothesis Messages
      'offer.tagline.a': "نحن نتفاوض مع 12 بنكًا حتى لا تضطر إلى ذلك",
      'offer.tagline.b': "أسعار مضمونة أفضل من عبداللطيف جميل والراجحي",
      'offer.tagline.c': "صفقات مخصصة بناءً على ملف راتبك",
      
      // Affordability Positioning Hypothesis Messages
      'budget.tagline.a': "قد سيارة أحلامك دون كسر ميزانية راتبك",
      'budget.tagline.b': "ابحث عن سيارات تناسب ميزانيتك من 15,000-25,000 ريال سعودي",
      'budget.tagline.c': "81% من الأعضاء يجدون خيارات ميسورة لم يكونوا يعرفون بوجودها",
      
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
