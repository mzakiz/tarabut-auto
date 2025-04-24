import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { useAnalyticsPage, Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const WaitlistSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  // Track page view
  useAnalyticsPage('Waitlist Form', {
    language
  });

  // Track field focus
  const handleFieldFocus = (fieldName: string) => {
    Analytics.trackFormFieldEntered({
      field_name: fieldName,
      screen: 'waitlist_form',
      language
    });
  };
  
  // Track when a field is blurred (left) without a value
  const handleFieldBlur = (fieldName: string, value: string) => {
    setFormTouched(prev => ({ ...prev, [fieldName]: true }));
    
    if (!value && fieldName !== 'referralCode') {
      Analytics.trackFormFieldLeftBlank({
        field_name: fieldName,
        screen: 'waitlist_form',
        language
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone) {
      toast({
        title: "Error",
        description: t('form.required'),
        variant: "destructive"
      });
      
      Analytics.trackFormSubmissionFailed({
        reason: 'missing_required_field',
        field: !name ? 'name' : !email ? 'email' : 'phone',
        screen: 'waitlist_form',
        language
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
        title: t('form.success'),
        description: t('form.added')
      });
      
      // Track successful form submission
      Analytics.trackWaitlistFormSubmitted({
        success: true,
        language,
        screen: 'waitlist_form'
      });
      
      navigate('/confirmation', { 
        state: { 
          referralCode: referralCodeData,
          position: positionData
        }
      });
    } catch (error: any) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
      
      // Track failed form submission
      Analytics.trackFormSubmissionFailed({
        reason: 'server_error',
        screen: 'waitlist_form',
        language
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    Analytics.trackCTAClicked({
      element: 'back_to_home',
      screen: 'waitlist_form',
      language
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back.home')}
        </Button>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/Logos/Tarabut_Auto-2.png" 
                alt="Tarabut Auto Logo" 
                className="h-[80px] md:h-[100px] w-auto object-contain max-w-full"
              />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{t('waitlist.title')}</h1>
            <p className="text-center text-gray-600 mb-8">
              {t('waitlist.description')}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t('form.name')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => handleFieldFocus('full_name')}
                    onBlur={() => handleFieldBlur('full_name', name)}
                    className={`w-full h-12 mt-1 ${formTouched['full_name'] && !name ? 'border-red-500' : ''}`}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('form.email')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => handleFieldFocus('email')}
                    onBlur={() => handleFieldBlur('email', email)}
                    className={`w-full h-12 mt-1 ${formTouched['email'] && !email ? 'border-red-500' : ''}`}
                    placeholder="Your email address"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {t('form.phone')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => handleFieldFocus('phone')}
                    onBlur={() => handleFieldBlur('phone', phone)}
                    className={`w-full h-12 mt-1 ${formTouched['phone'] && !phone ? 'border-red-500' : ''}`}
                    placeholder="Your phone number"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="referralCode" className="text-sm font-medium">
                    {t('form.referral')}
                  </Label>
                  <Input
                    id="referralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    onFocus={() => handleFieldFocus('referral_code')}
                    className="w-full h-12 mt-1"
                    placeholder="Enter referral code"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-ksa-primary hover:bg-ksa-primary/90 text-white h-12 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('form.submitting') : t('waitlist.join')}
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
