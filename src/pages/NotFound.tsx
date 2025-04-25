
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
  
  console.error(
    `${logPrefix} 404 Error: User attempted to access non-existent route:`,
    location.pathname
  );
  console.error(`${logPrefix} Full URL: ${window.location.href}`);
  
  useEffect(() => {
    // Log detailed environment information to help with debugging
    console.log(`${logPrefix} Current environment:`, import.meta.env.MODE);
    console.log(`${logPrefix} Current base URL:`, import.meta.env.BASE_URL);
    console.log(`${logPrefix} Full URL:`, window.location.href);
    console.log(`${logPrefix} Current language context:`, language);
    console.log(`${logPrefix} Document direction:`, document.documentElement.dir);
    console.log(`${logPrefix} Attempting to determine appropriate redirect...`);
    
    // Additional logging for route debugging
    const pathSegments = location.pathname.split('/').filter(Boolean);
    console.log(`${logPrefix} Path segments:`, pathSegments);
    
    // Enhanced path detection logic - Handle /ar/ routes directly
    if (location.pathname.startsWith('/ar')) {
      console.log(`${logPrefix} Direct Arabic route detected: ${location.pathname}`);
      
      // Set language context to Arabic
      setLanguage('ar');
      
      // Handle specific Arabic paths
      if (location.pathname === '/ar' || location.pathname === '/ar/') {
        console.log(`${logPrefix} Base Arabic route, redirecting to /ar/speed`);
        navigate('/ar/speed', { replace: true });
        return;
      }
      
      // Check for specific feature paths
      if (location.pathname.startsWith('/ar/speed') || 
          location.pathname.startsWith('/ar/offer') || 
          location.pathname.startsWith('/ar/budget')) {
        console.log(`${logPrefix} Valid Arabic feature route: ${location.pathname}`);
        navigate(location.pathname, { replace: true });
        return;
      }
      
      // Default Arabic fallback
      console.log(`${logPrefix} Invalid Arabic path, defaulting to /ar/speed`);
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
