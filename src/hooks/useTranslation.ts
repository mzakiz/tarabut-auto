
import { useLanguage } from '@/contexts/LanguageContext';
// Dynamic imports to force reloading of translation files
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  // Create a new translations object each time to prevent caching
  const translations = {
    en: { ...enTranslations },
    ar: { ...arTranslations }
  };
  
  const t = (key: string): string => {
    // Make sure we have translations for this language
    if (!translations[language]) {
      console.warn(`No translations found for language: ${language}`);
      return key;
    }
    
    // Check if the key exists in the translations
    if (!translations[language][key]) {
      console.warn(`Translation key not found: ${key} in language: ${language}`);
      return key;
    }
    
    // Add version timestamp to help with debugging
    const translationValue = translations[language][key];
    console.debug(`[Translation] ${key} => ${translationValue} (${new Date().toISOString()})`);
    
    return translationValue;
  };
  
  return { t, language };
};
