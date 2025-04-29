
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

// Global translation store with strict typing
type TranslationLanguages = 'en' | 'ar';
type TranslationData = Record<string, string>;
type TranslationsStore = Record<TranslationLanguages, TranslationData>;

// Initialize with static translations that are bundled with the app
const GLOBAL_TRANSLATIONS: TranslationsStore = {
  en: enTranslations,
  ar: arTranslations
};

// Load status tracking to prevent repeated loading attempts
const LOADING_STATUS = {
  initialized: true, // Set to true by default for immediate use
  ready: true // Also set to true to indicate translations are always ready
};

// Store version to track changes for component re-renders
let translationVersion = Date.now();

/**
 * Force preload all translations
 * This function should be called as early and as often as possible
 */
export const preloadAllTranslations = (): void => {
  try {
    // Log the number of translation keys loaded to verify they're properly loaded
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[TranslationPreloader] EN keys: ${Object.keys(enTranslations).length}`);
      console.log(`[TranslationPreloader] AR keys: ${Object.keys(arTranslations).length}`);
      
      // Sample important keys to verify they're loaded properly
      console.log(`[TranslationPreloader] Confirmation Title EN: ${enTranslations['confirmation.title']}`);
      console.log(`[TranslationPreloader] Confirmation Title AR: ${arTranslations['confirmation.title']}`);
      console.log(`[TranslationPreloader] Referral Title EN: ${enTranslations['confirmation.referral_title']}`);
      console.log(`[TranslationPreloader] Referral Title AR: ${arTranslations['confirmation.referral_title']}`);
    }
    
    // Double check that the locales are properly loaded
    if (!enTranslations['confirmation.title'] || !arTranslations['confirmation.title']) {
      console.error('[TranslationPreloader] Critical translations missing, attempting to recover');
      // Force a recovery attempt by reinitializing
      GLOBAL_TRANSLATIONS.en = {...enTranslations};
      GLOBAL_TRANSLATIONS.ar = {...arTranslations};
    }
    
    LOADING_STATUS.initialized = true;
    LOADING_STATUS.ready = true;
    translationVersion = Date.now();
    
    // Always store in session storage for persistence
    storeTranslationsInSession();
  } catch (error) {
    console.error('[TranslationPreloader] Error during forced preload:', error);
  }
};

/**
 * Initialize translations synchronously
 */
export const initializeTranslations = (): void => {
  if (LOADING_STATUS.initialized) return;
  
  console.log('[TranslationPreloader] Initializing translations');
  preloadAllTranslations();
  
  // Force a version update to trigger re-renders
  translationVersion = Date.now();
};

/**
 * Get the cached translations without any additional loading
 */
export const getTranslations = (): TranslationsStore => {
  return GLOBAL_TRANSLATIONS;
};

/**
 * Check if translations are ready to use
 */
export const areTranslationsReady = (): boolean => {
  return LOADING_STATUS.ready;
};

/**
 * Get a specific translation value with multi-level fallbacks
 */
export const getTranslationValue = (
  language: TranslationLanguages, 
  key: string,
  fallback: string = key
): string => {
  try {
    // Get the translations for the specified language
    const translations = GLOBAL_TRANSLATIONS[language];
    
    // If translations object is undefined or empty, try to recover
    if (!translations || Object.keys(translations).length === 0) {
      console.error(`[TranslationPreloader] No translations found for language: ${language}, attempting recovery`);
      // Force recovery
      GLOBAL_TRANSLATIONS.en = {...enTranslations};
      GLOBAL_TRANSLATIONS.ar = {...arTranslations};
    }
    
    // Get the translated value
    const value = translations[key];
    
    // Return the value if found
    if (value) {
      return value;
    }
    
    // Try English as fallback for Arabic
    if (language === 'ar' && GLOBAL_TRANSLATIONS.en[key]) {
      return GLOBAL_TRANSLATIONS.en[key];
    }
    
    // Return fallback if no translation found
    return fallback;
  } catch (error) {
    console.error(`[TranslationPreloader] Error retrieving translation for key: ${key}`, error);
    return fallback;
  }
};

/**
 * Get the current translation version
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

/**
 * Store translations in sessionStorage to ensure they persist across page loads
 */
export const storeTranslationsInSession = (): void => {
  try {
    sessionStorage.setItem('en_translations', JSON.stringify(enTranslations));
    sessionStorage.setItem('ar_translations', JSON.stringify(arTranslations));
    sessionStorage.setItem('translations_timestamp', Date.now().toString());
    
    // Verify critical keys were stored correctly
    const storedEn = sessionStorage.getItem('en_translations');
    if (storedEn) {
      const parsed = JSON.parse(storedEn);
      console.log(`[TranslationPreloader] Verified storage - confirmation.title: ${parsed['confirmation.title']}`);
    }
  } catch (error) {
    console.error('[TranslationPreloader] Error storing translations in sessionStorage:', error);
  }
};

/**
 * Retrieve translations from sessionStorage if available
 */
export const getTranslationsFromSession = (): boolean => {
  try {
    const timestamp = sessionStorage.getItem('translations_timestamp');
    if (!timestamp) return false;
    
    // Don't use translations that are older than 5 minutes
    if (Date.now() - parseInt(timestamp, 10) > 5 * 60 * 1000) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[TranslationPreloader] Error retrieving translations from sessionStorage:', error);
    return false;
  }
};

// Export the translation data directly for direct access
export const enTranslationData = enTranslations;
export const arTranslationData = arTranslations;
