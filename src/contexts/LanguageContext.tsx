
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  refreshTranslations: () => void;
  isChangingLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with English by default, or use URL path to determine language
  const [language, setLanguageState] = useState<Language>(() => {
    // Check URL path for language indicator
    const path = window.location.pathname;
    if (path.includes('/ar/')) return 'ar';
    return 'en';
  });
  
  // Track if we're currently handling a language change to prevent loops
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  
  // Add a ref to track the last requested language to prevent redundant changes
  const lastRequestedLanguage = useRef<Language | null>(null);
  
  // Function to force refresh translations
  const refreshTranslations = () => {
    // Only refresh if we're not already changing language
    if (isChangingLanguage) return;
    
    // Create a small state change to force re-renders
    const currentLang = language;
    setLanguageState('en' as Language);
    setTimeout(() => setLanguageState(currentLang), 10);
    
    console.log('[LanguageContext] Refreshing translations');
  };
  
  // Listen for URL changes to update language automatically, but only if not actively changing language
  useEffect(() => {
    const handleUrlChange = () => {
      // Skip if we're in the middle of a language change operation
      if (isChangingLanguage) return;
      
      const path = window.location.pathname;
      if (path.includes('/ar/') && language !== 'ar') {
        setLanguageState('ar');
        console.log('[LanguageContext] URL changed, setting language to ar');
        
        // We don't track here because this is an automatic change
        // The manual language switch is tracked in the Header component
      } else if (!path.includes('/ar/') && language !== 'en') {
        setLanguageState('en');
        console.log('[LanguageContext] URL changed, setting language to en');
      }
    };
    
    // Execute the handler immediately
    handleUrlChange();
    
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [language, isChangingLanguage]);
  
  // Update language context when setLanguage is called
  const setLanguage = (newLanguage: Language) => {
    // Don't do anything if language is the same or already changing
    if (language === newLanguage || isChangingLanguage) {
      console.log(`[LanguageContext] Ignoring language change request to ${newLanguage} - already ${language} or changing`);
      return;
    }
    
    // Save the requested language to prevent redundant changes
    lastRequestedLanguage.current = newLanguage;
    
    // Set the flag to indicate we're handling a language change
    setIsChangingLanguage(true);
    console.log(`[LanguageContext] Starting language change to ${newLanguage}`);
    
    // Update the language state
    setLanguageState(newLanguage);
    
    // Track document direction for RTL support
    if (newLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
    
    // Reset the flag after a delay to allow for navigation to complete
    setTimeout(() => {
      setIsChangingLanguage(false);
      console.log('[LanguageContext] Language change completed');
    }, 1200);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      refreshTranslations,
      isChangingLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
