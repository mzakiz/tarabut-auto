
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

// Cache the translations to prevent repeated imports
let cachedTranslations: {
  en: Record<string, string>;
  ar: Record<string, string>;
} | null = null;

// This function forces webpack/vite to load the translation files
export const preloadTranslations = () => {
  // If we already have cached translations, return them
  if (cachedTranslations) {
    console.log('Using cached translations');
    return cachedTranslations;
  }
  
  // Log the number of translation keys to ensure they're loaded
  console.log(`Preloading translations - EN: ${Object.keys(enTranslations).length} keys, AR: ${Object.keys(arTranslations).length} keys`);
  
  // Force access to critical confirmation page keys
  const criticalKeys = [
    'confirmation.title',
    'confirmation.subtitle',
    'confirmation.position_message',
    'confirmation.referral_title',
    'confirmation.referral_description',
    'confirmation.copy',
    'confirmation.share',
    'confirmation.points_title',
    'confirmation.points_description',
    'confirmation.points',
    'back.home'
  ];
  
  // Log each critical key for debugging
  criticalKeys.forEach(key => {
    // Check if the key exists in English translations
    const enValue = (enTranslations as Record<string, string>)[key];
    const arValue = (arTranslations as Record<string, string>)[key];
    
    console.log(`EN '${key}' = ${enValue || 'MISSING!'}`);
    console.log(`AR '${key}' = ${arValue || 'MISSING!'}`);
    
    if (!enValue) {
      console.error(`Missing critical English translation key: ${key}`);
    }
    if (!arValue) {
      console.error(`Missing critical Arabic translation key: ${key}`);
    }
  });
  
  // Cache the translations
  cachedTranslations = {
    en: enTranslations,
    ar: arTranslations
  };
  
  return cachedTranslations;
};

// Preload translations immediately when this file is imported
preloadTranslations();

// Export a function to get a translation value directly
export const getTranslationValue = (
  language: 'en' | 'ar',
  key: string,
  fallback: string = key
): string => {
  // Ensure translations are loaded
  const translations = preloadTranslations();
  
  // Get the translation value
  const value = (translations[language] as Record<string, string>)[key];
  
  // If we have a value, return it
  if (value) {
    return value;
  }
  
  // If we're in Arabic and missing the key, try English
  if (language === 'ar' && translations.en[key]) {
    console.log(`Using English fallback for Arabic key: ${key}`);
    return translations.en[key];
  }
  
  // Return fallback
  return fallback;
};

// Export the raw translation objects for direct access
export const getTranslations = () => {
  return preloadTranslations();
};
