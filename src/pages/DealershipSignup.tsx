
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import * as z from 'zod';
import type { Tables } from '@/integrations/supabase/types';
import { Input } from '@/components/ui/input';

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
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isRTL = language === 'ar';
  
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
        } as Tables<'dealership_signups'>);
      
      if (error) throw error;
      
      toast({
        title: t('dealership.success'),
        description: t('dealership.success.description')
      });
      
      const pathParts = location.pathname.split('/');
      const lang = pathParts[1] || 'en';
      const variant = pathParts[2] || 'speed';
      
      navigate(`/${lang}/${variant}/dealership/confirmation`);
    } catch (error: any) {
      console.error('Error registering dealership:', error);
      toast({
        title: t('dealership.error'),
        description: error.message || t('dealership.error.description'),
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
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className={`mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`${isRTL ? 'ml-2 rotate-180' : 'mr-2'} h-4 w-4`} />
          {t('back')}
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

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {t('dealership.registration')}
            </h1>
            <p className="text-center text-gray-600 mb-8">
              {t('dealership.registration.subtitle')}
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`text-sm font-medium block w-full ${isRTL ? 'text-right' : ''}`}>
                        {t('dealership.contact.name')} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('form.placeholder.contact')}
                          className={`h-12 ${isRTL ? 'text-right placeholder:text-right' : ''}`} 
                          {...field} 
                          dir={isRTL ? 'rtl' : 'ltr'}
                          style={isRTL ? { textAlign: 'right' } : undefined}
                        />
                      </FormControl>
                      <FormMessage className={isRTL ? 'text-right' : ''} />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dealershipName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`text-sm font-medium block w-full ${isRTL ? 'text-right' : ''}`}>
                        {t('dealership.name')} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('form.placeholder.dealership')}
                          className={`h-12 ${isRTL ? 'text-right placeholder:text-right' : ''}`} 
                          {...field} 
                          dir={isRTL ? 'rtl' : 'ltr'}
                          style={isRTL ? { textAlign: 'right' } : undefined}
                        />
                      </FormControl>
                      <FormMessage className={isRTL ? 'text-right' : ''} />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`text-sm font-medium block w-full ${isRTL ? 'text-right' : ''}`}>
                        {t('dealership.email')} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={t('form.placeholder.business.email')}
                          className={`h-12 ${isRTL ? 'placeholder:text-right' : ''}`}
                          {...field} 
                          dir="ltr"
                        />
                      </FormControl>
                      <FormMessage className={isRTL ? 'text-right' : ''} />
                      <p className={`text-sm text-gray-500 mt-1 ${isRTL ? 'text-right' : ''}`}>
                        {t('form.validation.work.email')}
                      </p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`text-sm font-medium block w-full ${isRTL ? 'text-right' : ''}`}>
                        {t('dealership.phone')} <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="relative">
                        <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-500`}>
                          +966
                        </span>
                        <FormControl>
                          <Input 
                            placeholder={t('form.placeholder.phone')}
                            className={`h-12 ${isRTL ? 'text-right pr-16' : 'text-left pl-16'} ${isRTL ? 'placeholder:text-right' : ''}`}
                            maxLength={9}
                            {...field} 
                            dir="ltr"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className={isRTL ? 'text-right' : ''} />
                      <p className={`text-sm text-gray-500 mt-1 ${isRTL ? 'text-right' : ''}`}>
                        {t('form.validation.phone')}
                      </p>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('dealership.submitting') : t('dealership.submit')}
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
