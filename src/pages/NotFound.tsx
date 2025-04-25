
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
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Log current environment to help with debugging
    console.log("Current environment:", import.meta.env.MODE);
    console.log("Current base URL:", import.meta.env.BASE_URL);
    
    // Enhanced intelligent route handling for production 404s
    // More aggressive rerouting to handle edge cases
    
    // Check for direct access to root or empty path
    if (location.pathname === "/" || location.pathname === "") {
      console.log("Root path detected, redirecting to /en/speed");
      navigate("/en/speed", { replace: true });
      return;
    }
    
    // Handle Arabic routes specifically
    if (location.pathname.includes("/ar")) {
      console.log("Arabic path detected in NotFound component:", location.pathname);
      
      // Extract the specific feature after /ar/ if it exists
      const pathSegments = location.pathname.split('/');
      if (pathSegments.length >= 3) {
        const feature = pathSegments[2];
        if (feature && feature.length > 0) {
          console.log(`Detected Arabic route with feature: ${feature}`);
          
          // Valid features to check against
          const validFeatures = ["speed", "offer", "budget"];
          if (validFeatures.includes(feature)) {
            // This seems like a valid path, try forcing navigation
            const fullPath = `/ar/${feature}`;
            console.log(`Redirecting to valid Arabic path: ${fullPath}`);
            navigate(fullPath, { replace: true });
            return;
          }
        }
      }
      
      // Default Arabic fallback
      console.log("Redirecting to Arabic home: /ar/speed");
      navigate("/ar/speed", { replace: true });
      return;
    }
    
    // Handle English routes with similar logic
    if (location.pathname.includes("/en")) {
      const pathSegments = location.pathname.split('/');
      if (pathSegments.length >= 3) {
        const feature = pathSegments[2];
        if (feature && feature.length > 0) {
          // Valid features to check against
          const validFeatures = ["speed", "offer", "budget"];
          if (validFeatures.includes(feature)) {
            // This seems like a valid path
            const fullPath = `/en/${feature}`;
            console.log(`Redirecting to valid English path: ${fullPath}`);
            navigate(fullPath, { replace: true });
            return;
          }
        }
      }
      
      // Default English fallback
      console.log("Redirecting to English home: /en/speed");
      navigate("/en/speed", { replace: true });
      return;
    }
    
    // If we can't determine language from path, use the current language setting
    const langPrefix = language === 'ar' ? '/ar' : '/en';
    console.log(`Using current language (${language}) for redirect: ${langPrefix}/speed`);
    navigate(`${langPrefix}/speed`, { replace: true });
  }, [location.pathname, navigate, language]);

  const handleBackToHome = () => {
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
      </div>
    </div>
  );
};

export default NotFound;
