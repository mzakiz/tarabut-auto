
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
    // Always ensure the translations are loaded from the source files
    GLOBAL_TRANSLATIONS.en = {...enTranslations};
    GLOBAL_TRANSLATIONS.ar = {...arTranslations};
    
    // Log the number of translation keys loaded to verify they're properly loaded
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[TranslationPreloader] EN keys: ${Object.keys(GLOBAL_TRANSLATIONS.en).length}`);
      console.log(`[TranslationPreloader] AR keys: ${Object.keys(GLOBAL_TRANSLATIONS.ar).length}`);
      
      // Sample important keys to verify they're loaded properly
      console.log(`[TranslationPreloader] Calculator Title EN: ${GLOBAL_TRANSLATIONS.en['calculator.title']}`);
      console.log(`[TranslationPreloader] Calculator Title AR: ${GLOBAL_TRANSLATIONS.ar['calculator.title']}`);
    }
    
    // Double check that the locales are properly loaded
    if (!GLOBAL_TRANSLATIONS.en['calculator.title'] || !GLOBAL_TRANSLATIONS.ar['calculator.title']) {
      console.error('[TranslationPreloader] Critical calculator translations missing, attempting to recover');
      // Force a recovery by setting specific keys directly
      GLOBAL_TRANSLATIONS.en['calculator.title'] = "Calculate Your Monthly Payment";
      GLOBAL_TRANSLATIONS.ar['calculator.title'] = "احسب قسطك الشهري";
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
      // Force recovery by reloading from source
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
    
    // Special hardcoded fallbacks for critical calculator keys
    if (key === 'calculator.title') {
      return language === 'ar' ? "احسب قسطك الشهري" : "Calculate Your Monthly Payment";
    }
    
    if (key === 'calculator.subtitle') {
      return language === 'ar' ? "شوف إذا تقدر تدبر قسط سيارة أحلامك!" : "See if your dream car fits your budget!";
    }
    
    if (key === 'calculator.customize') {
      return language === 'ar' ? "عدّل قسطك الشهري" : "Customize Your Monthly Payment";
    }
    
    if (key === 'calculator.monthly.payment') {
      return language === 'ar' ? "القسط الشهري" : "Monthly Payment";
    }
    
    if (key === 'calculator.loan.amount') {
      return language === 'ar' ? "مبلغ التمويل: " : "Loan Amount: ";
    }
    
    if (key === 'calculator.loan.tenor') {
      return language === 'ar' ? "مدة التمويل: " : "Loan Term: ";
    }
    
    if (key === 'calculator.months') {
      return language === 'ar' ? "شهر" : "months";
    }
    
    if (key === 'calculator.cta.question') {
      return language === 'ar' ? "عجبك العرض؟" : "Like what you see?";
    }
    
    if (key === 'calculator.cta.action') {
      return language === 'ar' ? "انضم لقائمة الانتظار" : "Join the Waitlist";
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
    sessionStorage.setItem('en_translations', JSON.stringify(GLOBAL_TRANSLATIONS.en));
    sessionStorage.setItem('ar_translations', JSON.stringify(GLOBAL_TRANSLATIONS.ar));
    sessionStorage.setItem('translations_timestamp', Date.now().toString());
    
    // Verify critical keys were stored correctly
    const storedEn = sessionStorage.getItem('en_translations');
    if (storedEn) {
      const parsed = JSON.parse(storedEn);
      console.log(`[TranslationPreloader] Verified storage - calculator.title: ${parsed['calculator.title']}`);
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
    
    // Try to load translations from session storage
    const enStored = sessionStorage.getItem('en_translations');
    const arStored = sessionStorage.getItem('ar_translations');
    
    if (enStored && arStored) {
      try {
        const parsedEn = JSON.parse(enStored);
        const parsedAr = JSON.parse(arStored);
        
        // Only use session storage translations if they contain critical keys
        if (parsedEn['calculator.title'] && parsedAr['calculator.title']) {
          GLOBAL_TRANSLATIONS.en = parsedEn;
          GLOBAL_TRANSLATIONS.ar = parsedAr;
          return true;
        }
      } catch (e) {
        console.error('[TranslationPreloader] Error parsing session storage translations', e);
      }
    }
    
    return false;
  } catch (error) {
    console.error('[TranslationPreloader] Error retrieving translations from sessionStorage:', error);
    return false;
  }
};

// Export the translation data directly for direct access
export const enTranslationData = enTranslations;
export const arTranslationData = arTranslations;
