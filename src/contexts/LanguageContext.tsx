
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  
  // Function to force refresh translations
  const refreshTranslations = () => {
    // Create a small state change to force re-renders
    const currentLang = language;
    setLanguage('en' as Language);
    setTimeout(() => setLanguage(currentLang), 10);
    
    console.log('[LanguageContext] Refreshing translations');
  };
  
  // Listen for URL changes to update language automatically
  useEffect(() => {
    const handleUrlChange = () => {
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, refreshTranslations }}>
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
