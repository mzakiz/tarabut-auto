
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';
// Dynamic imports to force reloading of translation files
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

export const useTranslation = () => {
  const { language, isChangingLanguage } = useLanguage();
  const translationVersion = useRef(Date.now());
  const [missingKeys, setMissingKeys] = useState<Set<string>>(new Set());
  
  // Update translation version when language changes
  useEffect(() => {
    translationVersion.current = Date.now();
    setMissingKeys(new Set());
  }, [language]);
  
  // Create a new translations object each time to prevent caching
  const translations = {
    en: enTranslations,
    ar: arTranslations
  };
  
  const t = (key: string): string => {
    // Make sure we have translations for this language
    if (!translations[language]) {
      if (!missingKeys.has(`language_${language}`)) {
        console.error(`No translations found for language: ${language}`);
        setMissingKeys(prev => new Set([...prev, `language_${language}`]));
      }
      return key;
    }
    
    // Check if the key exists in the translations
    if (!translations[language][key]) {
      if (!missingKeys.has(key)) {
        console.warn(`Translation key not found: ${key} in language: ${language}`);
        setMissingKeys(prev => new Set([...prev, key]));
      }
      // Return the key as fallback
      return key;
    }
    
    // Return the translation value
    return translations[language][key];
  };
  
  return { t, language, isChangingLanguage };
};
