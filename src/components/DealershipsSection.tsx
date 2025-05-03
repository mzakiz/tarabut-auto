
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Zap, BarChart, Gauge, Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const DealershipsSection = () => {
  const { t, isChangingLanguage } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [visibleBenefits, setVisibleBenefits] = useState<number[]>([]);
  const isRTL = language === 'ar';
  
  const benefits = [
    {
      id: 1,
      icon: <Zap className="h-6 w-6 md:h-7 md:w-7" />,
      titleKey: "dealerships.benefit1.title",
      descriptionKey: "dealerships.benefit1.description",
    },
    {
      id: 2,
      icon: <BarChart className="h-6 w-6 md:h-7 md:w-7" />,
      titleKey: "dealerships.benefit2.title",
      descriptionKey: "dealerships.benefit2.description",
    },
    {
      id: 3,
      icon: <Gauge className="h-6 w-6 md:h-7 md:w-7" />,
      titleKey: "dealerships.benefit3.title",
      descriptionKey: "dealerships.benefit3.description",
    },
    {
      id: 4,
      icon: <Users className="h-6 w-6 md:h-7 md:w-7" />,
      titleKey: "dealerships.benefit4.title",
      descriptionKey: "dealerships.benefit4.description",
    }
  ];

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      Analytics.trackSectionScrolledTo({
        section: 'dealerships',
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

  const handleDealershipClick = () => {
    Analytics.trackCTAClicked({
      element_type: 'button',
      element_location: 'dealerships_section',
      element_context: 'dealership_registration',
      screen: 'landing_page',
      language
    });
    
    navigate(`/${language}/speed/dealership`);
  };

  return (
    <section id="dealerships" className="py-16 md:py-24 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ksa-dark mb-3 md:mb-4">
            {isChangingLanguage ? '...' : t('dealerships.title')}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            {isChangingLanguage ? '...' : t('dealerships.subtitle')}
          </p>
        </div>

        <div ref={ref} className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`md:col-span-3 bg-gradient-to-r from-tarabut-purple to-tarabut-blue rounded-xl p-8 text-white transition-all duration-500 ease-out transform ${
                visibleBenefits.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {isRTL ? (
                  <>
                    <div className="text-center md:text-right">
                      <h3 className="text-2xl font-semibold mb-4">
                        {isChangingLanguage ? '...' : t(benefits[0].titleKey)}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {isChangingLanguage ? '...' : t(benefits[0].descriptionKey)}
                      </p>
                    </div>
                    <div className="bg-white/20 p-6 rounded-full shrink-0">
                      {benefits[0].icon}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/20 p-6 rounded-full shrink-0">
                      {benefits[0].icon}
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-semibold mb-4">
                        {isChangingLanguage ? '...' : t(benefits[0].titleKey)}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {isChangingLanguage ? '...' : t(benefits[0].descriptionKey)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {benefits.slice(1).map((benefit, index) => (
              <div
                key={benefit.id}
                className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-500 ease-out transform ${
                  visibleBenefits.includes(benefit.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-tarabut-secondary/10 p-4 rounded-full mb-4">
                    <div className="text-tarabut-secondary">{benefit.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-ksa-dark text-center">
                    {isChangingLanguage ? '...' : t(benefit.titleKey)}
                  </h3>
                  <p className="text-gray-600 flex-grow text-center">
                    {isChangingLanguage ? '...' : t(benefit.descriptionKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleDealershipClick}
            className="bg-tarabut-secondary hover:bg-tarabut-secondary/90 text-white px-8 py-5 rounded-md text-md md:text-lg"
          >
            {isChangingLanguage ? '...' : t('dealership.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DealershipsSection;
