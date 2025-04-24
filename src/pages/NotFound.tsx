
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
    
    // Handles root path and empty path redirects
    if (location.pathname === "/" || location.pathname === "") {
      navigate("/en/speed", { replace: true });
    }
  }, [location.pathname, navigate]);

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
        <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
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
