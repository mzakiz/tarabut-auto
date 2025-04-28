
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Shield, Bank, Clock, Car } from 'lucide-react';
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
      icon: <Bank className="h-8 w-8 md:h-10 md:w-10" />,
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

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 transition-all duration-500 ease-out transform ${
                visibleSteps.includes(step.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * stepDelayBase}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-tarabut-teal/20 p-4 rounded-full mb-4">
                  <div className="text-tarabut-teal">{step.icon}</div>
                </div>
                <div className="rounded-full bg-white/10 w-8 h-8 flex items-center justify-center mb-4">
                  <span className="text-white font-bold">{step.id}</span>
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
