
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Copy, Share2, ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import confetti from 'canvas-confetti';
import { useAnalyticsPage, Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const Confirmation = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  // Get data from location state or use defaults
  const referralCode = location.state?.referralCode || 'TOYOTA25';
  const waitlistPosition = location.state?.position || 42;
  const affordabilityAmount = 320000;
  
  // Track page view
  useAnalyticsPage('Thank You Page', {
    language,
    waitlist_position: waitlistPosition,
    has_referral: !!location.state?.referralCode
  });
  
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
    
    // Track the copy action
    Analytics.trackCTAClicked({
      element: 'copy_referral_code',
      screen: 'thank_you_page',
      language
    });
  };
  
  const handleBackToHome = () => {
    // Track the navigation action
    Analytics.trackCTAClicked({
      element: 'return_home',
      screen: 'thank_you_page',
      language
    });
    navigate('/');
  };
  
  const handleShare = (method: string) => {
    // Track the share action
    Analytics.trackReferralShared({
      method,
      screen: 'thank_you_page',
      language
    });
    
    // Share functionality would vary by method
    // For now we just show a toast
    toast({
      title: "Sharing via " + method,
      description: "Share your referral code with friends",
    });
    
    // In a real implementation, we would handle different share methods
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=Join%20Tarabut%20Auto%20waitlist%20with%20my%20code:%20${referralCode}`, '_blank');
        break;
        
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=Join%20Tarabut%20Auto%20waitlist%20with%20my%20code:%20${referralCode}`, '_blank');
        break;
        
      case 'email':
        window.location.href = `mailto:?subject=Join%20Tarabut%20Auto%20Waitlist&body=Use%20my%20referral%20code:%20${referralCode}`;
        break;
        
      default:
        if (navigator.share) {
          navigator.share({
            title: 'Join Tarabut Auto Waitlist',
            text: `Use my referral code: ${referralCode}`,
            url: window.location.origin,
          });
        }
    }
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
              <p className="text-center text-gray-600 mb-4">
                You've been added to our exclusive waitlist
              </p>
              
              {/* Waitlist Position */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Your position in waitlist</span>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">#{waitlistPosition}</p>
                <p className="text-xs text-gray-500">
                  Refer friends to move up in the waitlist
                </p>
              </div>
              
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
                  onClick={handleBackToHome}
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white"
                >
                  Back to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => handleShare('whatsapp')}
                    className="flex flex-col items-center justify-center py-2 px-1"
                    size="sm"
                  >
                    <span className="text-lg mb-1">📱</span>
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleShare('twitter')}
                    className="flex flex-col items-center justify-center py-2 px-1"
                    size="sm"
                  >
                    <span className="text-lg mb-1">🐦</span>
                    <span className="text-xs">Twitter</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleShare('email')}
                    className="flex flex-col items-center justify-center py-2 px-1"
                    size="sm"
                  >
                    <span className="text-lg mb-1">✉️</span>
                    <span className="text-xs">Email</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
