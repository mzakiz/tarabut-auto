
import React, { useEffect, useState } from 'react';
import { Shield, Fuel, Wind, Zap, Sparkles, Gauge } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const { t, isChangingLanguage } = useTranslation();

  const features = [
    {
      icon: <Fuel className="h-5 w-5 md:h-6 md:w-6" />,
      titleKey: "feature.fuel.title",
      descriptionKey: "feature.fuel.description"
    },
    {
      icon: <Shield className="h-5 w-5 md:h-6 md:w-6" />,
      titleKey: "feature.safety.title",
      descriptionKey: "feature.safety.description"
    },
    {
      icon: <Wind className="h-5 w-5 md:h-6 md:w-6" />,
      titleKey: "feature.performance.title",
      descriptionKey: "feature.performance.description"
    },
    {
      icon: <Zap className="h-5 w-5 md:h-6 md:w-6" />,
      titleKey: "feature.tech.title",
      descriptionKey: "feature.tech.description"
    },
    {
      icon: <Sparkles className="h-5 w-5 md:h-6 md:w-6" />,
      titleKey: "feature.interior.title",
      descriptionKey: "feature.interior.description"
    },
    {
      icon: <Gauge className="h-5 w-5 md:h-6 md:w-6" />,
      titleKey: "feature.transmission.title",
      descriptionKey: "feature.transmission.description"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('features');
      if (!section) return;
      
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75) {
        const timer = setTimeout(() => {
          const newVisibleFeatures = [...Array(features.length).keys()];
          setVisibleFeatures(newVisibleFeatures);
        }, 100);
        
        return () => clearTimeout(timer);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log("Current language:", isChangingLanguage ? "changing" : "stable");
  console.log("Features title translation:", t('features.title'));

  return (
    <section id="features" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ksa-dark mb-3 md:mb-4">
            {isChangingLanguage ? '...' : t('features.title')}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            {isChangingLanguage ? '...' : t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform ${
                visibleFeatures.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-ksa-secondary mb-3 md:mb-4 p-2 md:p-3 bg-ksa-secondary/10 inline-block rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-ksa-dark">
                {isChangingLanguage ? '...' : t(feature.titleKey)}
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {isChangingLanguage ? '...' : t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
