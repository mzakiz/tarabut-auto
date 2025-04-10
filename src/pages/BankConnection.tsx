
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Link as LinkIcon, Shield, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import BankSelector from '@/components/BankSelector';
import { motion } from 'framer-motion';

interface StepProps {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  isComplete: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, description, isActive, isComplete }) => (
  <div className={`flex items-start ${isActive ? '' : 'opacity-50'}`}>
    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
      isComplete ? 'bg-green-500' : isActive ? 'bg-ksa-primary' : 'bg-gray-300'
    }`}>
      {isComplete ? (
        <Check className="h-4 w-4 text-white" />
      ) : (
        <span className="text-sm font-medium text-white">{number}</span>
      )}
    </div>
    <div>
      <h4 className="text-sm font-medium text-gray-800">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

const BankConnection = () => {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (selectedBank) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [selectedBank]);

  useEffect(() => {
    if (isConnecting) {
      const timer = setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        setCurrentStep(3);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnecting]);

  const handleConnect = () => {
    setIsConnecting(true);
  };

  const handleContinue = () => {
    navigate('/confirmation');
  };

  const steps = [
    {
      number: 1,
      title: "Select Your Bank",
      description: "Choose your bank from the options below"
    },
    {
      number: 2,
      title: "Connect Account",
      description: "Securely link your bank account for verification"
    },
    {
      number: 3,
      title: "Complete",
      description: "Your bank account has been successfully connected"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/financing-offers')}
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
            <p className="text-center text-gray-600 mb-6">
              Connect your bank account to complete your financing application
            </p>

            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-green-50 rounded-full">
                <LinkIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {steps.map((step, index) => (
                <Step
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  isActive={currentStep >= step.number}
                  isComplete={currentStep > step.number}
                />
              ))}
            </div>
            
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Select your bank from the options below:
                  </h3>
                  <BankSelector
                    onBankSelect={setSelectedBank}
                    selectedBank={selectedBank}
                  />
                </div>
                
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedBank}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-6"
                >
                  {!isConnecting ? (
                    <div className="text-center">
                      <img
                        src={`/Symbols/${selectedBank === 'jazira' ? 'Aljazira_symbol.svg' : 
                          selectedBank === 'sib' ? 'Saudi_Investment_Bank_symbol.svg' :
                          selectedBank === 'rajhi' ? 'Alrajhi_symbol.svg' :
                          selectedBank === 'albilad' ? 'BankAlBilad_symbol.svg' :
                          `${selectedBank.charAt(0).toUpperCase() + selectedBank.slice(1)}_symbol.svg`}`}
                        alt="Bank Logo"
                        className="h-16 w-16 mx-auto mb-4"
                      />
                      <p className="text-sm text-gray-600 mb-4">
                        You are about to connect to your bank account. This process is secure and encrypted.
                      </p>
                      <Button 
                        onClick={handleConnect}
                        className="bg-ksa-primary hover:bg-ksa-primary/90 text-white"
                      >
                        Connect Now
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ksa-primary"></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Connecting to your bank...
                      </p>
                    </div>
                  )}
                </motion.div>
                
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <p className="text-xs text-gray-500">This may take a few moments</p>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                  <div className="h-12 w-12 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-3">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Connection Successful</h3>
                  <p className="text-sm text-gray-600 mt-1">Your bank account has been successfully connected.</p>
                </div>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
            
            <div className="flex flex-col items-center mt-6 space-y-2">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-xs text-gray-500">
                  Your banking information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankConnection;
