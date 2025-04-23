import React from 'react';
import Header from '@/components/header/Header';
import CarShowcase from '@/components/CarShowcase';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Head } from '@/components/Head';
import { useTranslation } from '@/hooks/useTranslation';

interface IndexProps {
  variant?: 'speed' | 'personal' | 'budget';
  lang?: 'en' | 'ar';
}

const Index: React.FC<IndexProps> = ({ variant = 'speed', lang }) => {
  const { setLanguage } = useLanguage();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (lang) {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);

  React.useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function() {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Head 
        title={`Tarabut Auto | Shariah-compliant auto financing for Saudi Arabia`}
        description="Experience the best car deals in Saudi Arabia with Shariah-compliant financing options tailored to your needs."
      />
      <Header />
      <CarShowcase variant={variant} />
      <FeaturesSection />
      
      <section id="specs" className="py-12 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ksa-dark mb-3 md:mb-4">
              {t('specs.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              {t('specs.subtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-ksa-dark">{t('car.engine')}</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.engine.type')}</span>
                    <span className="font-medium">{t('specs.engine.type.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.horsepower')}</span>
                    <span className="font-medium">{t('specs.horsepower.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.torque')}</span>
                    <span className="font-medium">{t('specs.torque.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.transmission')}</span>
                    <span className="font-medium">{t('specs.transmission.value')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">{t('specs.acceleration')}</span>
                    <span className="font-medium">{t('specs.acceleration.value')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-ksa-dark">{t('car.dimensions')}</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.length')}</span>
                    <span className="font-medium">{t('specs.length.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.width')}</span>
                    <span className="font-medium">{t('specs.width.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.height')}</span>
                    <span className="font-medium">{t('specs.height.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.wheelbase')}</span>
                    <span className="font-medium">{t('specs.wheelbase.value')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">{t('specs.fuel.tank')}</span>
                    <span className="font-medium">{t('specs.fuel.tank.value')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-ksa-dark">{t('car.comfort')}</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.infotainment')}</span>
                    <span className="font-medium">{t('specs.infotainment.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.climate')}</span>
                    <span className="font-medium">{t('specs.climate.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.seating')}</span>
                    <span className="font-medium">{t('specs.seating.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.sound')}</span>
                    <span className="font-medium">{t('specs.sound.value')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">{t('specs.charging')}</span>
                    <span className="font-medium">{t('specs.charging.value')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-ksa-dark">{t('car.safety')}</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.airbags')}</span>
                    <span className="font-medium">{t('specs.airbags.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.safety')}</span>
                    <span className="font-medium">{t('specs.safety.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.parking')}</span>
                    <span className="font-medium">{t('specs.parking.value')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{t('specs.blindspot')}</span>
                    <span className="font-medium">{t('specs.blindspot.value')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">{t('specs.stability')}</span>
                    <span className="font-medium">{t('specs.stability.value')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
