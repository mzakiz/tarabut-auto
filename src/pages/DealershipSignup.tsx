import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 
  'aol.com', 'mail.com', 'protonmail.com', 'zoho.com'
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .refine((email) => {
      const domain = email.split('@')[1].toLowerCase();
      return !PERSONAL_EMAIL_DOMAINS.includes(domain);
    }, { message: "Please use your work email address" }),
  phone: z.string()
    .regex(/^[0-9]{9}$/, { message: "Phone number must be exactly 9 digits" })
    .transform(val => `+966${val}`),
  dealershipName: z.string().min(2, { message: "Dealership name must be at least 2 characters" })
});

const DealershipSignup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dealershipName: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('dealership_signups')
        .insert({
          name: values.name,
          email: values.email,
          phone: values.phone,
          dealership_name: values.dealershipName
        });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your dealership has been registered successfully!"
      });
      
      const pathParts = location.pathname.split('/');
      const lang = pathParts[1] || 'en';
      const variant = pathParts[2] || 'speed';
      
      navigate(`/${lang}/${variant}/dealership/confirmation`);
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

  const handleBackClick = () => {
    const pathParts = location.pathname.split('/');
    const lang = pathParts[1] || 'en';
    const variant = pathParts[2] || 'speed';
    navigate(`/${lang}/${variant}`);
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
                src="/Logos/Tarabut_Auto-2.png" 
                alt="Tarabut Auto Logo" 
                className="h-24 w-auto"
              />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Dealership Registration</h1>
            <p className="text-center text-gray-600 mb-8">
              Register your dealership with Tarabut Auto
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your full name" 
                          className="h-12" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dealershipName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dealership Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your dealership name" 
                          className="h-12" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Business email address" 
                          className="h-12" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          +966
                        </span>
                        <FormControl>
                          <Input 
                            placeholder="5XXXXXXXX" 
                            className="h-12 pl-16"
                            maxLength={9}
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                      <p className="text-sm text-gray-500 mt-1">Enter 9 digits after +966</p>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Register Dealership"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealershipSignup;
