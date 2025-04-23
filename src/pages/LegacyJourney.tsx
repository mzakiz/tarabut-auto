
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Head } from '@/components/Head';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const LegacyJourney: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head 
        title="Toyota Camry Legacy Journey | Tarabut Auto"
        description="Legacy Toyota Camry journey for analytics and tracking purposes."
      />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-6">Legacy Journey</h1>
            <p className="text-gray-600 text-center mb-8 text-xl">
              This page contains the legacy journey for analytics and tracking purposes.
            </p>
            
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-8">
              <p className="text-center text-gray-500 mb-4">
                This section is preserved for backup and analytics continuity.
              </p>
            </div>
            
            {/* Toyota Camry Content */}
            <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-video w-full relative">
                <video 
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop
                  playsInline
                >
                  <source src="/Camry-2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h2 className="text-white text-4xl sm:text-5xl font-bold">Toyota Camry</h2>
                </div>
              </div>
              
              {/* Main CTA Section */}
              <div className="bg-tarabut-dark text-white py-16 px-6 text-center">
                <h3 className="text-3xl font-bold mb-6">Start Your Camry Journey Today</h3>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                  Get pre-approved for Shariah-compliant financing on your new Toyota Camry 
                  in just minutes. No obligations, just possibilities.
                </p>
                <Button 
                  size="lg"
                  className="bg-tarabut-blue hover:bg-tarabut-blue/90 text-white px-8 py-6 text-lg"
                  onClick={() => navigate('/waitlist-signup')}
                >
                  Get Pre-Approved Now
                </Button>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Toyota Camry Financing</h3>
                <p className="text-gray-700 mb-4">
                  Experience the premium comfort and reliability of a Toyota Camry with our 
                  Shariah-compliant financing options. The journey to owning a Camry is now simpler than ever.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                      <h4 className="text-xl font-semibold mb-2">Key Features</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>2.5L Dynamic Force Engine</li>
                        <li>Toyota Safety Sense 2.5+</li>
                        <li>Dual-Zone Automatic Climate Control</li>
                        <li>9-inch Touchscreen Display</li>
                        <li>Wireless Charging</li>
                        <li>Panoramic Moonroof</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                      <h4 className="text-xl font-semibold mb-2">Financing Highlights</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Murabaha financing</li>
                        <li>Competitive profit rates</li>
                        <li>Flexible tenure options</li>
                        <li>Quick approval process</li>
                        <li>No hidden fees</li>
                        <li>Fully Shariah-compliant</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-center text-gray-500">
                    This page is maintained for continuity of analytics and tracking. 
                    Please explore our new journey for the latest features and improved experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LegacyJourney;

