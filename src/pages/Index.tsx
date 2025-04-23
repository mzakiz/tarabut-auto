
import React from 'react';
import Header from '@/components/Header';
import CarShowcase from '@/components/CarShowcase';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Head } from '@/components/Head';

interface IndexProps {
  variant?: 'speed' | 'personal' | 'budget';
  lang?: 'en' | 'ar';
}

const Index: React.FC<IndexProps> = ({ variant = 'speed', lang }) => {
  const { setLanguage } = useLanguage();
  
  // Set the language based on the prop if provided
  React.useEffect(() => {
    if (lang) {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);

  React.useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Offset for fixed header
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
      
      {/* Car Specifications Section */}
      <section id="specs" className="py-12 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ksa-dark mb-3 md:mb-4">Technical Specifications</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              The Toyota Camry is packed with advanced technology and engineering excellence.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-ksa-dark">Engine & Performance</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Engine Type</span>
                    <span className="font-medium">2.5L 4-Cylinder</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Horsepower</span>
                    <span className="font-medium">203 HP @ 6,600 rpm</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Torque</span>
                    <span className="font-medium">249 Nm @ 5,000 rpm</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Transmission</span>
                    <span className="font-medium">8-Speed Automatic</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Acceleration</span>
                    <span className="font-medium">8.3 seconds</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-ksa-dark">Dimensions & Capacity</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Length</span>
                    <span className="font-medium">4,880 mm</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Width</span>
                    <span className="font-medium">1,840 mm</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Height</span>
                    <span className="font-medium">1,445 mm</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Wheelbase</span>
                    <span className="font-medium">2,825 mm</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Fuel Tank</span>
                    <span className="font-medium">60 Liters</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-ksa-dark">Comfort & Convenience</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Infotainment</span>
                    <span className="font-medium">9" Touchscreen</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Climate Control</span>
                    <span className="font-medium">Dual-Zone Auto</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Seating</span>
                    <span className="font-medium">Leather, Heated</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Sound System</span>
                    <span className="font-medium">JBL 9-Speaker</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Wireless Charging</span>
                    <span className="font-medium">Yes</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-ksa-dark">Safety & Technology</h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Airbags</span>
                    <span className="font-medium">7 Total</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Advanced Safety</span>
                    <span className="font-medium">Toyota Safety Sense™</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Parking Help</span>
                    <span className="font-medium">360° Camera</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Blind Spot</span>
                    <span className="font-medium">With Cross Alert</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Stability</span>
                    <span className="font-medium">VSC</span>
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
