import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Head } from "@/components/Head";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Detailed logging prefix
  const logPrefix = "[NotFound]";
  
  // Log full debug information immediately on component mount
  console.log(`${logPrefix} Component mounted with:`, {
    currentPath: location.pathname,
    currentSearch: location.search,
    fullURL: window.location.href,
    currentLanguage: language,
    documentDirection: document.documentElement.dir,
    documentLang: document.documentElement.lang,
    environment: import.meta.env.MODE,
    baseURL: import.meta.env.BASE_URL
  });
  
  useEffect(() => {
    // Enhanced logging for route analysis
    console.log(`${logPrefix} Analyzing route:`, {
      pathname: location.pathname,
      pathSegments: location.pathname.split('/').filter(Boolean),
      isArabicRoute: location.pathname.startsWith('/ar'),
      isEnglishRoute: location.pathname.startsWith('/en')
    });
    
    // Enhanced path detection logic - Handle /ar/ routes directly
    if (location.pathname.startsWith('/ar')) {
      console.log(`${logPrefix} Processing Arabic route: ${location.pathname}`);
      
      // Set language context to Arabic
      setLanguage('ar');
      
      // Handle specific Arabic paths
      if (location.pathname === '/ar' || location.pathname === '/ar/') {
        console.log(`${logPrefix} Redirecting base Arabic route to /ar/speed`);
        navigate('/ar/speed', { replace: true });
        return;
      }
      
      // Check for specific feature paths with more detailed logging
      const validArPaths = ['/ar/speed', '/ar/offer', '/ar/budget'];
      const isValidPath = validArPaths.some(path => location.pathname.startsWith(path));
      
      console.log(`${logPrefix} Path validation:`, {
        path: location.pathname,
        isValid: isValidPath,
        validPaths: validArPaths
      });
      
      if (isValidPath) {
        console.log(`${logPrefix} Confirmed valid Arabic route: ${location.pathname}`);
        navigate(location.pathname, { replace: true });
        return;
      }
      
      // Log invalid path handling
      console.log(`${logPrefix} Invalid Arabic path detected, redirecting to /ar/speed`);
      navigate('/ar/speed', { replace: true });
      return;
    }
    
    // Handle English routes with similar logic
    if (location.pathname.startsWith('/en')) {
      console.log(`${logPrefix} Direct English route detected: ${location.pathname}`);
      
      // Set language context to English
      setLanguage('en');
      
      // Handle specific English paths
      if (location.pathname === '/en' || location.pathname === '/en/') {
        console.log(`${logPrefix} Base English route, redirecting to /en/speed`);
        navigate('/en/speed', { replace: true });
        return;
      }
      
      // Check for specific feature paths
      if (location.pathname.startsWith('/en/speed') || 
          location.pathname.startsWith('/en/offer') || 
          location.pathname.startsWith('/en/budget')) {
        console.log(`${logPrefix} Valid English feature route: ${location.pathname}`);
        navigate(location.pathname, { replace: true });
        return;
      }
      
      // Default English fallback
      console.log(`${logPrefix} Invalid English path, defaulting to /en/speed`);
      navigate('/en/speed', { replace: true });
      return;
    }
    
    // If we can't determine language from path, use the current language setting
    const langPrefix = language === 'ar' ? '/ar' : '/en';
    console.log(`${logPrefix} Using current language (${language}) for redirect: ${langPrefix}/speed`);
    navigate(`${langPrefix}/speed`, { replace: true });
  }, [location.pathname, navigate, language, setLanguage]);

  const handleBackToHome = () => {
    console.log(`${logPrefix} User clicked "Back to Home" button, navigating to /${language}/speed`);
    navigate(`/${language}/speed`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Head 
        title="404 - Page Not Found | Tarabut Auto"
        description="The page you are looking for does not exist. Return to Tarabut Auto homepage."
      />
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/Logos/Tarabut_Auto-2.png" 
            alt="Tarabut Auto Logo" 
            className="h-12 w-auto" 
          />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">{language === 'ar' ? 'عذراً، الصفحة غير موجودة' : 'Oops! Page not found'}</p>
        <Button 
          onClick={handleBackToHome} 
          className="bg-ksa-primary hover:bg-ksa-primary/90 text-white"
        >
          {t('back.home')}
        </Button>
        
        {/* Debug information in all environments to help with troubleshooting */}
        <div className="mt-8 p-4 border border-gray-200 rounded text-left max-w-full overflow-auto">
          <h3 className="font-bold mb-2 text-sm">Debug Information</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {`Path: ${location.pathname}
Current Language: ${language}
Document Direction: ${language === 'ar' ? 'rtl' : 'ltr'}
Is Production: ${import.meta.env.PROD}
Base URL: ${import.meta.env.BASE_URL}
Timestamp: ${new Date().toISOString()}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
