
import React from 'react';
import Header from '@/components/Header';
import CarShowcase from '@/components/CarShowcase';
import FeaturesSection from '@/components/FeaturesSection';
import AffordabilityCalculator from '@/components/AffordabilityCalculator';
import Footer from '@/components/Footer';

const Index = () => {
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
    <div className="min-h-screen bg-white">
      <Header />
      <CarShowcase />
      <FeaturesSection />
      
      {/* Car Specifications Section */}
      <section id="specs" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ksa-dark mb-4">Technical Specifications</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Toyota Camry is packed with advanced technology and engineering excellence.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-ksa-dark">Engine & Performance</h3>
                <ul className="space-y-3">
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
                    <span className="text-gray-600">Acceleration (0-100 km/h)</span>
                    <span className="font-medium">8.3 seconds</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-ksa-dark">Dimensions & Capacity</h3>
                <ul className="space-y-3">
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
                    <span className="font-medium">1,455 mm</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Wheelbase</span>
                    <span className="font-medium">2,825 mm</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Fuel Tank Capacity</span>
                    <span className="font-medium">60 Liters</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-ksa-dark">Comfort & Convenience</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Infotainment</span>
                    <span className="font-medium">9" Touchscreen</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Climate Control</span>
                    <span className="font-medium">Dual-Zone Automatic</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Seating</span>
                    <span className="font-medium">Leather, Heated & Ventilated</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Sound System</span>
                    <span className="font-medium">JBL 9-Speaker Premium</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Wireless Charging</span>
                    <span className="font-medium">Yes</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-ksa-dark">Safety & Technology</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Airbags</span>
                    <span className="font-medium">7 Total</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Advanced Safety</span>
                    <span className="font-medium">Toyota Safety Sense™ 2.5+</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Parking Assistance</span>
                    <span className="font-medium">360° Camera System</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Blind Spot Monitor</span>
                    <span className="font-medium">Yes, with Cross Traffic Alert</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Stability Control</span>
                    <span className="font-medium">Vehicle Stability Control (VSC)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <AffordabilityCalculator />
      <Footer />
    </div>
  );
};

export default Index;
