
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface NavigationProps {
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onMobileItemClick }) => {
  const { t, isChangingLanguage } = useTranslation();
  
  const navItems = [
    { href: '#features', key: 'nav.features' },
    { href: '#specs', key: 'nav.specifications' },
    { href: '#calculator', key: 'nav.affordability' },
    { href: '#contact', key: 'nav.contact' }
  ];

  const baseClasses = "text-white/80 hover:text-white transition-colors duration-200 text-sm tracking-wide";
  const mobileClasses = "py-3 px-4 rounded min-h-[44px] flex items-center";

  return (
    <nav className={isMobile ? "flex flex-col space-y-4" : "hidden md:flex items-center space-x-8"}>
      {navItems.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className={`${baseClasses} ${isMobile ? mobileClasses : ''}`}
          onClick={onMobileItemClick}
        >
          {isChangingLanguage ? '...' : t(item.key)}
        </a>
      ))}
    </nav>
  );
};

export default Navigation;
