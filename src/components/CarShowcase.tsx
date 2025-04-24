
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoBackground from './showcase/VideoBackground';
import ShowcaseButtons from './showcase/ShowcaseButtons';

interface CarShowcaseProps {
  variant?: 'speed' | 'personal' | 'budget';
  onWaitlistCTAClick?: () => void;
}

const CarShowcase: React.FC<CarShowcaseProps> = ({ variant = 'speed', onWaitlistCTAClick }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

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
      <VideoBackground />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-founder mb-4 text-white tracking-tight">
              {currentTagline.tagline}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-tarabut-teal mb-12 max-w-3xl mx-auto leading-relaxed">
              {currentTagline.subtitle}
            </p>
            
            <ShowcaseButtons onWaitlistCTAClick={onWaitlistCTAClick} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
