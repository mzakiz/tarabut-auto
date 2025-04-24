import React from 'react';
import { Linkedin, Instagram, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

const Footer = () => {
  const { t, isChangingLanguage } = useTranslation();
  
  const socialLinks = [
    {
      icon: Linkedin,
      url: 'https://www.linkedin.com/company/tarabutgateway/',
      ariaLabel: 'LinkedIn'
    },
    {
      icon: Instagram,
      url: 'https://www.instagram.com/tarabutgateway/',
      ariaLabel: 'Instagram'
    },
    {
      icon: X,
      url: 'https://x.com/tarabutgateway',
      ariaLabel: 'X (Twitter)'
    }
  ];

  return (
    <footer className="bg-ksa-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">
              {isChangingLanguage ? '...' : (t('footer.brand') || 'Tarabut Auto')}
            </h3>
            <p className="text-gray-400 mb-4 max-w-md text-center md:text-left">
              {isChangingLanguage ? '...' : t('footer.experience')}
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              {socialLinks.map(({ icon: Icon, url, ariaLabel }) => (
                <a 
                  key={url} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={ariaLabel}
                  className="text-gray-400 hover:text-tarabut-teal transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            
            <ul className="flex space-x-6 text-sm">
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
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t('footer.brand') || 'Tarabut Auto'}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
