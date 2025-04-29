
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

// Global translation store - this ensures translations are loaded once and stay available
const GLOBAL_TRANSLATIONS = {
  en: enTranslations,
  ar: arTranslations
};

// Store version to track changes
let translationVersion = Date.now();

/**
 * Get the cached translations without any additional loading
 * This always returns immediately with the translations
 */
export const getTranslations = () => {
  return GLOBAL_TRANSLATIONS;
};

/**
 * Get a specific translation value with fallbacks
 */
export const getTranslationValue = (
  language: 'en' | 'ar', 
  key: string,
  fallback: string = key
): string => {
  // Get the translated value
  const value = GLOBAL_TRANSLATIONS[language][key];
  
  // Return the value if found
  if (value) {
    return value;
  }
  
  // Try English as fallback for Arabic
  if (language === 'ar' && GLOBAL_TRANSLATIONS.en[key]) {
    return GLOBAL_TRANSLATIONS.en[key];
  }
  
  // Return fallback if no translation found
  console.warn(`Missing translation key: ${key} in language: ${language}`);
  return fallback;
};

/**
 * Get the current translation version
 * Useful for forcing re-renders when translations change
 */
export const getTranslationVersion = (): number => {
  return translationVersion;
};

/**
 * Force a refresh of the translation version to trigger re-renders
 */
export const refreshTranslationVersion = (): number => {
  translationVersion = Date.now();
  return translationVersion;
};

// Export the translation data directly
export const enTranslationData = enTranslations;
export const arTranslationData = arTranslations;
