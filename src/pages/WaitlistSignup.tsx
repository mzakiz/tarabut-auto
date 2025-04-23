import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Twitter, ChromeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

const WaitlistSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSocialLogin = async (provider: 'twitter' | 'google') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/waitlist-signup`
        }
      });

      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error with social login:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: positionData, error: positionError } = await supabase.rpc('get_next_waitlist_position');
      
      if (positionError) throw positionError;
      
      const { data: referralCodeData, error: referralCodeError } = await supabase.rpc('generate_referral_code');
      
      if (referralCodeError) throw referralCodeError;
      
      const { data, error } = await supabase
        .from('waitlist_users')
        .insert({
          name,
          email,
          phone,
          referral_code: referralCodeData,
          referrer_code: referralCode || null,
          position: positionData
        });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You've been added to our waitlist!"
      });
      
      navigate('/confirmation');
    } catch (error: any) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/Logos/tarabut_logo_no_text.png" 
                alt="Tarabut Auto Logo" 
                className="h-12 w-auto"
              />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Join Our Waitlist</h1>
            <p className="text-center text-gray-600 mb-8">
              Be the first to access our Shariah-compliant auto financing
            </p>

            <div className="space-y-4 mb-8">
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => handleSocialLogin('google')}
              >
                <ChromeIcon className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => handleSocialLogin('twitter')}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Continue with Twitter
              </Button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 mt-1"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 mt-1"
                    placeholder="Your email address"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 mt-1"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="referralCode" className="text-sm font-medium">
                    Referral Code (Optional)
                  </Label>
                  <Input
                    id="referralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full h-12 mt-1"
                    placeholder="Enter referral code"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Join Waitlist"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSignup;
