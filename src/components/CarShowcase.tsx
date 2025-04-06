
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, Tag, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CarShowcase = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Try to manually load the video if needed
    if (videoRef.current) {
      videoRef.current.load();
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleAffordabilityCheck = () => {
    navigate('/affordability-check');
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-tarabut-dark pt-16 md:pt-24 pb-8 md:pb-16">
      {/* Video background with adjusted overlay */}
      <div className="absolute inset-0 bg-tarabut-dark/20 md:bg-tarabut-dark/10 z-10"></div>
      <div className="absolute inset-0 overflow-hidden">
        <video 
          ref={videoRef}
          className="absolute w-full h-full object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/Camry-2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col items-center justify-center min-h-[75vh] md:min-h-[80vh] text-center">
          {/* Main headline - updated typography */}
          <h1 
            className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-normal text-white leading-tight mb-4 transition-all duration-700 delay-100 max-w-4xl mx-auto font-founder tracking-tight ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Advanced. Reliable.
            <br />
            Japanese. <span className="font-medium text-tarabut-teal">Toyota Camry.</span>
          </h1>
          
          <p 
            className={`text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 font-founder px-4 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Experience the Kingdom's best-selling sedan from SAR 1,299/month
          </p>
          
          <div 
            className={`transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button 
              className="bg-tarabut-teal hover:bg-tarabut-teal/90 text-tarabut-dark font-medium rounded-md px-6 md:px-10 py-5 md:py-6 text-base md:text-lg min-h-[44px] min-w-[200px]"
              onClick={handleAffordabilityCheck}
            >
              CALCULATE AFFORDABILITY
            </Button>
          </div>
        </div>
        
        {/* Vehicle specs at the bottom - updated typography */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-auto border-t border-white/10 pt-6 md:pt-10 transition-all duration-700 delay-700 font-founder ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center">
            <div className="text-xs text-white/80 uppercase tracking-wider mb-1">ENGINE</div>
            <div className="text-xl md:text-2xl font-medium text-white mb-1">2.5L</div>
            <div className="text-xs md:text-sm text-white/80">4-Cylinder</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-white/80 uppercase tracking-wider mb-1">MONTHLY</div>
            <div className="text-xl md:text-2xl font-medium text-white mb-1">SAR 1,299</div>
            <div className="text-xs md:text-sm text-white/80">0% Interest</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-white/80 uppercase tracking-wider mb-1">POWER</div>
            <div className="text-xl md:text-2xl font-medium text-white mb-1">203 hp</div>
            <div className="text-xs md:text-sm text-white/80">@ 6,600 rpm</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-white/80 uppercase tracking-wider mb-1">FUEL</div>
            <div className="text-xl md:text-2xl font-medium text-white mb-1">7.2L/100km</div>
            <div className="text-xs md:text-sm text-white/80">Combined</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
