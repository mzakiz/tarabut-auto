
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { useAnalyticsPage, Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const tierDescriptions = {
  'VIP Access': {
    emoji: '🚀',
    title: 'First in line. First to get approved.',
    description: 'Exclusive perks, early approvals, top priority.'
  },
  'Early Access': {
    emoji: '⚡',
    title: 'Beat the crowd. Get offers before anyone else.',
    description: 'Fast-track your financing and get notified first.'
  },
  'Fast Track': {
    emoji: '🚗',
    title: 'You\'re ahead of the pack.',
    description: 'Closer to early access. Just a few referrals away from the top.'
  },
  'Standard': {
    emoji: '🕓',
    title: 'You\'ve joined the waitlist!',
    description: 'Want to move up? Refer friends and unlock priority access.'
  }
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
  const userTier = location.state?.tier || 'Standard';
  const points = location.state?.points || 100;
  
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
  
  const handleBackToHome = () => {
    Analytics.trackCTAClicked({
      element: 'return_home',
      screen: 'thank_you_page',
      language
    });
    navigate('/');
  };

  // Get tier description based on user's tier or default to Standard
  const tier = tierDescriptions[userTier] || tierDescriptions['Standard'];

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
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
            
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{tier.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-800">{t(`tier.${userTier?.toLowerCase().replace(' ', '_')}.title`) || tier.title}</h3>
                <p className="text-gray-600 mt-2">{t(`tier.${userTier?.toLowerCase().replace(' ', '_')}.description`) || tier.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{points}</p>
                <p className="text-sm text-gray-500">{t('confirmation.points')}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-800 mb-2">
                {t('confirmation.share.code')}
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
            </div>

            {statusId && (
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  {t('confirmation.status.url.title')}
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
