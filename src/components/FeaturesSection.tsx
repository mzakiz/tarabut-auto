
import React, { useEffect, useState } from 'react';
import { Shield, Fuel, Wind, Zap, Sparkles, Gauge } from 'lucide-react';

const features = [
  {
    icon: <Fuel className="h-5 w-5 md:h-6 md:w-6" />,
    title: "Fuel Efficiency",
    description: "Class-leading fuel economy of 18.3 km/l for fewer stops at the pump."
  },
  {
    icon: <Shield className="h-5 w-5 md:h-6 md:w-6" />,
    title: "Safety First",
    description: "Advanced Toyota Safety Sense™ with pre-collision system and lane departure alert."
  },
  {
    icon: <Wind className="h-5 w-5 md:h-6 md:w-6" />,
    title: "Dynamic Performance",
    description: "2.5L Dynamic Force Engine delivering 203 HP for responsive acceleration."
  },
  {
    icon: <Zap className="h-5 w-5 md:h-6 md:w-6" />,
    title: "Smart Technology",
    description: "9-inch touchscreen with Apple CarPlay and Android Auto integration."
  },
  {
    icon: <Sparkles className="h-5 w-5 md:h-6 md:w-6" />,
    title: "Premium Interior",
    description: "Leather seats with heating and ventilation for year-round comfort."
  },
  {
    icon: <Gauge className="h-5 w-5 md:h-6 md:w-6" />,
    title: "Smooth Transmission",
    description: "8-speed automatic transmission for seamless driving experience."
  }
];

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('features');
      if (!section) return;
      
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75) {
        const timer = setTimeout(() => {
          const newVisibleFeatures = [...Array(features.length).keys()];
          setVisibleFeatures(newVisibleFeatures);
        }, 100);
        
        return () => clearTimeout(timer);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="features" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ksa-dark mb-3 md:mb-4">Exceptional Features</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            The Toyota Camry combines luxury, performance, and efficiency in a package that's perfect for Saudi roads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform ${
                visibleFeatures.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-ksa-secondary mb-3 md:mb-4 p-2 md:p-3 bg-ksa-secondary/10 inline-block rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-ksa-dark">{feature.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
