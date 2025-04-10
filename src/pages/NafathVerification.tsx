
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shield, Lock, UserCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';

const NafathVerification = () => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(120); // 2 minutes in seconds
  const [showAppDownload, setShowAppDownload] = useState<boolean>(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Generate a random 2-digit number (10-99) on component mount
  useEffect(() => {
    const randomCode = Math.floor(10 + Math.random() * 90).toString();
    setVerificationCode(randomCode);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining > 0 && !isVerified) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, isVerified]);

  const handleVerify = () => {
    // Simulate verification process
    setIsLoading(true);
    setTimeout(() => {
      setIsVerified(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleRestart = () => {
    // Reset the verification flow
    setTimeRemaining(120);
    const randomCode = Math.floor(10 + Math.random() * 90).toString();
    setVerificationCode(randomCode);
    setIsVerified(false);
  };

  const handleContinue = () => {
    navigate('/financing-offers');
  };

  const handleAppDownload = () => {
    setShowAppDownload(false);
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
              Verify Your Identity
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Use Nafath to securely verify your identity and proceed with your financing application
            </p>

            <div className="flex items-center justify-center mb-6">
              <img 
                src="/Logos/Nafath.svg.png" 
                alt="Nafath Logo" 
                className="h-16 object-contain" 
              />
            </div>
            
            {showAppDownload ? (
              <div className="space-y-6 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-center text-gray-700 mb-4">
                    To continue, you need the Nafath app installed on your device
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="outline"
                      className="flex items-center justify-center"
                      onClick={handleAppDownload}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      App Store
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center justify-center"
                      onClick={handleAppDownload}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Play Store
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <Button 
                      variant="ghost"
                      onClick={handleAppDownload}
                      className="text-sm text-gray-600"
                    >
                      I already have Nafath installed
                    </Button>
                  </div>
                </div>
              </div>
            ) : !isVerified ? (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-1">Your verification code:</p>
                    <div className="text-4xl font-bold text-gray-800 tracking-widest">
                      {verificationCode}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Valid for {formatTime(timeRemaining)}
                    </p>
                  </div>
                  
                  <Progress 
                    value={(timeRemaining / 120) * 100} 
                    className="h-2 mb-4"
                    color={timeRemaining < 30 ? "bg-red-500" : "bg-green-500"}
                  />
                  
                  <div className="mt-4 space-y-4">
                    <p className="text-sm text-center text-gray-700 font-medium">
                      Follow these steps:
                    </p>
                    <ol className="list-decimal text-sm text-gray-600 pl-5 space-y-2">
                      <li>Open the Nafath App on your phone</li>
                      <li>Select "Verify" from the main menu</li>
                      <li>Enter the verification code shown above</li>
                      <li>Confirm your identity using fingerprint or face ID</li>
                    </ol>
                  </div>
                </div>
                
                <Button 
                  onClick={handleVerify}
                  disabled={isLoading || timeRemaining === 0}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                >
                  {isLoading ? "Verifying..." : "I've Completed Verification in Nafath"}
                </Button>
                
                {timeRemaining === 0 && (
                  <Button 
                    onClick={handleRestart}
                    variant="outline"
                    className="w-full h-12"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Code
                  </Button>
                )}
                
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
