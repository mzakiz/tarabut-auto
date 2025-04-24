
import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const AffordabilityCalculator = () => {
  const [carPrice, setCarPrice] = useState(120000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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
  
  useEffect(() => {
    const payment = calculateMonthlyPayment();
    setMonthlyPayment(payment);
  }, [carPrice, loanTerm]);
  
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('calculator');
      if (!section) return;
      
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75) {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="calculator" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} transition-all duration-1000`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('calculator.title')}</h2>
          <p className="text-xl text-gray-600">{t('calculator.subtitle')}</p>
        </div>

        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gradient-to-br from-ksa-primary to-ksa-secondary p-8 text-white">
                <div className="flex items-center mb-6">
                  <Calculator className="h-8 w-8 mr-3" />
                  <h2 className="text-2xl font-bold">{t('calculator.customize')}</h2>
                </div>
                
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{t('calculator.monthly.payment')}</span>
                    <span className="text-2xl font-bold">SAR {Math.round(monthlyPayment).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(monthlyPayment / 3000) * 100}%`, maxWidth: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('calculator.loan.amount')}: SAR {carPrice.toLocaleString()}
                    </label>
                    <Slider
                      value={[carPrice]}
                      min={80000}
                      max={150000}
                      step={1000}
                      onValueChange={(value) => setCarPrice(value[0])}
                      className="my-4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('calculator.loan.tenor')}: {loanTerm} {t('calculator.months')}
                    </label>
                    <Slider
                      value={[loanTerm]}
                      min={36}
                      max={60}
                      step={12}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      className="my-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl font-medium text-gray-700 mb-4">{t('calculator.cta.question')}</p>
            <Button 
              onClick={() => navigate('waitlist-signup')}
              className="bg-ksa-primary hover:bg-ksa-primary/90 text-white px-8 py-6 text-lg"
            >
              {t('calculator.cta.action')}
              <ArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'} h-5 w-5`} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffordabilityCalculator;
