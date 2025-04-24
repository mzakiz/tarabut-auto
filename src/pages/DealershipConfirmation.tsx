
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const DealershipConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  const handleBackToHome = () => {
    const pathParts = location.pathname.split('/');
    const lang = pathParts[1] || 'en';
    const variant = pathParts[2] || 'speed';
    
    navigate(`/${lang}/${variant}`);
  };

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
            <div className="p-6 md:p-8">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                {t('dealership.success')}
              </h1>
              
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  {t('dealership.success.description')}
                </p>
              </div>
              
              <Button 
                onClick={handleBackToHome}
                className={`w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white ${language === 'ar' ? 'flex-row-reverse' : ''}`}
              >
                {t('dealership.back')}
                <ArrowRight className={`${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealershipConfirmation;
