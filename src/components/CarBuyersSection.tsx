
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CreditCard, Clock, FileCheck, Shield } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';

const CarBuyersSection = () => {
  const { t, isChangingLanguage } = useTranslation();
  const { language } = useLanguage();
  const [visibleBenefits, setVisibleBenefits] = useState<number[]>([]);
  const isRTL = language === 'ar';
  
  const benefits = [
    {
      id: 1,
      icon: <CreditCard className="h-6 w-6 md:h-7 md:w-7" />,
      titleKey: "car_buyers.benefit1.title",
      descriptionKey: "car_buyers.benefit1.description",
    },
    {
      id: 2,
      icon: <Clock className="h-6 w-6 md:h-7 md:w-7" />,
      titleKey: "car_buyers.benefit2.title",
      descriptionKey: "car_buyers.benefit2.description",
    },
    {
      id: 3,
      icon: <Shield className="h-6 w-6 md:h-7 md:w-7" />,
      titleKey: "car_buyers.benefit3.title",
      descriptionKey: "car_buyers.benefit3.description",
    },
    {
      id: 4,
      icon: <FileCheck className="h-6 w-6 md:h-7 md:w-7" />,
      titleKey: "car_buyers.benefit4.title",
      descriptionKey: "car_buyers.benefit4.description",
    }
  ];

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      Analytics.trackSectionScrolledTo({
        section: 'car_buyers',
        screen: 'landing_page',
        language,
      });
      
      const timer = setTimeout(() => {
        const allBenefits = benefits.map(benefit => benefit.id);
        setVisibleBenefits(allBenefits);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [inView, language]);

  return (
    <section id="car-buyers" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ksa-dark mb-3 md:mb-4">
            {isChangingLanguage ? '...' : t('car_buyers.title')}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            {isChangingLanguage ? '...' : t('car_buyers.subtitle')}
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start transition-all duration-500 ease-out transform ${
                visibleBenefits.includes(benefit.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-ksa-secondary/10 p-4 rounded-full shrink-0">
                <div className="text-ksa-secondary">{benefit.icon}</div>
              </div>
              <div className={`${isRTL ? 'mr-6 text-right' : 'ml-6 text-left'}`}>
                <h3 className="text-xl font-semibold mb-3 text-ksa-dark">
                  {isChangingLanguage ? '...' : t(benefit.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {isChangingLanguage ? '...' : t(benefit.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarBuyersSection;
