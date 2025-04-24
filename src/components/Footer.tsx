
import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, isChangingLanguage } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const socialLinks = [
    {
      icon: 'X',
      url: 'https://x.com/tarabutgateway',
      ariaLabel: 'X (Twitter)',
      customIcon: '/Logos/x_logo_grey.png'
    },
    {
      icon: Instagram,
      url: 'https://www.instagram.com/tarabutgateway/',
      ariaLabel: 'Instagram'
    },
    {
      icon: Linkedin,
      url: 'https://www.linkedin.com/company/tarabutgateway/',
      ariaLabel: 'LinkedIn'
    }
  ];

  return (
    <footer className="bg-[#1A1F2C] text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} justify-between items-start gap-12`}>
          <div className="w-full md:w-1/2 space-y-4">
            <h3 className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
              {isChangingLanguage ? '...' : t('footer.brand')}
            </h3>
            <p className={`text-gray-400 max-w-xl ${isRTL ? 'text-right' : 'text-left'} leading-relaxed`}>
              {isChangingLanguage ? '...' : t('footer.experience')}
            </p>
          </div>
          
          <div className={`w-full md:w-auto flex flex-col ${isRTL ? 'items-end' : 'items-start'} gap-6`}>
            <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {socialLinks.map(({ icon: Icon, url, ariaLabel, customIcon }) => (
                <a 
                  key={url} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={ariaLabel}
                  className="text-gray-400 hover:text-tarabut-teal transition-colors"
                >
                  {customIcon ? (
                    <img 
                      src={customIcon} 
                      alt={ariaLabel} 
                      className="h-6 w-6 opacity-60 hover:opacity-100 transition-opacity" 
                    />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </a>
              ))}
            </div>
            
            <ul className={`flex gap-6 text-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <li>
                <Link to="/" className="text-gray-400 hover:text-tarabut-teal transition-colors">
                  {isChangingLanguage ? '...' : t('footer.home')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://tarabut.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-tarabut-teal transition-colors"
                >
                  {isChangingLanguage ? '...' : t('footer.about')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`mt-16 pt-8 border-t border-gray-800 ${isRTL ? 'text-right' : 'text-center'} text-gray-500`}>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {t('footer.brand') || 'Tarabut Auto'}. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
