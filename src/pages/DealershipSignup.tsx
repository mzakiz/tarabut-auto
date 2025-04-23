
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const DealershipSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dealershipName, setDealershipName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !dealershipName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('dealership_signups')
        .insert({
          name,
          email,
          phone,
          dealership_name: dealershipName
        });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your dealership has been registered successfully!"
      });
      
      // Redirect to confirmation page
      navigate('/confirmation');
    } catch (error: any) {
      console.error('Error registering dealership:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register dealership. Please try again.",
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

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Dealership Registration</h1>
            <p className="text-center text-gray-600 mb-8">
              Register your dealership with Tarabut Auto
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Contact Person <span className="text-red-500">*</span>
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
                  <Label htmlFor="dealershipName" className="text-sm font-medium">
                    Dealership Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dealershipName"
                    value={dealershipName}
                    onChange={(e) => setDealershipName(e.target.value)}
                    className="w-full h-12 mt-1"
                    placeholder="Your dealership name"
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
                    placeholder="Business email address"
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
                    placeholder="Business phone number"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Register Dealership"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealershipSignup;
