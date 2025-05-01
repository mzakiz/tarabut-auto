import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Head } from '@/components/Head';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Analytics } from '@/services/analytics';
import { 
  preloadAllTranslations, 
  storeTranslationsInSession, 
  enTranslationData,
  arTranslationData
} from '@/utils/translationPreloader';
import confetti from 'canvas-confetti';
import { ConfirmationHeader } from '@/components/confirmation/ConfirmationHeader';
import { PositionDetails } from '@/components/confirmation/PositionDetails';
import { ReferralSection } from '@/components/confirmation/ReferralSection';
import { PointsSection } from '@/components/confirmation/PointsSection';
import { StatusURL } from '@/components/confirmation/StatusURL';
import { LoadingScreen } from '@/components/confirmation/LoadingScreen';

// Force preload translations when this module loads
preloadAllTranslations();
storeTranslationsInSession();

// Hardcoded fallbacks for critical text
const CRITICAL_FALLBACKS = {
  en: {
    'confirmation.title': 'Congratulations!',
    'confirmation.subtitle': 'You\'ve been added to our exclusive waitlist',
    'confirmation.position_message': 'Your position in waitlist: #',
    'confirmation.referral_title': 'Share Your Referral Code',
    'confirmation.referral_description': 'Share with friends to move up the waitlist and get exclusive rewards',
    'confirmation.copy': 'Copy',
    'confirmation.share': 'Share',
    'confirmation.points_title': 'Your Waitlist Points',
    'confirmation.points_description': 'Earn more points by referring friends to increase your position on the waitlist',
    'confirmation.points': 'Points',
    'back.home': 'Return to Home Page'
  },
  ar: {
    'confirmation.title': 'تهانينا!',
    'confirmation.subtitle': 'تمت إضافتك إلى قائمة الانتظار الحصرية',
    'confirmation.position_message': 'موقعك في قائمة الانتظار: #',
    'confirmation.referral_title': 'شارك رمز الإحالة الخاص بك',
    'confirmation.referral_description': 'شارك مع الأصدقاء للتقدم في قائمة الانتظار والحصول على مكافآت حصرية',
    'confirmation.copy': 'نسخ',
    'confirmation.share': 'مشاركة',
    'confirmation.points_title': 'نقاط قائمة الانتظار الخاصة بك',
    'confirmation.points_description': 'اكسب المزيد من النقاط عن طريق دعوة الأصدقاء لتحسين موقعك في قائمة الانتظار',
    'confirmation.points': 'النقاط',
    'back.home': 'العودة إلى الصفحة الرئيسية'
  }
};

const Confirmation = () => {
  // Immediately preload translations
  preloadAllTranslations();
  storeTranslationsInSession();

  const { language } = useLanguage();
  const { t, refreshTranslations } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [confettiShown, setConfettiShown] = useState(false);
  
  // Direct access to translations
  const directTranslations = language === 'ar' ? arTranslationData : enTranslationData;
  const fallbacks = language === 'ar' ? CRITICAL_FALLBACKS.ar : CRITICAL_FALLBACKS.en;

  // Get parameters from URL query params or session storage
  const referralCode = searchParams.get('referralCode') || sessionStorage.getItem('waitlist_referralCode') || '';
  const position = parseInt(searchParams.get('position') || sessionStorage.getItem('waitlist_position') || '0', 10);
  const points = parseInt(searchParams.get('points') || sessionStorage.getItem('waitlist_points') || '100', 10); 
  const statusId = searchParams.get('statusId') || sessionStorage.getItem('waitlist_statusId') || '';
  const variant = searchParams.get('variant') || sessionStorage.getItem('waitlist_variant') || 'speed';

  // Get the variant from the URL if available
  const getVariantFromUrl = () => {
    const pathParts = location.pathname.split('/');
    const variantIndex = pathParts.findIndex(part => 
      part === 'speed' || part === 'offer' || part === 'budget'
    );
    
    return variantIndex !== -1 ? pathParts[variantIndex] : variant;
  };
  
  const currentVariant = getVariantFromUrl();

  // Guaranteed translation function that never fails
  const getTranslation = useCallback((key: string): string => {
    // First try the translation hook
    const hookTranslation = t(key);
    if (hookTranslation && hookTranslation !== key) {
      return hookTranslation;
    }
    
    // If hook failed, try direct access to translation data
    if (directTranslations && directTranslations[key]) {
      return directTranslations[key];
    }
    
    // If direct access failed, use hardcoded fallbacks
    if (fallbacks && fallbacks[key]) {
      return fallbacks[key];
    }
    
    // Last resort, return a user-friendly version of the key
    return key.split('.').pop()?.replace(/_/g, ' ') || key;
  }, [t, directTranslations, fallbacks]);

  useEffect(() => {
    preloadAllTranslations();
    refreshTranslations();
    
    // Store data in session in case of refresh
    if (referralCode) sessionStorage.setItem('waitlist_referralCode', referralCode);
    if (position) sessionStorage.setItem('waitlist_position', position.toString());
    if (points) sessionStorage.setItem('waitlist_points', points.toString());
    if (statusId) sessionStorage.setItem('waitlist_statusId', statusId);
    if (variant) sessionStorage.setItem('waitlist_variant', variant);
    
    // Show loading for a short time to ensure translations are ready
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Only fire confetti once when the page loads
      if (!confettiShown) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setConfettiShown(true);
      }
      
      // Track page view
      Analytics.trackPageViewed({
        page_name: 'waitlist_confirmation',
        language,
        variant: currentVariant
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [language, confettiShown, currentVariant, position, points, referralCode, statusId, variant, refreshTranslations]);

  // Show loading state while translations are loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Head 
        title={getTranslation('confirmation.title')}
        description={getTranslation('confirmation.subtitle')}
      />
      
      <ConfirmationHeader 
        getTranslation={getTranslation}
        currentVariant={currentVariant}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-lg flex-1 flex flex-col">
        <PositionDetails 
          getTranslation={getTranslation}
          position={position}
        />
        
        <ReferralSection 
          getTranslation={getTranslation}
          referralCode={referralCode}
          currentVariant={currentVariant}
        />
        
        <PointsSection 
          getTranslation={getTranslation}
          points={points}
        />
        
        {statusId && (
          <StatusURL 
            getTranslation={getTranslation}
            statusId={statusId}
          />
        )}
      </div>
    </div>
  );
};

export default Confirmation;
