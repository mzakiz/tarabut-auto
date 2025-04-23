
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

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
    { href: '#contact', label: t('nav.contact') }
  ];

  const baseClasses = "text-white/80 hover:text-white transition-colors duration-200 text-sm tracking-wide";
  const mobileClasses = "py-3 px-4 rounded min-h-[44px] flex items-center";
  const rtlSpacing = language === 'ar' ? 'space-x-8 space-x-reverse' : 'space-x-8';

  return (
    <nav className={isMobile ? "flex flex-col space-y-4" : `hidden md:flex items-center ${rtlSpacing}`}>
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
          onClick={onMobileItemClick}
        >
          {isChangingLanguage ? '...' : item.label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation;
