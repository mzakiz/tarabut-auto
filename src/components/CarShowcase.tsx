
import React from 'react';
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
  
  const handleSignupClick = () => {
    navigate('/waitlist-signup');
  };

  // Get the primary tagline based on the variant/hypothesis
  const getPrimaryTagline = () => {
    switch(variant) {
      case 'speed':
        return t('speed.tagline');
      case 'personal':
        return t('offer.tagline');
      case 'budget':
        return t('budget.tagline');
      default:
        return t('speed.tagline');
    }
  };
  
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
          poster="/placeholder.svg"
        >
          <source src="/Camry-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-5xl text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-founder tracking-wide leading-tight mb-6 text-white">
              {t('speed.tagline')}
            </h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-founder tracking-wide text-tarabut-teal leading-tight mb-6">
                {t('speed.subtitle')}
              </h3>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-tarabut-teal hover:bg-tarabut-teal/90 text-black font-semibold px-8 py-6 rounded-lg text-lg"
                  onClick={handleSignupClick}
                >
                  {t('waitlist.join')}
                </Button>
                
                <Link 
                  to="/dealership-signup" 
                  className="inline-flex items-center justify-center text-white hover:text-tarabut-teal transition-colors mt-4 sm:mt-0"
                >
                  {t('dealership.cta')}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Car metrics section */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-4 text-center text-white">
            <div className="flex flex-col items-center">
              <div className="text-sm uppercase tracking-wider mb-1">ENGINE</div>
              <div className="text-xl md:text-2xl font-semibold">2.5L</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm uppercase tracking-wider mb-1">MONTHLY</div>
              <div className="text-xl md:text-2xl font-semibold">SAR 1,299</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm uppercase tracking-wider mb-1">POWER</div>
              <div className="text-xl md:text-2xl font-semibold">203 hp</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm uppercase tracking-wider mb-1">FUEL</div>
              <div className="text-xl md:text-2xl font-semibold">7.2L/100km</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
