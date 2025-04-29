import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';
// Import the improved translation utilities
import { 
  preloadTranslations, 
  getTranslationValue, 
  areTranslationsPreloaded,
  forceRefreshTranslations 
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
  
  // Features section
  'features.title': 'Exceptional Features',
  'features.subtitle': 'Toyota Camry combines luxury, performance, and efficiency in a perfect package for Saudi roads',
  'feature.fuel.title': 'Fuel Efficiency',
  'feature.fuel.description': 'Best-in-class fuel economy of 18.3 km/liter for fewer stops at the pump',
  'feature.safety.title': 'Safety First',
  'feature.safety.description': 'Toyota Safety System with pre-collision and lane departure alert',
  'feature.performance.title': 'Dynamic Performance',
  'feature.performance.description': 'Powerful 2.5L engine delivers 203 horsepower for quick acceleration',
  'feature.tech.title': 'Smart Technology',
  'feature.tech.description': '9" touchscreen with Apple CarPlay and Android Auto support',
  'feature.interior.title': 'Luxurious Interior',
  'feature.interior.description': 'Leather seats with heating and ventilation for year-round comfort',
  'feature.transmission.title': 'Smooth Transmission',
  'feature.transmission.description': '8-speed automatic transmission for a smooth driving experience',

  // Specifications
  'specs.title': 'Technical Specifications',
  'specs.subtitle': 'Toyota Camry is equipped with advanced technology and engineering excellence',
  
  // Car categories
  'car.specs': 'Technical Specifications',
  'car.specs.description': 'Toyota Camry is equipped with advanced technology and engineering excellence',
  'car.engine': 'Engine Specifications',
  'car.dimensions': 'Dimensions',
  'car.comfort': 'Comfort & Technology',
  'car.safety': 'Safety Features',

  // Footer
  'footer.brand': 'Tarabut Auto',
  'footer.experience': 'Experience Shariah-compliant car financing in Saudi Arabia with options tailored to your needs.',
  'footer.copyright': 'All Rights Reserved.',
  'footer.home': 'Home',
  'footer.about': 'About Tarabut'
};

export const useTranslation = () => {
  const { language, isChangingLanguage } = useLanguage();
  const translationVersion = useRef(Date.now());
  const [missingKeys, setMissingKeys] = useState<Set<string>>(new Set());
  const [translationsLoaded, setTranslationsLoaded] = useState(areTranslationsPreloaded());
  
  // Ensure translations are preloaded on mount and when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        console.log(`[useTranslation] Loading translations for ${language}`);
        
        // Force refresh translations if language changes
        const translations = isChangingLanguage 
          ? forceRefreshTranslations() 
          : preloadTranslations();
          
        console.log(`[useTranslation] Translations loaded for ${language}: ${Object.keys(translations[language as 'en' | 'ar']).length} keys`);
        
        // Test a few critical confirmation page keys to ensure they're loaded
        console.log(`Test key 'confirmation.title' = ${getTranslationValue(language as 'en' | 'ar', 'confirmation.title')}`);
        console.log(`Test key 'confirmation.subtitle' = ${getTranslationValue(language as 'en' | 'ar', 'confirmation.subtitle')}`);
        
        setTranslationsLoaded(true);
        translationVersion.current = Date.now();
        setMissingKeys(new Set());
      } catch (error) {
        console.error('[useTranslation] Error loading translations:', error);
      }
    };
    
    loadTranslations();
  }, [language, isChangingLanguage]);
  
  const t = (key: string): string => {
    if (!key || typeof key !== 'string') {
      console.error('[useTranslation] Invalid translation key:', key);
      return 'Invalid Key';
    }

    try {
      // Use direct access to get translation value for better performance
      const translationValue = getTranslationValue(language as 'en' | 'ar', key, '');
      
      if (translationValue) {
        return translationValue;
      }
      
      // If no translation value was found, try to get a fallback
      if (DEFAULT_FALLBACKS[key]) {
        return DEFAULT_FALLBACKS[key];
      }
      
      // Log missing keys
      if (!missingKeys.has(key)) {
        console.warn(`[useTranslation] Missing translation for key: ${key} in language: ${language}`);
        setMissingKeys(prev => new Set([...prev, key]));
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
    translationsLoaded,
    refreshTranslations: () => {
      forceRefreshTranslations();
      translationVersion.current = Date.now();
    }
  };
};
