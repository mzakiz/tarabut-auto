import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Calendar, ArrowRight, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const AffordabilityCalculator = () => {
  const [carPrice, setCarPrice] = useState(120000); // SAR
  const [downPayment, setDownPayment] = useState(0);
  const [loanTerm, setLoanTerm] = useState(60); // months
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const interestRate = 0; // 0% promotion
  
  const calculateMonthlyPayment = () => {
    const loanAmount = carPrice - downPayment;
    
    // If interest rate is 0, simple division
    if (interestRate === 0) {
      return loanAmount / loanTerm;
    } else {
      // Standard loan calculation formula
      const monthlyRate = interestRate / 100 / 12;
      return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    }
  };
  
  useEffect(() => {
    const payment = calculateMonthlyPayment();
    setMonthlyPayment(payment);
  }, [carPrice, downPayment, loanTerm]);
  
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
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Calculation complete!",
      description: `Your estimated monthly payment is SAR ${monthlyPayment.toFixed(2)} for ${loanTerm} months.`,
      duration: 5000,
    });
  };

  const formatCurrency = (value: number) => {
    return `SAR ${value.toLocaleString()}`;
  };

  return (
    <section id="calculator" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left side: Info */}
              <div className="bg-gradient-to-br from-ksa-primary to-ksa-secondary p-8 text-white">
                <div className="flex items-center mb-6">
                  <Calculator className="h-8 w-8 mr-3" />
                  <h2 className="text-2xl font-bold">Affordability Calculator</h2>
                </div>
                
                <p className="mb-8 text-white/90">
                  See how affordable your dream Toyota Camry can be with our exclusive financing options.
                </p>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Monthly Payment</span>
                    <span className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full">
                    <div 
                      className="bg-white h-2 rounded-full shimmer-effect"
                      style={{ width: `${(monthlyPayment / 3000) * 100}%`, maxWidth: '100%' }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-white/10 mr-3">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">0% Interest Rate</div>
                      <div className="text-sm text-white/80">Limited time offer</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-white/10 mr-3">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Flexible Terms</div>
                      <div className="text-sm text-white/80">Choose 36-60 months</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-white/10 mr-3">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Personalized Rate</div>
                      <div className="text-sm text-white/80">Based on your financial profile</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-white/10 mr-3">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Priority Waitlist</div>
                      <div className="text-sm text-white/80">Get early access to exclusive offers</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side: Calculator form */}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Customize Your Payment</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Car Price: {formatCurrency(carPrice)}
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
                      Down Payment: {formatCurrency(downPayment)}
                    </label>
                    <Slider
                      value={[downPayment]}
                      min={0}
                      max={carPrice * 0.5}
                      step={1000}
                      onValueChange={(value) => setDownPayment(value[0])}
                      className="my-4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Term: {loanTerm} months
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
                  
                  <Button 
                    type="button" 
                    onClick={() => navigate('/waitlist-signup')}
                    className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white"
                  >
                    Get on the waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffordabilityCalculator;
