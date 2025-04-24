import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { useAnalyticsPage, Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const getTierForPoints = (points: number): string => {
  if (points >= 1000) return "🌟 VIP Access";
  if (points >= 500) return "⭐ Early Access";
  if (points >= 200) return "⚡ Fast Track";
  return "🕓 Standard";
};

const Confirmation = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  const referralCode = location.state?.referralCode || 'TOYOTA25';
  const waitlistPosition = location.state?.position || 42;
  const statusId = location.state?.statusId;
  const points = location.state?.points || 100;
  const currentTier = getTierForPoints(points);
  
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

  const copyStatusUrl = () => {
    if (!statusId) return;
    
    const statusUrl = `${window.location.origin}/waitlist-status/${statusId}`;
    navigator.clipboard.writeText(statusUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: t('confirmation.status.copied'),
      description: t('confirmation.status.url.description'),
    });
    
    Analytics.trackCTAClicked({
      element: 'copy_status_url',
      screen: 'thank_you_page',
      language
    });
  };

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Message Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl p-6 md:p-8">
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
            </div>
            
            {/* Points and Tier Display */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{`${t('confirmation.your.tier')}: ${currentTier}`}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{points}</p>
                  <p className="text-sm text-gray-500">{t('confirmation.points')}</p>
                </div>
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-800 mb-2">
                {t('confirmation.share.code')}:
              </p>
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

            {/* Status URL Section */}
            {statusId && (
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  {t('confirmation.status.url.title')}:
                </p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-l-md px-4 py-2 text-gray-800 font-mono truncate">
                    {`${window.location.origin}/waitlist-status/${statusId}`}
                  </div>
                  <button 
                    onClick={copyStatusUrl}
                    className="bg-gray-100 border border-gray-200 border-l-0 rounded-r-md px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('confirmation.status.url.description')}
                </p>
              </div>
            )}

            {/* Back to Home Button */}
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
  );
};

export default Confirmation;
