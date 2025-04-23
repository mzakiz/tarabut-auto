
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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

  const taglines = {
    speed: "Advanced. Reliable. Japanese.",
    personal: "Elegant. Spacious. Advanced.",
    budget: "Fast. Reliable. Affordable."
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
        <div className={`max-w-5xl ${isRtl ? 'text-right' : 'text-left'} text-white`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-founder tracking-wide leading-tight mb-4">
              {taglines[variant]}
            </h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-founder tracking-wide text-tarabut-teal leading-tight mb-6">
                Toyota Camry.
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-xl md:text-2xl mb-8">
                Experience the Kingdom's best-selling sedan from SAR 1,299/month
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                <Button 
                  className="bg-tarabut-teal hover:bg-tarabut-teal/90 text-black font-semibold px-8 py-6 rounded-lg text-lg"
                  onClick={handleSignupClick}
                >
                  Get on the waitlist
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
