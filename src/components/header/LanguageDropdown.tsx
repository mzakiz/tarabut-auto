
import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageDropdownProps {
  onLanguageChange: (newLanguage: 'en' | 'ar') => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ onLanguageChange }) => {
  const { language, isChangingLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white min-w-[44px] min-h-[44px]"
          aria-label="Change language"
          disabled={isChangingLanguage}
        >
          {isChangingLanguage ? (
            <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
          ) : (
            <Globe className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-tarabut-dark/95 backdrop-blur-lg border-gray-700 z-50 min-w-[150px]">
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${language === 'en' ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'} text-white cursor-pointer`}
          onClick={() => onLanguageChange('en')}
          disabled={isChangingLanguage || language === 'en'}
        >
          <span className="text-lg">🇬🇧</span>
          <span>English</span>
          {language === 'en' && <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${language === 'ar' ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'} text-white cursor-pointer`}
          onClick={() => onLanguageChange('ar')}
          disabled={isChangingLanguage || language === 'ar'}
        >
          <span className="text-lg">🇸🇦</span>
          <span>العربية</span>
          {language === 'ar' && <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
