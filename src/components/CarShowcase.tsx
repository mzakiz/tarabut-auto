
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface CarShowcaseProps {
  variant?: 'speed' | 'personal' | 'budget';
  onWaitlistCTAClick?: () => void;
}

const CarShowcase: React.FC<CarShowcaseProps> = ({ variant = 'speed', onWaitlistCTAClick }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const handleWaitlistClick = () => {
    if (onWaitlistCTAClick) {
      onWaitlistCTAClick();
    }
    navigate('/waitlist-signup');
  };

  const handleDealershipClick = () => {
    navigate('/dealership-signup');
  };

  const taglines = {
    speed: {
      tagline: t('speed.tagline'),
      subtitle: t('speed.subtitle')
    },
    personal: {
      tagline: t('offer.tagline'),
      subtitle: t('offer.subtitle')
    },
    budget: {
      tagline: t('budget.tagline'),
      subtitle: t('budget.subtitle')
    }
  };

  const currentTagline = taglines[variant];
  
  return (
    <section className="relative w-full h-screen flex flex-col overflow-hidden bg-tarabut-dark" style={{ minHeight: '100vh' }}>
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/Camry-2.mp4" type="video/mp4" />
      </video>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight font-founder mb-8 text-white">
              {currentTagline.tagline}
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl text-tarabut-teal mb-16">
              {currentTagline.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={handleWaitlistClick}
                className="bg-tarabut-teal hover:bg-tarabut-teal/90 text-tarabut-dark min-h-[56px] font-medium text-xl px-10 py-7 w-full sm:w-auto"
              >
                {t('waitlist.join')}
              </Button>
              <Button
                variant="outline"
                onClick={handleDealershipClick}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 min-h-[56px] text-xl px-10 py-7 w-full sm:w-auto"
              >
                {t('dealership.cta')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
