
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  refreshTranslations: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with English by default, or use URL path to determine language
  const [language, setLanguage] = useState<Language>(() => {
    // Check URL path for language indicator
    const path = window.location.pathname;
    if (path.includes('/ar/')) return 'ar';
    return 'en';
  });
  
  // Add a ref to track if we're handling a language change to prevent loops
  const isChangingLanguage = useRef(false);
  
  // Function to force refresh translations
  const refreshTranslations = () => {
    // Create a small state change to force re-renders
    const currentLang = language;
    setLanguage('en' as Language);
    setTimeout(() => setLanguage(currentLang), 10);
    
    console.log('[LanguageContext] Refreshing translations');
  };
  
  // Listen for URL changes to update language automatically, but only if not actively changing language
  useEffect(() => {
    const handleUrlChange = () => {
      // Skip if we're in the middle of a language change operation
      if (isChangingLanguage.current) return;
      
      const path = window.location.pathname;
      if (path.includes('/ar/') && language !== 'ar') {
        setLanguage('ar');
      } else if (!path.includes('/ar/') && language !== 'en') {
        setLanguage('en');
      }
    };
    
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [language]);
  
  // Update language context when setLanguage is called
  const handleSetLanguage = (newLanguage: Language) => {
    if (language === newLanguage) return; // Don't do anything if language is the same
    
    // Set the flag to indicate we're handling a language change
    isChangingLanguage.current = true;
    
    // Update the language state
    setLanguage(newLanguage);
    
    // Reset the flag after a delay to allow for navigation to complete
    setTimeout(() => {
      isChangingLanguage.current = false;
    }, 1000);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      refreshTranslations 
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
