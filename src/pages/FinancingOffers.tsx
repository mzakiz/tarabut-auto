
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface BankOffer {
  id: string;
  name: string;
  logo: string;
  rate: string;
  monthlyPayment: string;
  term: string;
}

const FinancingOffers = () => {
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const bankOffers: BankOffer[] = [
    { 
      id: 'snb', 
      name: 'Saudi National Bank', 
      logo: '/lovable-uploads/580cdf86-1e30-4e43-b478-918ba8465477.png',
      rate: '3.25%',
      monthlyPayment: 'SAR 1,299',
      term: '60 months'
    },
    { 
      id: 'alinma', 
      name: 'Alinma Bank', 
      logo: '/lovable-uploads/31b970d9-aa94-423f-810d-5bdbbcc48de1.png',
      rate: '3.5%',
      monthlyPayment: 'SAR 1,325',
      term: '60 months'
    },
    { 
      id: 'albilad', 
      name: 'Bank Albilad', 
      logo: '/lovable-uploads/4adab54e-e074-48a5-8c91-4c7eee0656f0.png',
      rate: '3.75%',
      monthlyPayment: 'SAR 1,350',
      term: '60 months'
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
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Choose Your Financing Offer
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Select from tailored auto financing offers from leading Saudi banks
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-green-50 rounded-full">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {bankOffers.map((offer) => (
                  <div 
                    key={offer.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedOffer === offer.id 
                        ? 'border-ksa-primary bg-ksa-primary/5 ring-2 ring-ksa-primary/20' 
                        : 'border-gray-200 hover:border-ksa-primary/50'
                    }`}
                    onClick={() => handleSelectOffer(offer.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-white rounded-lg p-2">
                        <img
                          src={offer.logo}
                          alt={offer.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">{offer.name}</h3>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Rate</p>
                            <p className="text-sm font-medium">{offer.rate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Monthly</p>
                            <p className="text-sm font-medium">{offer.monthlyPayment}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Term</p>
                            <p className="text-sm font-medium">{offer.term}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
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
                  </div>
                ))}
              </div>
              
              <div className="pt-8">
                <Button 
                  type="submit" 
                  disabled={!selectedOffer}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                >
                  Continue with Selected Offer
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
              <p className="text-xs text-gray-400 text-center">
                By continuing, you agree to our terms and conditions for auto financing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancingOffers;
