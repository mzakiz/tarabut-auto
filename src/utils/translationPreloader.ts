
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

// This function forces webpack/vite to load the translation files
export const preloadTranslations = () => {
  // Log the number of translation keys to ensure they're loaded
  console.log(`Preloaded translations - EN: ${Object.keys(enTranslations).length} keys, AR: ${Object.keys(arTranslations).length} keys`);
  
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
  
  // Log a few critical keys to verify they exist
  criticalKeys.forEach(key => {
    if (!enTranslations[key as keyof typeof enTranslations]) {
      console.error(`Missing critical English translation key: ${key}`);
    }
    if (!arTranslations[key as keyof typeof arTranslations]) {
      console.error(`Missing critical Arabic translation key: ${key}`);
    }
  });
  
  return {
    en: enTranslations,
    ar: arTranslations
  };
};

// Export a function to get a translation value directly
export const getTranslationValue = (
  language: 'en' | 'ar',
  key: string,
  fallback: string = key
): string => {
  const translations = language === 'en' ? enTranslations : arTranslations;
  return (translations as Record<string, string>)[key] || fallback;
};
