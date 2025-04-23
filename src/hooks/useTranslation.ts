
import { useLanguage } from '@/contexts/LanguageContext';
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: enTranslations,
    ar: arTranslations
  };
  
  const t = (key: string): string => {
    // @ts-ignore - We know the translations object has these keys
    return translations[language][key] || key;
  };
  
  return { t, language };
};
