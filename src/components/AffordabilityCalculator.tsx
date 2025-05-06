import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Analytics } from '@/services/analytics';
import { CalculatorInteractionProperties } from '@/services/analytics/types';

const AffordabilityCalculator = () => {
  const [carPrice, setCarPrice] = useState(120000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isRTL = language === 'ar';
  
  const interestRate = 0; // 0% promotion
  
  const calculateMonthlyPayment = () => {
    // If interest rate is 0, simple division
    if (interestRate === 0) {
      return carPrice / loanTerm;
    }
    return carPrice; // Fallback
  };
  
  // Debounced analytics tracking
  const debounceTimeout = React.useRef<number | null>(null);
  
  const trackAnalyticsDebounced = useCallback((action: CalculatorInteractionProperties['action'], value: number, term: number, payment: number) => {
    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Set new timeout for 1 second
    debounceTimeout.current = window.setTimeout(() => {
      // Only track if user has interacted
      if (!hasInteracted) return;
      
      Analytics.trackCalculatorInteraction({
        action,
        value,
        term,
        monthly_payment: payment,
        currency: 'SAR',
        language,
        screen: 'calculator'
      });
    }, 1000);
  }, [hasInteracted, language]);
  
  // Immediate UI update for car price slider
  const handleCarPriceChange = (value: number[]) => {
    const newPrice = value[0];
    setCarPrice(newPrice);
    
    // Set interaction flag on first interaction
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    // Calculate payment for analytics
    const payment = newPrice / loanTerm;
    
    // Trigger debounced analytics tracking
    trackAnalyticsDebounced('amount_changed', newPrice, loanTerm, payment);
  };
  
  // Immediate UI update for loan term slider
  const handleLoanTermChange = (value: number[]) => {
    const newTerm = value[0];
    setLoanTerm(newTerm);
    
    // Set interaction flag on first interaction
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    // Calculate payment for analytics
    const payment = carPrice / newTerm;
    
    // Trigger debounced analytics tracking
    trackAnalyticsDebounced('term_changed', newTerm, newTerm, payment);
  };
  
  // Update monthly payment when values change
  useEffect(() => {
    const payment = calculateMonthlyPayment();
    setMonthlyPayment(payment);
  }, [carPrice, loanTerm]);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('calculator');
      if (!section) return;
      
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75 && !isVisible) {
        setIsVisible(true);
        
        // Track when calculator becomes visible
        Analytics.trackSectionScrolledTo({
          section: 'calculator',
          screen: 'landing_page',
          language,
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, language]);

  // Arrow icon based on language direction
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Force use of hardcoded translations if needed for calculator section
  const getCalcTranslation = (key: string): string => {
    // Try using the normal translation function first
    let translation = t(key);
    
    // If we got back the key itself (missing translation), use hardcoded fallbacks
    if (translation === key) {
      const fallbacks: Record<string, Record<string, string>> = {
        en: {
          'calculator.title': 'Calculate Your Monthly Payment',
          'calculator.subtitle': 'See if your dream car fits your budget!',
          'calculator.customize': 'Customize Your Monthly Payment',
          'calculator.monthly.payment': 'Monthly Payment',
          'calculator.loan.amount': 'Loan Amount: ',
          'calculator.loan.tenor': 'Loan Term: ',
          'calculator.months': 'months',
          'calculator.cta.question': 'Like what you see?',
          'calculator.cta.action': 'Join the Waitlist'
        },
        ar: {
          'calculator.title': 'احسب قسطك الشهري',
          'calculator.subtitle': 'شوف إذا تقدر تدبر قسط سيارة أحلامك!',
          'calculator.customize': 'عدّل قسطك الشهري',
          'calculator.monthly.payment': 'القسط الشهري',
          'calculator.loan.amount': 'مبلغ التمويل: ',
          'calculator.loan.tenor': 'مدة التمويل: ',
          'calculator.months': 'شهر',
          'calculator.cta.question': 'عجبك العرض؟',
          'calculator.cta.action': 'انضم لقائمة الانتظار'
        }
      };
      
      return fallbacks[language as 'en' | 'ar']?.[key] || key;
    }
    
    return translation;
  };

  return (
    <section id="calculator" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} transition-all duration-1000`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getCalcTranslation('calculator.title')}</h2>
          <p className="text-xl text-gray-600">{getCalcTranslation('calculator.subtitle')}</p>
        </div>

        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Green section with payment information */}
              <div className={`bg-gradient-to-br from-ksa-primary to-ksa-secondary p-8 text-white ${isRTL ? 'md:order-last' : 'md:order-first'}`}>
                <div className={`flex items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calculator className={`h-8 w-8 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <h2 className="text-2xl font-bold">{getCalcTranslation('calculator.customize')}</h2>
                </div>
                
                <div className="mb-8">
                  <div className={`flex justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-medium">{getCalcTranslation('calculator.monthly.payment')}</span>
                    <span className="text-2xl font-bold">SAR {Math.round(monthlyPayment).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(monthlyPayment / 3000) * 100}%`, 
                        maxWidth: '100%',
                        float: isRTL ? 'right' : 'left'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* White section with sliders */}
              <div className={`p-8 ${isRTL ? 'md:order-first' : 'md:order-last'}`}>
                <div className="space-y-6">
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getCalcTranslation('calculator.loan.amount')}: SAR {carPrice.toLocaleString()}
                    </label>
                    <Slider
                      value={[carPrice]}
                      min={80000}
                      max={150000}
                      step={1000}
                      onValueChange={handleCarPriceChange}
                      className="my-4"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                  
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getCalcTranslation('calculator.loan.tenor')}: {loanTerm} {getCalcTranslation('calculator.months')}
                    </label>
                    <Slider
                      value={[loanTerm]}
                      min={36}
                      max={60}
                      step={12}
                      onValueChange={handleLoanTermChange}
                      className="my-4"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl font-medium text-gray-700 mb-4">{getCalcTranslation('calculator.cta.question')}</p>
            <Button 
              onClick={() => navigate('waitlist-signup')}
              className="bg-ksa-primary hover:bg-ksa-primary/90 text-white px-8 py-6 text-lg"
            >
              {getCalcTranslation('calculator.cta.action')}
              <ArrowIcon className={`${isRTL ? 'mr-2' : 'ml-2'} h-5 w-5`} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffordabilityCalculator;
