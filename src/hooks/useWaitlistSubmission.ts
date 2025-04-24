
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Analytics } from '@/services/analytics';
import { useTranslation } from '@/hooks/useTranslation';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
}

export const useWaitlistSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useTranslation();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Get initial alias for the user
      const { data: displayAlias, error: aliasError } = await supabase.rpc('generate_display_alias');
      if (aliasError) throw aliasError;
      
      const { data: positionData, error: positionError } = await supabase.rpc('get_next_waitlist_position');
      if (positionError) throw positionError;
      
      const { data: referralCodeData, error: referralCodeError } = await supabase.rpc('generate_referral_code');
      if (referralCodeError) throw referralCodeError;
      
      const { data: user, error } = await supabase
        .from('waitlist_users')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: `+966${formData.phoneNumber}`,
          referral_code: referralCodeData,
          referrer_code: formData.referralCode || null,
          position: positionData,
          display_alias: displayAlias,
          points: 100 // Initial points
        })
        .select('position, points, referral_code, status_id')
        .single();
      
      if (error) {
        if (error.code === '23505' && error.message.includes('waitlist_users_email_key')) {
          const { data: existingUser } = await supabase
            .from('waitlist_users')
            .select('position')
            .eq('email', formData.email)
            .maybeSingle();

          if (existingUser) {
            toast({
              title: "You're Already on the Waitlist!",
              description: `Your current position is ${existingUser.position}. We'll reach out to you soon!`,
              variant: "default"
            });
            return;
          }
        }
        throw error;
      }

      toast({
        title: t('form.success'),
        description: t('form.added')
      });
      
      Analytics.trackWaitlistFormSubmitted({
        success: true,
        language,
        screen: 'waitlist_form'
      });
      
      navigate('/confirmation', { 
        state: { 
          referralCode: referralCodeData,
          position: positionData,
          points: 100, // Pass initial points to confirmation page
          statusId: user.status_id // Pass the status ID
        }
      });
    } catch (error: any) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
      
      Analytics.trackFormSubmissionFailed({
        reason: 'server_error',
        screen: 'waitlist_form',
        language
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
