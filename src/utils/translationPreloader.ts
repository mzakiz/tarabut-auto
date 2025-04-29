
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

// Cache the translations to prevent repeated imports
let cachedTranslations: {
  en: Record<string, string>;
  ar: Record<string, string>;
} | null = null;

// Track if we've already preloaded translations
let translationsPreloaded = false;

// Force preload translations immediately on import
export const preloadTranslations = () => {
  // If we already have cached translations, return them
  if (cachedTranslations) {
    console.log('Using cached translations');
    return cachedTranslations;
  }
  
  console.log('Preloading translations - Initial load');
  
  // Cache the translations
  cachedTranslations = {
    en: enTranslations,
    ar: arTranslations
  };
  
  // Log the number of translation keys to ensure they're loaded
  console.log(`Translation keys loaded - EN: ${Object.keys(cachedTranslations.en).length} keys, AR: ${Object.keys(cachedTranslations.ar).length} keys`);
  
  // Mark as preloaded
  translationsPreloaded = true;
  
  return cachedTranslations;
};

// Special function to forcibly refresh translations
export const forceRefreshTranslations = () => {
  console.log('Forcing translation refresh');
  cachedTranslations = null;
  translationsPreloaded = false;
  return preloadTranslations();
};

// Check if translations are already preloaded
export const areTranslationsPreloaded = () => {
  return translationsPreloaded;
};

// Export a function to get a translation value directly with improved logging for missing keys
export const getTranslationValue = (
  language: 'en' | 'ar',
  key: string,
  fallback: string = key
): string => {
  // Ensure translations are loaded
  const translations = preloadTranslations();
  
  // Get the translation value
  const value = translations[language][key];
  
  // If we have a value, return it
  if (value) {
    return value;
  }
  
  // If we're in Arabic and missing the key, try English
  if (language === 'ar' && translations.en[key]) {
    console.log(`Using English fallback for Arabic key: ${key}`);
    return translations.en[key];
  }
  
  // Log missing translation keys
  console.warn(`Missing translation key: ${key} in language: ${language}`);
  
  // Return fallback
  return fallback;
};

// Export the raw translation objects for direct access
export const getTranslations = () => {
  return preloadTranslations();
};

// Preload translations immediately when this file is imported
preloadTranslations();
