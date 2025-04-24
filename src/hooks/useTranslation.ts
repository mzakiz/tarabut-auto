
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';
// Dynamic imports to force reloading of translation files
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

// Enhanced default fallbacks for common UI elements to prevent showing raw keys
const DEFAULT_FALLBACKS: Record<string, string> = {
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
  'form.placeholder.phone': '5XXXXXXXX',
  'form.validation.work.email': 'Please use your work email address',
  'form.validation.phone': 'Phone number must be 9 digits',
  'back': 'Back',
  
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

  // Footer
  'footer.brand': 'Tarabut Auto',
  'footer.experience': 'Experience Shariah-compliant car financing in Saudi Arabia with options tailored to your needs.',
  'footer.copyright': 'All Rights Reserved.',
  'footer.home': 'Home',
  'footer.about': 'About Tarabut',

  // General fallbacks
  'confirmation.position.subtitle': 'Refer your friends to move up in the waitlist',
  'confirmation.your.tier': 'Your Current Tier',
  'confirmation.share.code': 'Share your referral code:',
  'confirmation.points': 'Points',
  'waitlist.tiers.title': 'Waitlist Tier Benefits'
};

export const useTranslation = () => {
  const { language, isChangingLanguage } = useLanguage();
  const translationVersion = useRef(Date.now());
  const [missingKeys, setMissingKeys] = useState<Set<string>>(new Set());
  
  // Update translation version when language changes
  useEffect(() => {
    translationVersion.current = Date.now();
    setMissingKeys(new Set());
  }, [language]);
  
  // Create a new translations object each time to prevent caching
  const translations = {
    en: enTranslations,
    ar: arTranslations
  };

  // Add fallback to English if Arabic translation is missing
  const getFallbackTranslation = (key: string): string | null => {
    // First check if we have a default fallback
    if (DEFAULT_FALLBACKS[key]) {
      console.warn(`Using default fallback for missing translation: ${key}`);
      return DEFAULT_FALLBACKS[key];
    }
    
    // Then check if we can fall back to English for Arabic
    if (language === 'ar' && translations['en'][key]) {
      console.warn(`Using English fallback for missing Arabic translation: ${key}`);
      return translations['en'][key];
    }
    
    return null;
  };
  
  const t = (key: string): string => {
    if (!key || typeof key !== 'string') {
      console.error('Invalid translation key:', key);
      return 'Invalid Key';
    }

    // Make sure we have translations for this language
    if (!translations[language]) {
      if (!missingKeys.has(`language_${language}`)) {
        console.error(`No translations found for language: ${language}`);
        setMissingKeys(prev => new Set([...prev, `language_${language}`]));
      }
      // Fall back to English if language not found
      return translations['en'][key] || DEFAULT_FALLBACKS[key] || key;
    }
    
    // Check if the key exists in the translations
    if (!translations[language][key]) {
      // Try to get fallback translation
      const fallbackTranslation = getFallbackTranslation(key);
      if (fallbackTranslation) return fallbackTranslation;

      if (!missingKeys.has(key)) {
        console.warn(`Translation key not found: ${key} in language: ${language}`);
        setMissingKeys(prev => new Set([...prev, key]));
      }
      
      // Return the key as fallback
      return DEFAULT_FALLBACKS[key] || key;
    }
    
    // Return the translation value
    return translations[language][key];
  };
  
  return { t, language, isChangingLanguage };
};
