
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Analytics } from '@/services/analytics';
import Navigation from './Navigation';
import LanguageDropdown from './LanguageDropdown';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, isChangingLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (newLanguage: 'en' | 'ar') => {
    if (language === newLanguage || isChangingLanguage) {
      console.log(`Ignoring language change request - already ${language} or changing`);
      return;
    }
    
    // Track language change
    Analytics.trackLanguageSwitched({
      from: language,
      to: newLanguage,
      screen: 'landing_page'
    });
    
    const pathParts = location.pathname.split('/');
    let variant = 'speed';
    for (let i = 1; i < pathParts.length; i++) {
      if (pathParts[i] === 'ar' || pathParts[i] === 'en') {
        variant = pathParts[i + 1] || 'speed';
        break;
      }
    }
    
    const validVariants = ['speed', 'offer', 'budget'];
    const safeVariant = validVariants.includes(variant) ? variant : 'speed';
    
    const newPath = `/${newLanguage}/${safeVariant}`;
    
    console.log(`Language change: Navigating from ${location.pathname} to ${newPath}`);
    
    setLanguage(newLanguage);
    
    setTimeout(() => {
      navigate(newPath);
    }, 50);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-tarabut-dark/90 backdrop-blur-lg' : 'py-4 md:py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/e36808ad-ab3e-4800-8df3-7ee5779a2624.png" 
              alt="Tarabut Logo" 
              className="h-6 md:h-8 w-auto mr-3"
            />
          </div>

          <Navigation />

          <div className="flex items-center">
            <LanguageDropdown onLanguageChange={changeLanguage} />
          </div>

          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white min-w-[44px] min-h-[44px] p-2"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (!mobileMenuOpen) {
                  Analytics.trackCTAClicked({
                    element: 'mobile_menu_open',
                    screen: 'landing_page',
                    language
                  });
                } else {
                  Analytics.trackCTAClicked({
                    element: 'mobile_menu_close',
                    screen: 'landing_page',
                    language
                  });
                }
              }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-tarabut-dark/95 backdrop-blur-lg rounded-md animate-fade-in">
            <Navigation isMobile onMobileItemClick={() => setMobileMenuOpen(false)} />
            <div className="flex items-center justify-end pt-2 border-t border-white/10">
              <LanguageDropdown onLanguageChange={changeLanguage} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
