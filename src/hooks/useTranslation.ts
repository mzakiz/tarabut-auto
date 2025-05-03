
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
  'confirmation.your.tier': 'Your Current Tier',
  'back.home': 'Return to Home Page',
  
  // Status URL fallbacks
  'waitlist.status.check': 'Check Your Waitlist Status',
  'confirmation.code.copied': 'Copied!',
  'confirmation.code.share': 'Bookmark this link to check your status later',
  
  // Tier fallbacks
  'tier.vip_access': 'VIP Access',
  'tier.early_access': 'Early Access',
  'tier.fast_track': 'Fast Track',
  'tier.standard': 'Standard',
  'tier.vip_access.points': '600+ points',
  'tier.early_access.points': '400-599 points',
  'tier.fast_track.points': '250-399 points',
  'tier.standard.points': '100-249 points',
  
  // Calculator fallbacks - expanded with explicit values
  'calculator.title': 'Calculate Your Monthly Payment',
  'calculator.subtitle': 'See if your dream car fits your budget!',
  'calculator.customize': 'Customize Your Monthly Payment',
  'calculator.monthly.payment': 'Monthly Payment',
  'calculator.loan.amount': 'Loan Amount: ',
  'calculator.loan.tenor': 'Loan Term: ',
  'calculator.months': 'months',
  'calculator.cta.question': 'Like what you see?',
  'calculator.cta.action': 'Join the Waitlist'
};

// Arabic fallbacks for critical components
const AR_FALLBACKS: Record<string, string> = {
  // Calculator Arabic fallbacks
  'calculator.title': "احسب قسطك الشهري",
  'calculator.subtitle': "شوف إذا تقدر تدبر قسط سيارة أحلامك!",
  'calculator.customize': "عدّل قسطك الشهري",
  'calculator.monthly.payment': "القسط الشهري",
  'calculator.loan.amount': "مبلغ التمويل: ",
  'calculator.loan.tenor': "مدة التمويل: ",
  'calculator.months': "شهر",
  'calculator.cta.question': "عجبك العرض؟",
  'calculator.cta.action': "انضم لقائمة الانتظار"
};

// Immediately ensure translations are initialized
initializeTranslations();
preloadAllTranslations();
storeTranslationsInSession();

/**
 * Custom hook for translations with improved performance and reliability
 */
export const useTranslation = () => {
  const { language, isChangingLanguage } = useLanguage();
  const [isReady, setIsReady] = useState(() => {
    // Force translations to be ready by preloading
    preloadAllTranslations();
    storeTranslationsInSession();
    return true;
  });
  const [version, setVersion] = useState(() => getTranslationVersion());
  const missingKeys = useRef(new Set<string>());
  
  // Direct access to translation data
  const translationData = language === 'ar' ? arTranslationData : enTranslationData;
  
  // Force preload translations on every render - this ensures they're always available
  preloadAllTranslations();
  
  // Store translations in session storage for persistence
  useEffect(() => {
    // Always force preload and store in session
    preloadAllTranslations();
    storeTranslationsInSession();
    setVersion(refreshTranslationVersion());
  }, [language]);
  
  /**
   * Get translation for a key with improved error handling and direct fallbacks
   */
  const t = useMemo(() => {
    return (key: string): string => {
      if (!key || typeof key !== 'string') {
        return 'Invalid Key';
      }

      try {
        // Check each source in order of preference
        
        // 1. Try direct access to the translation data first (fastest)
        if (translationData && translationData[key]) {
          return translationData[key];
        }
        
        // 2. Special handling for calculator keys and other critical UI elements
        if (language === 'ar' && AR_FALLBACKS[key]) {
          return AR_FALLBACKS[key];
        }
        
        // 3. Try the main translation function
        const translationValue = getTranslationValue(language as 'en' | 'ar', key, '');
        if (translationValue) {
          return translationValue;
        }
        
        // 4. Try our hardcoded fallbacks for critical UI elements
        if (DEFAULT_FALLBACKS[key]) {
          return DEFAULT_FALLBACKS[key];
        }
        
        // 5. Try English data as fallback for Arabic
        if (language === 'ar' && enTranslationData && enTranslationData[key]) {
          return enTranslationData[key];
        }
        
        // Log missing key only once
        if (!missingKeys.current.has(key)) {
          console.warn(`[useTranslation] Missing translation for key: ${key} in language: ${language}`);
          missingKeys.current.add(key);
        }
        
        // Last resort: return the key itself
        return key;
      } catch (error) {
        console.error(`[useTranslation] Error retrieving translation for key: ${key}`, error);
        return DEFAULT_FALLBACKS[key] || key;
      }
    };
  }, [language, translationData, version]);
  
  // Force translations to refresh when language changes
  useEffect(() => {
    // Reset missing keys tracker when language changes
    missingKeys.current = new Set();
    
    // Force preload multiple times with delays
    preloadAllTranslations();
    const timer1 = setTimeout(() => preloadAllTranslations(), 100);
    const timer2 = setTimeout(() => preloadAllTranslations(), 500);
    
    // Force version update to trigger re-renders
    setVersion(refreshTranslationVersion());
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [language, isChangingLanguage]);
  
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
