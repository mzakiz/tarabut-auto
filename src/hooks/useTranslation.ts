
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  getTranslationValue,
  getTranslationVersion,
  refreshTranslationVersion,
  initializeTranslations,
  areTranslationsReady,
  preloadAllTranslations,
  storeTranslationsInSession,
  getTranslationsFromSession,
  enTranslationData,
  arTranslationData
} from '@/utils/translationPreloader';

// Enhanced default fallbacks for common UI elements to prevent showing raw keys
const DEFAULT_FALLBACKS: Record<string, string> = {
  // Waitlist related
  'waitlist.title': 'Join the Waitlist',
  'waitlist.description': 'Be the first to access Shariah-compliant auto financing',
  'form.name': 'Name',
  'form.email': 'Email',
  'form.phone': 'Phone Number',
  'form.referral': 'Referral Code (Optional)',
  'form.placeholder.name': 'Full Name',
  'form.placeholder.email': 'Email Address',
  'form.placeholder.phone': '5XXXXXXXX',
  'form.placeholder.referral': 'Enter referral code',
  
  // Confirmation page specific fallbacks
  'confirmation.title': 'Congratulations!',
  'confirmation.subtitle': 'You\'ve been added to our exclusive waitlist',
  'confirmation.position_message': 'Your position in waitlist: #',
  'confirmation.referral_title': 'Share Your Referral Code',
  'confirmation.referral_description': 'Share with friends to move up the waitlist and get exclusive rewards',
  'confirmation.share_message': 'Join Tarabut Auto\'s waitlist using my referral code:',
  'confirmation.copy': 'Copy',
  'confirmation.share': 'Share',
  'confirmation.points_title': 'Your Waitlist Points',
  'confirmation.points_description': 'Earn more points by referring friends to increase your position on the waitlist',
  'confirmation.points': 'Points',
  'back.home': 'Return to Home Page'
};

// Force immediate translation initialization when this module loads
preloadAllTranslations();

/**
 * Custom hook for translations with improved performance and reliability
 */
export const useTranslation = () => {
  const { language, isChangingLanguage } = useLanguage();
  const [isReady, setIsReady] = useState(() => {
    const ready = areTranslationsReady();
    if (!ready) {
      // Try to initialize translations immediately
      initializeTranslations();
    }
    return ready;
  });
  const [version, setVersion] = useState(() => getTranslationVersion());
  const missingKeys = useRef(new Set<string>());
  
  // Direct access to translation data
  const translationData = language === 'ar' ? arTranslationData : enTranslationData;
  
  // Load translations as early as possible 
  useEffect(() => {
    if (!isReady) {
      console.log('[useTranslation] Forcing translation initialization');
      preloadAllTranslations();
      storeTranslationsInSession();
      setIsReady(true);
      setVersion(getTranslationVersion());
    }
    
    // Force preload on every language change
    preloadAllTranslations();
  }, [isReady]);
  
  // Store translations in session storage for persistence across page loads
  useEffect(() => {
    storeTranslationsInSession();
  }, [language]);
  
  // Force re-render when language changes
  useEffect(() => {
    // Reset missing keys tracker when language changes
    missingKeys.current = new Set();
    
    // Update version to force re-render
    setVersion(refreshTranslationVersion());
    
    // Preload translations again on language change
    preloadAllTranslations();
  }, [language, isChangingLanguage]);
  
  /**
   * Get translation for a key with improved error handling
   */
  const t = useMemo(() => {
    return (key: string): string => {
      if (!key || typeof key !== 'string') {
        console.error('[useTranslation] Invalid translation key:', key);
        return 'Invalid Key';
      }

      try {
        // First try to get the translation from the main function
        const translationValue = getTranslationValue(language as 'en' | 'ar', key, '');
        
        if (translationValue) {
          return translationValue;
        }
        
        // If that fails, try direct access to the translation data
        if (translationData[key]) {
          return translationData[key];
        }
        
        // If no translation value was found, try to get a fallback
        if (DEFAULT_FALLBACKS[key]) {
          return DEFAULT_FALLBACKS[key];
        }
        
        // Log missing keys only once
        if (!missingKeys.current.has(key)) {
          console.warn(`[useTranslation] Missing translation for key: ${key} in language: ${language}`);
          missingKeys.current.add(key);
        }
        
        // Return the key as fallback
        return key;
      } catch (error) {
        console.error(`[useTranslation] Error retrieving translation for key: ${key}`, error);
        return DEFAULT_FALLBACKS[key] || key;
      }
    };
  }, [language, version, translationData]);
  
  // Force translations to load on every render
  preloadAllTranslations();
  
  return { 
    t, 
    language,
    isChangingLanguage,
    isTranslationReady: isReady,
    refreshTranslations: () => {
      preloadAllTranslations();
      storeTranslationsInSession();
      setVersion(refreshTranslationVersion());
    }
  };
};
