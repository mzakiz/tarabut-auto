import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';
import { useAnalyticsPage, Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const Confirmation = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  const referralCode = location.state?.referralCode || 'TOYOTA25';
  const waitlistPosition = location.state?.position || 42;
  
  useAnalyticsPage('Thank You Page', {
    language,
    waitlist_position: waitlistPosition,
    has_referral: !!location.state?.referralCode
  });
  
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: t('confirmation.code.copied'),
      description: t('confirmation.code.share'),
    });
    
    Analytics.trackCTAClicked({
      element: 'copy_referral_code',
      screen: 'thank_you_page',
      language
    });
  };
  
  const handleBackToHome = () => {
    Analytics.trackCTAClicked({
      element: 'return_home',
      screen: 'thank_you_page',
      language
    });
    navigate('/');
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
                {t('confirmation.title')}
              </h1>
              <p className="text-center text-gray-600 mb-4">
                {t('confirmation.subtitle')}
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('confirmation.position.title')}</span>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">#{waitlistPosition}</p>
                <p className="text-xs text-gray-500">
                  {t('confirmation.position.subtitle')}
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-5 mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">
                  {t('confirmation.whats.next')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-700">1</span>
                    </div>
                    <span className="text-gray-700">{t('confirmation.next.1')}</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-700">2</span>
                    </div>
                    <span className="text-gray-700">{t('confirmation.next.2')}</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-700">3</span>
                    </div>
                    <span className="text-gray-700">{t('confirmation.next.3')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">{t('confirmation.share.code')}:</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-l-md px-4 py-2 text-gray-800 font-mono">
                    {referralCode}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="bg-gray-100 border border-gray-200 border-l-0 rounded-r-md px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('confirmation.share.bonus')}
                </p>
              </div>
              
              <Button 
                onClick={handleBackToHome}
                className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white"
              >
                {t('confirmation.back.home')}
                <ArrowRight className={`${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
