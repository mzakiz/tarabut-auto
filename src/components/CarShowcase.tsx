
import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Tag, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CarShowcase = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-ksa-dark pt-24 pb-16">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Text content */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left mb-8 lg:mb-0">
            <div 
              className={`inline-block px-4 py-1 rounded-full bg-ksa-secondary/20 text-ksa-secondary border border-ksa-secondary/30 mb-2 transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-sm font-semibold tracking-wider">EXCLUSIVE OFFER</span>
            </div>
            
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight transition-all duration-700 delay-100 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Toyota Camry 2024
              <span className="block text-ksa-secondary mt-2">Yours for Only SAR 1,299/month</span>
            </h1>
            
            <p 
              className={`text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Experience the Kingdom's best-selling sedan with an unbeatable financing offer. 
              Zero down payment and 0% interest for limited time only.
            </p>
            
            <div 
              className={`flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button className="bg-ksa-secondary hover:bg-ksa-secondary/90 text-white rounded-full px-8 py-6 text-lg animate-pulse-button">
                Calculate Affordability
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <a href="#specs" className="text-white hover:text-ksa-secondary transition-colors flex items-center">
                View Specifications
                <ChevronDown className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div 
              className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 transition-all duration-700 delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start">
                <div className="p-2 rounded-full bg-ksa-secondary/20 mr-3">
                  <Check className="h-5 w-5 text-ksa-secondary" />
                </div>
                <span className="text-white">5-Year Warranty</span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start">
                <div className="p-2 rounded-full bg-ksa-secondary/20 mr-3">
                  <Check className="h-5 w-5 text-ksa-secondary" />
                </div>
                <span className="text-white">Free Service</span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start">
                <div className="p-2 rounded-full bg-ksa-secondary/20 mr-3">
                  <Tag className="h-5 w-5 text-ksa-secondary" />
                </div>
                <span className="text-white">0% Interest</span>
              </div>
            </div>
          </div>
          
          {/* Car image */}
          <div 
            className={`w-full lg:w-1/2 transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="relative">
              {/* Main offer badge */}
              <div className="absolute -top-8 -right-8 z-20 bg-ksa-primary text-white p-4 rounded-full h-28 w-28 flex flex-col items-center justify-center transform rotate-12 shadow-lg border-4 border-white/10 animate-float">
                <span className="text-xs font-semibold">STARTING AT</span>
                <span className="text-2xl font-bold">SAR 1,299</span>
                <span className="text-xs">PER MONTH</span>
              </div>
              
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/dde3e8d4-1508-4bc3-b59a-d11fa0c674dd.png" 
                  alt="Toyota Camry 2024" 
                  className="w-full h-auto object-cover rounded-lg"
                  onLoad={() => setIsLoaded(true)} 
                />
                
                {/* Reflective surface under the car */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Financing highlights */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 transition-all duration-700 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="glass p-6 rounded-xl border border-white/10 hover:border-ksa-secondary/30 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-2">0%</div>
            <div className="text-xl font-semibold text-ksa-secondary mb-1">Down Payment</div>
            <p className="text-gray-300">Drive home today with no initial payment</p>
          </div>
          
          <div className="glass p-6 rounded-xl border border-white/10 hover:border-ksa-secondary/30 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-2">0%</div>
            <div className="text-xl font-semibold text-ksa-secondary mb-1">Interest Rate</div>
            <p className="text-gray-300">Zero interest financing available for qualified buyers</p>
          </div>
          
          <div className="glass p-6 rounded-xl border border-white/10 hover:border-ksa-secondary/30 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-2">60</div>
            <div className="text-xl font-semibold text-ksa-secondary mb-1">Months</div>
            <p className="text-gray-300">Flexible payment terms up to 5 years</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
