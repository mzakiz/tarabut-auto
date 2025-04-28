
import React, { useRef, useEffect } from 'react';
import Header from '@/components/header/Header';
import CarShowcase from '@/components/CarShowcase';
import HowItWorksSection from '@/components/HowItWorksSection';
import CarBuyersSection from '@/components/CarBuyersSection';
import DealershipsSection from '@/components/DealershipsSection';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Head } from '@/components/Head';
import { useTranslation } from '@/hooks/useTranslation';
import { useAnalyticsPage, Analytics, useDeviceDetection } from '@/services/analytics';
import { useInView } from 'react-intersection-observer';
import AffordabilityCalculator from '@/components/AffordabilityCalculator';

interface IndexProps {
  variant?: 'speed' | 'personal' | 'budget';
  lang?: 'en' | 'ar';
}

const Index: React.FC<IndexProps> = ({ variant = 'speed', lang }) => {
  const { setLanguage, language } = useLanguage();
  const { t } = useTranslation();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  
  useAnalyticsPage('Landing Page', {
    language,
    variant
  });
  
  useDeviceDetection();
  
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });
  
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
            
            Analytics.trackCTAClicked({
              element_type: 'link',
              element_location: 'page_content',
              element_context: `navigate_to_${targetId}`,
              screen: 'landing_page',
              language,
              variant
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
  }, [language, variant]);
  
  useEffect(() => {
    if (heroInView) {
      Analytics.trackSectionScrolledTo({
        section: 'hero',
        screen: 'landing_page',
        language,
        variant
      });
    }
  }, [heroInView, language, variant]);

  const handleWaitlistCTA = () => {
    Analytics.trackCTAClicked({
      element_type: 'button',
      element_location: 'hero_section',
      element_context: 'get_on_waitlist',
      screen: 'landing_page',
      language,
      variant
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Head 
        title={`Tarabut Auto | Shariah-compliant auto financing for Saudi Arabia`}
        description="Experience the best car deals in Saudi Arabia with Shariah-compliant financing options tailored to your needs."
      />
      <Header />
      <div id="home" ref={heroRef}>
        <CarShowcase variant={variant} onWaitlistCTAClick={handleWaitlistCTA} />
      </div>
      <HowItWorksSection />
      <CarBuyersSection />
      <DealershipsSection />
      
      <section id="calculator">
        <AffordabilityCalculator />
      </section>
      
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default Index;
