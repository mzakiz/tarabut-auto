
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import confetti from 'canvas-confetti';

const Confirmation = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const referralCode = 'TOYOTA25';
  const affordabilityAmount = 320000;
  
  React.useEffect(() => {
    // Launch confetti when component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Referral code copied!",
      description: "Share with friends to move up the waitlist.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
            <div className="p-6 md:p-8">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Congratulations!
              </h1>
              <p className="text-center text-gray-600 mb-8">
                You've been added to our exclusive waitlist
              </p>
              
              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <p className="text-sm text-gray-600 mb-2">Based on your financial profile:</p>
                <p className="text-2xl font-bold text-ksa-primary mb-1">
                  SAR {affordabilityAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Maximum auto financing amount you can afford
                </p>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Affordability Range</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-5 mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">
                  What happens next?
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-700">1</span>
                    </div>
                    <span className="text-gray-700">Our representative will contact you within 48 hours</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-700">2</span>
                    </div>
                    <span className="text-gray-700">You'll receive personalized auto financing options</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-blue-700">3</span>
                    </div>
                    <span className="text-gray-700">Schedule a test drive at your convenience</span>
                  </li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">Share your referral code:</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-l-md px-4 py-2 text-gray-800 font-mono">
                    {referralCode}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="bg-gray-100 border border-gray-200 border-l-0 rounded-r-md px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Share with friends to move up the waitlist and earn exclusive bonuses
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white"
                >
                  Back to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Share functionality would go here
                    toast({
                      title: "Sharing options",
                      description: "Share your referral code with friends",
                    });
                  }}
                  className="w-full"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with Friends
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
