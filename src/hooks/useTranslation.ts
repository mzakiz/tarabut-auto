
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { getTranslationValue, getTranslationVersion, refreshTranslationVersion } from '@/utils/translationPreloader';

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
  
  // Dealership related
  'dealership.registration': 'Dealership Registration',
  'dealership.registration.subtitle': 'Register your dealership with Tarabut Auto',
  'dealership.contact.name': 'Contact Person',
  'dealership.name': 'Dealership Name',
  'dealership.email': 'Email Address',
  'dealership.phone': 'Phone Number',
  'dealership.submit': 'Register Dealership',
  'form.placeholder.contact': 'Full Name',
  'form.placeholder.dealership': 'Dealership Name',
  'form.placeholder.business.email': 'Work Email Address',
  'form.validation.work.email': 'Please use your work email address',
  'form.validation.phone': 'Phone number must be 9 digits',
  'back': 'Back',
  'back.home': 'Return to Home Page',
  
  // Confirmation page specific fallbacks
  'confirmation.title': 'Congratulations!',
  'confirmation.subtitle': 'You\'ve been added to our exclusive waitlist',
  'confirmation.position_message': 'Your position in waitlist: #',
  'confirmation.referral_title': 'Share Your Referral Code',
  'confirmation.referral_description': 'Share with friends to move up the waitlist and get exclusive rewards',
  'confirmation.copy': 'Copy',
  'confirmation.share': 'Share',
  'confirmation.points_title': 'Your Waitlist Points',
  'confirmation.points_description': 'Earn more points by referring friends to increase your position on the waitlist',
  'confirmation.points': 'Points',
  'loading': 'Loading...'
};

/**
 * Custom hook for translations with improved performance
 */
export const useTranslation = () => {
  const { language, isChangingLanguage } = useLanguage();
  const [version, setVersion] = useState(() => getTranslationVersion());
  const missingKeys = useRef(new Set<string>());
  
  // Force re-render when language changes
  useEffect(() => {
    // Reset missing keys tracker when language changes
    missingKeys.current = new Set();
    
    // Update version to force re-render
    setVersion(refreshTranslationVersion());
  }, [language, isChangingLanguage]);
  
  /**
   * Get translation for a key
   */
  const t = (key: string): string => {
    if (!key || typeof key !== 'string') {
      console.error('[useTranslation] Invalid translation key:', key);
      return 'Invalid Key';
    }

    try {
      const translationValue = getTranslationValue(language as 'en' | 'ar', key, '');
      
      if (translationValue) {
        return translationValue;
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
  
  return { 
    t, 
    language,
    isChangingLanguage,
    refreshTranslations: () => setVersion(refreshTranslationVersion())
  };
};
