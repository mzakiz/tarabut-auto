
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

interface CarShowcaseProps {
  variant?: 'speed' | 'personal' | 'budget';
}

const CarShowcase: React.FC<CarShowcaseProps> = ({ variant = 'speed' }) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { refreshTranslations } = useLanguage();
  const isRtl = language === 'ar';
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const handleSignupClick = () => {
    navigate('/waitlist-signup');
  };

  // Use the correct translation keys based on variant
  const getTaglineKey = () => {
    if (variant === 'personal') return 'offer.tagline';
    if (variant === 'budget') return 'budget.tagline';
    return 'speed.tagline'; // default to speed
  };
  
  const getSubtitleKey = () => {
    if (variant === 'personal') return 'offer.subtitle';
    if (variant === 'budget') return 'budget.subtitle';
    return 'speed.subtitle'; // default to speed
  };

  // Preload the video as early as possible
  useEffect(() => {
    // Create a video element to start loading the video in the background
    const videoPreload = document.createElement('video');
    videoPreload.src = '/Camry-2.mp4';
    videoPreload.preload = 'auto';
    videoPreload.muted = true;
    videoPreload.style.display = 'none';
    document.body.appendChild(videoPreload);
    
    // Start loading the video
    videoPreload.load();
    
    // Remove the element after it's loaded
    videoPreload.onloadeddata = () => {
      setVideoLoaded(true);
      setTimeout(() => {
        document.body.removeChild(videoPreload);
      }, 1000);
    };
    
    return () => {
      if (document.body.contains(videoPreload)) {
        document.body.removeChild(videoPreload);
      }
    };
  }, []);

  // Force refresh translations on mount
  useEffect(() => {
    // Short timeout to ensure component is fully mounted
    const timer = setTimeout(() => {
      refreshTranslations();
    }, 100);
    return () => clearTimeout(timer);
  }, [refreshTranslations]);

  // For debugging translation issues
  console.log('Current variant:', variant);
  console.log('Translation key being used:', getTaglineKey());
  console.log('Translation value:', t(getTaglineKey()));
  console.log('Current language:', language);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background with fade-in transition */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ opacity: videoLoaded ? 1 : 0 }}
          >
            <source src="/Camry-2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between">
        {/* Main Content */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-4xl text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-founder font-medium tracking-wide leading-tight mb-4 text-white">
                {t(getTaglineKey())}
              </h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <h3 className="text-lg md:text-xl lg:text-2xl font-founder tracking-wide text-tarabut-teal leading-tight mb-12">
                  {t(getSubtitleKey())}
                </h3>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button 
                    className="bg-tarabut-teal hover:bg-tarabut-teal/90 text-black font-semibold px-6 py-4 rounded-lg text-base"
                    onClick={handleSignupClick}
                  >
                    {t('waitlist.join')}
                  </Button>
                  
                  <Link 
                    to="/dealership-signup" 
                    className="inline-flex items-center justify-center text-white hover:text-tarabut-teal transition-colors px-4 py-2 text-base"
                  >
                    {t('dealership.cta')}
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Car Metrics - reduced font sizes */}
        <div className="w-full py-6 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-4 text-center text-white">
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase tracking-wider mb-1">{t('metrics.engine')}</div>
                <div className="text-lg md:text-xl font-semibold">{t('metrics.engine.value')}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase tracking-wider mb-1">{t('metrics.monthly')}</div>
                <div className="text-lg md:text-xl font-semibold">{t('metrics.monthly.value')}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase tracking-wider mb-1">{t('metrics.power')}</div>
                <div className="text-lg md:text-xl font-semibold">{t('metrics.power.value')}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase tracking-wider mb-1">{t('metrics.fuel')}</div>
                <div className="text-lg md:text-xl font-semibold">{t('metrics.fuel.value')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
