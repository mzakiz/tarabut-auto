
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Shield, Wallet, Clock, Car } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorksSection = () => {
  const { t, isChangingLanguage } = useTranslation();
  const { language } = useLanguage();
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  
  const steps = [
    {
      id: 1,
      icon: <Shield className="h-8 w-8 md:h-10 md:w-10" />,
      titleKey: "how_it_works.step1.title",
      descriptionKey: "how_it_works.step1.description",
    },
    {
      id: 2,
      icon: <Wallet className="h-8 w-8 md:h-10 md:w-10" />,
      titleKey: "how_it_works.step2.title",
      descriptionKey: "how_it_works.step2.description",
    },
    {
      id: 3,
      icon: <Clock className="h-8 w-8 md:h-10 md:w-10" />,
      titleKey: "how_it_works.step3.title",
      descriptionKey: "how_it_works.step3.description",
    },
    {
      id: 4,
      icon: <Car className="h-8 w-8 md:h-10 md:w-10" />,
      titleKey: "how_it_works.step4.title",
      descriptionKey: "how_it_works.step4.description",
    }
  ];

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      Analytics.trackSectionScrolledTo({
        section: 'how_it_works',
        screen: 'landing_page',
        language,
      });
      
      const timer = setTimeout(() => {
        const allSteps = steps.map(step => step.id);
        setVisibleSteps(allSteps);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [inView, language]);

  const stepDelayBase = 150;

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-tarabut-dark to-tarabut-dark/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            {isChangingLanguage ? '...' : t('how_it_works.title')}
          </h2>
          <p className="text-base md:text-lg text-tarabut-teal max-w-3xl mx-auto px-2">
            {isChangingLanguage ? '...' : t('how_it_works.subtitle')}
          </p>
        </div>

        <div ref={ref} className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2 hidden md:block" />
          
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex items-center mb-12 last:mb-0 transition-all duration-500 ease-out ${
                visibleSteps.includes(step.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              } ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`hidden md:block w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className={`inline-block ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                  <div className="bg-tarabut-teal/20 p-4 rounded-full mb-4 inline-flex">
                    <div className="text-tarabut-teal">{step.icon}</div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
                    {isChangingLanguage ? '...' : t(step.titleKey)}
                  </h3>
                  <p className="text-sm md:text-base text-white/80 max-w-sm">
                    {isChangingLanguage ? '...' : t(step.descriptionKey)}
                  </p>
                </div>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
                <div className="w-10 h-10 rounded-full bg-tarabut-teal flex items-center justify-center text-tarabut-dark font-bold">
                  {step.id}
                </div>
              </div>

              <div className={`md:hidden mt-4 text-center ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                <div className="bg-tarabut-teal/20 p-4 rounded-full mb-4 inline-flex">
                  <div className="text-tarabut-teal">{step.icon}</div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
                  {isChangingLanguage ? '...' : t(step.titleKey)}
                </h3>
                <p className="text-sm md:text-base text-white/80">
                  {isChangingLanguage ? '...' : t(step.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
