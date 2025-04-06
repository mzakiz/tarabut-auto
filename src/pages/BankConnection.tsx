
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Link, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

interface Bank {
  id: string;
  name: string;
  logo: string;
}

const BankConnection = () => {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const banks: Bank[] = [
    { id: 'alrajhi', name: 'Al Rajhi Bank', logo: '/placeholder.svg' },
    { id: 'sabb', name: 'Saudi British Bank (SABB)', logo: '/placeholder.svg' },
    { id: 'anb', name: 'Arab National Bank', logo: '/placeholder.svg' },
    { id: 'alinma', name: 'Alinma Bank', logo: '/placeholder.svg' },
    { id: 'riyadh', name: 'Riyad Bank', logo: '/placeholder.svg' },
    { id: 'ncb', name: 'Saudi National Bank', logo: '/placeholder.svg' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBank) {
      navigate('/confirmation');
    }
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
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Link Your Bank Account
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Connect your bank account to get your personalized financing options
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-green-50 rounded-full">
                <Link className="h-6 w-6 text-green-500" />
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <p className="text-sm font-medium text-gray-700 mb-4">
                Select your bank:
              </p>
              
              <RadioGroup value={selectedBank} onValueChange={setSelectedBank} className="space-y-3">
                {banks.map((bank) => (
                  <div key={bank.id} className={`flex items-center space-x-3 border rounded-lg p-3 transition-colors ${
                    selectedBank === bank.id ? 'border-ksa-primary bg-ksa-primary/5' : 'border-gray-200'
                  }`}>
                    <RadioGroupItem value={bank.id} id={bank.id} className="border-gray-300" />
                    <Label htmlFor={bank.id} className="flex items-center flex-1 cursor-pointer">
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        className="h-6 w-6 mr-3 bg-gray-100 rounded-md"
                      />
                      <span className="font-medium text-gray-800">{bank.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="pt-8">
                <Button 
                  type="submit" 
                  disabled={!selectedBank}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                >
                  Connect Bank Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <div className="flex flex-col items-center mt-6 space-y-2">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-xs text-gray-500">
                  Your banking information is encrypted and secure
                </p>
              </div>
              <p className="text-xs text-gray-400 text-center">
                We only access the information needed to verify your identity and financial status
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankConnection;
