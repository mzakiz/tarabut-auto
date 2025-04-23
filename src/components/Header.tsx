
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (newLanguage) => {
    if (language === newLanguage) return;
    
    // Show loading state
    setIsLoading(true);
    
    // Extract the variant (speed, offer, or budget) from the current path
    const pathParts = location.pathname.split('/');
    const variant = pathParts[pathParts.length - 1];
    
    // Ensure we have a valid variant, default to "speed" if not
    const validVariants = ['speed', 'offer', 'budget'];
    const safeVariant = validVariants.includes(variant) ? variant : 'speed';
    
    // Construct the new path with the new language
    const newPath = `/${newLanguage}/${safeVariant}`;
    
    console.log(`Language change: Navigating from ${location.pathname} to ${newPath}`);
    
    // Update language in context
    setLanguage(newLanguage);
    
    // Navigate to new URL
    navigate(newPath);
    
    // Reset loading state after navigation (with a small delay to ensure the loading indicator is visible)
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors duration-200 text-sm tracking-wide">Features</a>
            <a href="#specs" className="text-white/80 hover:text-white transition-colors duration-200 text-sm tracking-wide">Specifications</a>
            <a href="#calculator" className="text-white/80 hover:text-white transition-colors duration-200 text-sm tracking-wide">Affordability</a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors duration-200 text-sm tracking-wide">Contact</a>
          </nav>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white min-w-[44px] min-h-[44px]"
                  aria-label="Change language"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  ) : (
                    <Globe className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-tarabut-dark/95 backdrop-blur-lg border-gray-700">
                <DropdownMenuItem 
                  className={`flex items-center gap-2 ${language === 'en' ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'} text-white cursor-pointer`}
                  onClick={() => changeLanguage('en')}
                >
                  <span className="text-lg">🇬🇧</span>
                  <span>English</span>
                  {language === 'en' && <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`flex items-center gap-2 ${language === 'ar' ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'} text-white cursor-pointer`}
                  onClick={() => changeLanguage('ar')}
                >
                  <span className="text-lg">🇸🇦</span>
                  <span>العربية</span>
                  {language === 'ar' && <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white min-w-[44px] min-h-[44px] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-tarabut-dark/95 backdrop-blur-lg rounded-md animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-white/80 hover:text-white transition-colors duration-200 py-3 px-4 rounded min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#specs" 
                className="text-white/80 hover:text-white transition-colors duration-200 py-3 px-4 rounded min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Specifications
              </a>
              <a 
                href="#calculator" 
                className="text-white/80 hover:text-white transition-colors duration-200 py-3 px-4 rounded min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Affordability
              </a>
              <a 
                href="#contact" 
                className="text-white/80 hover:text-white transition-colors duration-200 py-3 px-4 rounded min-h-[44px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex items-center justify-end pt-2 border-t border-white/10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white min-w-[44px] min-h-[44px]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      ) : (
                        <Globe className="h-5 w-5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-tarabut-dark/95 backdrop-blur-lg border-gray-700">
                    <DropdownMenuItem 
                      className={`flex items-center gap-2 ${language === 'en' ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'} text-white cursor-pointer`}
                      onClick={() => changeLanguage('en')}
                    >
                      <span className="text-lg">🇬🇧</span>
                      <span>English</span>
                      {language === 'en' && <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={`flex items-center gap-2 ${language === 'ar' ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'} text-white cursor-pointer`}
                      onClick={() => changeLanguage('ar')}
                    >
                      <span className="text-lg">🇸🇦</span>
                      <span>العربية</span>
                      {language === 'ar' && <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
