
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

const AffordabilityCheck = () => {
  const [idNumber, setIdNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idNumber) {
      setError('Please enter your ID/Iqama number');
      return;
    }
    
    if (!agreed) {
      setError('You must agree to the Terms and Conditions');
      return;
    }
    
    // Navigate to Nafath verification page
    navigate('/nafath-verification');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/9505a328-a74d-4a44-95f5-546b93ce1ec3.png" 
                alt="NIC Logo" 
                className="h-12 w-auto"
              />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Verify Your Identity</h1>
            <p className="text-center text-gray-600 mb-8">
              Please enter your ID/Iqama number to proceed with the affordability check
            </p>
            
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                <AlertDescription className="text-blue-700 text-sm">
                  Nafath app must be activated and installed on your phone
                </AlertDescription>
              </div>
            </Alert>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="idNumber" className="text-sm font-medium">
                    ID/Iqama Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="idNumber"
                    type="text"
                    placeholder="1xxxxxxxxx"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full h-12"
                  />
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                  />
                  <div className="grid gap-1">
                    <Label
                      htmlFor="terms"
                      className="text-sm text-gray-700 font-normal"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-ksa-primary hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-ksa-primary hover:underline">
                        Privacy Policy
                      </a>
                      <span className="text-red-500"> *</span>
                    </Label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
            
            <div className="flex items-center justify-center mt-6">
              <Shield className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-xs text-gray-500">
                Your data is secure and protected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffordabilityCheck;
