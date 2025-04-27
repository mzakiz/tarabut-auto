
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Analytics } from '@/services/analytics';

interface NavigationProps {
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onMobileItemClick }) => {
  const { t, isChangingLanguage } = useTranslation();
  const { language } = useLanguage();
  
  const navItems = [
    { href: '#features', label: t('nav.features') },
    { href: '#specs', label: t('nav.specifications') },
    { href: '#calculator', label: t('nav.affordability') },
    { href: '#footer', label: t('nav.contact') } // Updated to scroll to footer
  ];

  const baseClasses = "text-white/80 hover:text-white transition-colors duration-200 text-sm tracking-wide";
  const mobileClasses = "py-3 px-4 rounded min-h-[44px] flex items-center";
  const rtlSpacing = language === 'ar' ? 'space-x-8 space-x-reverse' : 'space-x-8';
  
  const handleNavClick = (section: string) => {
    // Track navigation click
    Analytics.trackCTAClicked({
      element_type: 'navigation_link',
      element_location: isMobile ? 'mobile_menu' : 'header',
      element_context: `navigate_to_${section}`,
      screen: 'landing_page',
      language
    });
    
    const element = document.getElementById(section);
    if (element) {
      const offset = 80; // Account for header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    // Execute mobile callback if provided
    if (onMobileItemClick) {
      onMobileItemClick();
    }
  };

  return (
    <nav className={isMobile ? "flex flex-col space-y-4" : `hidden md:flex items-center ${rtlSpacing}`}>
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
          onClick={() => handleNavClick(item.href.substring(1))}
        >
          {isChangingLanguage ? '...' : item.label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation;
