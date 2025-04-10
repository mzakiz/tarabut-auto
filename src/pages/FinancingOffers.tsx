
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface BankOffer {
  id: string;
  name: string;
  logo: string;
}

const FinancingOffers = () => {
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Limit banks to only SNB, Al Rajhi, and Alinma
  const bankOffers: BankOffer[] = [
    { 
      id: 'snb', 
      name: 'Saudi National Bank', 
      logo: '/public/Logos/SNB_bank.jpg'
    },
    { 
      id: 'alinma', 
      name: 'Alinma Bank', 
      logo: '/public/Logos/Alinma_bank.png'
    },
    { 
      id: 'rajhi', 
      name: 'Al Rajhi Bank', 
      logo: '/public/Logos/Al_Rajhi_Bank.svg.png'
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOffer) {
      navigate('/bank-connection');
    }
  };

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffer(offerId);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/nafath-verification')}
          className="mb-6"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Choose Your Financing Bank
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Select your preferred bank for auto financing
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-green-50 rounded-full">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bankOffers.map((offer) => (
                  <div 
                    key={offer.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedOffer === offer.id 
                        ? 'border-ksa-primary bg-ksa-primary/5 ring-2 ring-ksa-primary/20 transform scale-105' 
                        : 'border-gray-200 hover:border-ksa-primary/50 hover:transform hover:scale-[1.02]'
                    }`}
                    onClick={() => handleSelectOffer(offer.id)}
                  >
                    <div className="flex flex-col items-center space-y-4 h-full">
                      <div className="h-16 w-full flex items-center justify-center">
                        <img
                          src={offer.logo.replace('/public', '')}
                          alt={offer.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      
                      <p className="text-sm font-medium text-center text-gray-800">{offer.name}</p>
                      
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-auto ${
                        selectedOffer === offer.id 
                          ? 'border-ksa-primary bg-ksa-primary/10' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOffer === offer.id && (
                          <div className="w-3 h-3 rounded-full bg-ksa-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-8">
                <Button 
                  type="submit" 
                  disabled={!selectedOffer}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                >
                  Continue with Selected Bank
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <div className="flex flex-col items-center mt-6 space-y-2">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-xs text-gray-500">
                  Your information is secure and will only be used to process your financing application
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancingOffers;
