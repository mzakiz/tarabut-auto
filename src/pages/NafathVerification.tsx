
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shield, Lock, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const NafathVerification = () => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Generate a random 6-digit code on component mount
  useEffect(() => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(randomCode);
  }, []);

  const handleVerify = () => {
    // Simulate verification process
    setIsLoading(true);
    setTimeout(() => {
      setIsVerified(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleContinue = () => {
    navigate('/financing-offers');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/affordability-check')}
          className="mb-6"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Identity Verification
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Verify your identity using Nafath to proceed with your financing application
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-green-50 rounded-full">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
            </div>
            
            {!isVerified ? (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Your verification code:</p>
                    <div className="flex justify-center space-x-2">
                      {verificationCode.split('').map((digit, index) => (
                        <div 
                          key={index} 
                          className="w-9 h-12 flex items-center justify-center text-xl font-bold border border-gray-300 rounded-md bg-white"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <p className="text-xs text-center text-gray-500">
                      1. Open the Nafath App on your phone
                    </p>
                    <p className="text-xs text-center text-gray-500">
                      2. Enter the verification code shown above
                    </p>
                    <p className="text-xs text-center text-gray-500">
                      3. Complete the authentication on your device
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                >
                  {isLoading ? "Verifying..." : "I've Completed Verification in Nafath"}
                </Button>
                
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <p className="text-xs text-gray-500">Secure & encrypted verification</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                  <div className="h-12 w-12 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-3">
                    <UserCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Verification Successful</h3>
                  <p className="text-sm text-gray-600 mt-1">Your identity has been verified successfully.</p>
                </div>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <p className="text-xs text-gray-500">Your data is securely protected</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NafathVerification;
