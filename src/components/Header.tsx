
import React, { useState, useEffect } from 'react';
import { Menu, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        scrolled ? 'py-2 glass-dark shadow-lg' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white font-bold text-xl md:text-2xl animate-fade-in">DriveDealDream</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white hover:text-ksa-secondary transition-colors duration-200">Features</a>
            <a href="#specs" className="text-white hover:text-ksa-secondary transition-colors duration-200">Specifications</a>
            <a href="#calculator" className="text-white hover:text-ksa-secondary transition-colors duration-200">Affordability</a>
            <Button className="bg-ksa-secondary hover:bg-ksa-secondary/90 text-white rounded-full px-6 flex items-center animate-pulse-button">
              <Phone className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
          </nav>

          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 glass-dark rounded-md animate-slide-down">
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-white hover:text-ksa-secondary transition-colors duration-200 py-2">Features</a>
              <a href="#specs" className="text-white hover:text-ksa-secondary transition-colors duration-200 py-2">Specifications</a>
              <a href="#calculator" className="text-white hover:text-ksa-secondary transition-colors duration-200 py-2">Affordability</a>
              <Button className="bg-ksa-secondary hover:bg-ksa-secondary/90 text-white rounded-full mt-2 flex items-center justify-center">
                <Phone className="w-4 h-4 mr-2" />
                Contact Sales
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
