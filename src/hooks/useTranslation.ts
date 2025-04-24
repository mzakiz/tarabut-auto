
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef } from 'react';
// Dynamic imports to force reloading of translation files
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

export const useTranslation = () => {
  const { language, isChangingLanguage } = useLanguage();
  const translationVersion = useRef(Date.now());
  
  // Update translation version when language changes
  useEffect(() => {
    translationVersion.current = Date.now();
  }, [language]);
  
  // Create a new translations object each time to prevent caching
  const translations = {
    en: enTranslations,
    ar: arTranslations
  };
  
  const t = (key: string): string => {
    // Make sure we have translations for this language
    if (!translations[language]) {
      console.warn(`No translations found for language: ${language}`);
      return key;
    }
    
    // Check if the key exists in the translations
    const parts = key.split('.');
    let current: any = translations[language];
    
    for (const part of parts) {
      if (current[part] === undefined) {
        console.warn(`Translation key not found: ${key} in language: ${language}`);
        return key;
      }
      current = current[part];
    }
    
    // Return the translation value if it's a string
    if (typeof current === 'string') {
      return current;
    }
    
    console.warn(`Translation value is not a string for key: ${key} in language: ${language}`);
    return key;
  };
  
  return { t, language, isChangingLanguage };
};
