
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CarShowcaseProps {
  variant?: 'speed' | 'personal' | 'budget';
}

const CarShowcase: React.FC<CarShowcaseProps> = ({ variant = 'speed' }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const handleSignupClick = () => {
    navigate('/waitlist-signup');
  };

  // Preload the video
  useEffect(() => {
    const videoElement = document.createElement('link');
    videoElement.rel = 'preload';
    videoElement.href = '/Camry-2.mp4';
    videoElement.as = 'video';
    document.head.appendChild(videoElement);

    return () => {
      document.head.removeChild(videoElement);
    };
  }, []);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background with fade-in transition */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            poster="/placeholder.svg"
            onLoadedData={handleVideoLoaded}
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
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-founder font-medium tracking-wide leading-tight mb-4 text-white">
                {t('speed.tagline')}
              </h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <h3 className="text-xl md:text-2xl lg:text-3xl font-founder tracking-wide text-tarabut-teal leading-tight mb-12">
                  {t('speed.subtitle')}
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
                    className="bg-tarabut-teal hover:bg-tarabut-teal/90 text-black font-semibold px-8 py-6 rounded-lg text-lg"
                    onClick={handleSignupClick}
                  >
                    {t('waitlist.join')}
                  </Button>
                  
                  <Link 
                    to="/dealership-signup" 
                    className="inline-flex items-center justify-center text-white hover:text-tarabut-teal transition-colors px-6 py-3 text-lg"
                  >
                    {t('dealership.cta')}
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Car Metrics - transparent background, reduced font sizes */}
        <div className="w-full py-6 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-4 text-center text-white">
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase tracking-wider mb-1">ENGINE</div>
                <div className="text-xl md:text-2xl font-semibold">2.5L</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase tracking-wider mb-1">MONTHLY</div>
                <div className="text-xl md:text-2xl font-semibold">SAR 1,299</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase tracking-wider mb-1">POWER</div>
                <div className="text-xl md:text-2xl font-semibold">203 hp</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs uppercase tracking-wider mb-1">FUEL</div>
                <div className="text-xl md:text-2xl font-semibold">7.2L/100km</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
