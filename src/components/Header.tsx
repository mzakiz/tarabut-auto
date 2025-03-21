
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

          <div className="hidden md:flex items-center">
            <Button variant="ghost" className="text-white text-sm">
              SAR
            </Button>
            <Button variant="ghost" className="text-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Button>
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
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <Button variant="ghost" className="text-white text-sm min-h-[44px]">
                  SAR
                </Button>
                <Button variant="ghost" className="text-white p-2 rounded-full min-h-[44px] min-w-[44px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
