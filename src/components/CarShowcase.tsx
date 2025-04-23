
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

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

  const handleDealershipClick = () => {
    navigate('/dealership-signup');
  };
  
  return (
    <section className={`relative min-h-[85vh] w-full overflow-hidden`}>
      {/* Video Background */}
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
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`max-w-5xl ${isRtl ? 'text-right' : 'text-left'} text-white`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Tarabut Auto
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Shariah-compliant auto financing for everyone in Saudi Arabia
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 ${isRtl ? 'justify-end' : 'justify-start'}`}>
            <Button 
              className="bg-ksa-primary hover:bg-ksa-primary/90 text-white px-6 py-6 rounded-lg text-lg"
              onClick={handleSignupClick}
            >
              {t(`cta.${variant}`)}
            </Button>
            
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-ksa-dark px-6 py-6 rounded-lg text-lg"
              onClick={handleDealershipClick}
            >
              {t('dealership.cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
