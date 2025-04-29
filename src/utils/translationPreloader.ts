
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
  initialized: true, // Set to true by default to prevent initialization issues
  ready: true // Also set to true to indicate translations are always ready
};

// Store version to track changes for component re-renders
let translationVersion = Date.now();

/**
 * Force preload translations early
 * Call this as early as possible in the application lifecycle
 */
export const preloadAllTranslations = (): void => {
  try {
    console.log('[TranslationPreloader] Forced preload of all translations');
    
    // Log the number of translation keys loaded
    console.log(`[TranslationPreloader] EN keys: ${Object.keys(enTranslations).length}`);
    console.log(`[TranslationPreloader] AR keys: ${Object.keys(arTranslations).length}`);
    
    // Sample important keys to verify they're loaded
    console.log(`[TranslationPreloader] Sample EN: ${enTranslations['confirmation.title']}`);
    console.log(`[TranslationPreloader] Sample AR: ${arTranslations['confirmation.title']}`);
    
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
 * This should be called as early as possible in the application lifecycle
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
  // Ensure translations are initialized
  if (!LOADING_STATUS.initialized) {
    initializeTranslations();
  }
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
  // Ensure translations are initialized
  if (!LOADING_STATUS.initialized) {
    initializeTranslations();
  }
  
  try {
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
    console.warn(`[TranslationPreloader] Missing translation key: ${key} in language: ${language}`);
    return fallback;
  } catch (error) {
    console.error(`[TranslationPreloader] Error retrieving translation for key: ${key}`, error);
    return fallback;
  }
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

/**
 * Store translations in sessionStorage to ensure they persist across page loads
 * This is particularly important for the waitlist flow
 */
export const storeTranslationsInSession = (): void => {
  try {
    sessionStorage.setItem('en_translations', JSON.stringify(enTranslations));
    sessionStorage.setItem('ar_translations', JSON.stringify(arTranslations));
    sessionStorage.setItem('translations_timestamp', Date.now().toString());
    console.log('[TranslationPreloader] Stored translations in sessionStorage');
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
    
    console.log('[TranslationPreloader] Retrieved translations from sessionStorage');
    return true;
  } catch (error) {
    console.error('[TranslationPreloader] Error retrieving translations from sessionStorage:', error);
    return false;
  }
};

// Export the translation data directly
export const enTranslationData = enTranslations;
export const arTranslationData = arTranslations;
