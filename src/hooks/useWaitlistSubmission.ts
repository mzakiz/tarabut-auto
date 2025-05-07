
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { useWaitlistAnalytics } from '@/hooks/useWaitlistAnalytics';
import { useWaitlistUtils } from '@/hooks/useWaitlistUtils';
import { useReferralCodeGeneration } from '@/hooks/useReferralCodeGeneration';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { useTranslationPreloading } from '@/hooks/useTranslationPreloading';
import type { Tables } from '@/integrations/supabase/types';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  variant?: string;
}

export const useWaitlistSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useTranslation();
  const { trackFormSubmission, trackFormSubmissionFailed, trackReferralConversion } = useWaitlistAnalytics();
  const { getVariant, getUtmParams } = useWaitlistUtils();
  const { generateReferralCodes } = useReferralCodeGeneration();
  const { storeWaitlistData } = useSessionStorage();
  const { preloadTranslations } = useTranslationPreloading();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setSubmissionProgress(10);
    
    try {
      // Aggressively preload translations before submission
      await preloadTranslations();
      setSubmissionProgress(20);
      
      // Get variant from the form data or extract from the URL
      const variant = formData.variant || getVariant();
      
      // Get UTM parameters for attribution
      const utmParams = getUtmParams();
      setSubmissionProgress(30);
      
      // Generate all needed codes and position
      const { displayAlias, position: positionData, referralCode: generatedReferralCode } = await generateReferralCodes();
      setSubmissionProgress(50);
      
      // Create the user data object with proper typing
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: `+966${formData.phoneNumber}`,
        referral_code: generatedReferralCode,
        referrer_code: formData.referralCode || null,
        position: positionData,
        display_alias: displayAlias,
        points: 100, // Initial points
        variant: variant, // Store which variant the user signed up from
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium, 
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content,
        utm_term: utmParams.utm_term
      } as unknown as Tables<'waitlist_users'>;
      
      setSubmissionProgress(70);
      
      const { data: user, error } = await supabase
        .from('waitlist_users')
        .insert(userData)
        .select('position, points, referral_code, status_id')
        .single();
      
      setSubmissionProgress(90);
      
      if (error) {
        if (error.code === '23505' && error.message.includes('waitlist_users_email_key')) {
          const { data: existingUser } = await supabase
            .from('waitlist_users')
            .select('position, status_id')
            .eq('email', formData.email)
            .maybeSingle();

          if (existingUser) {
            // Track existing user attempt
            trackFormSubmissionFailed('email_already_exists', variant);
            
            // Redirect to waitlist status page instead of showing a toast
            navigate(`/waitlist-status/${existingUser.status_id}`);
            return;
          }
        }
        throw error;
      }

      toast({
        title: t('form.success'),
        description: t('form.added')
      });
      
      // Track successful waitlist submission
      trackFormSubmission(true, variant, !!formData.referralCode);
      
      // If the user was referred, track a successful referral conversion
      if (formData.referralCode) {
        trackReferralConversion(formData.referralCode, variant);
      }
      
      // Store necessary data in sessionStorage for confirmation page
      storeWaitlistData({
        referralCode: user?.referral_code || generatedReferralCode || '',
        position: user?.position || positionData,
        points: user?.points || 100,
        statusId: user?.status_id || '',
        variant
      });
      
      setSubmissionProgress(95);
      
      // Force preload translations one more time
      await preloadTranslations();
      
      setSubmissionProgress(100);
      
      // Navigate to confirmation page with query parameters
      navigate(`/${language}/${variant}/waitlist-signup/confirmation`, {
        state: {
          referralCode: user?.referral_code || generatedReferralCode || '',
          position: user?.position || positionData,
          points: user?.points || 100,
          statusId: user?.status_id || '',
          variant
        }
      });
      
    } catch (error: any) {
      console.error('[useWaitlistSubmission] Error joining waitlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
      
      // Track form submission failure
      trackFormSubmissionFailed('server_error', formData.variant || getVariant());
    } finally {
      setIsSubmitting(false);
      setSubmissionProgress(0);
    }
  };

  return {
    isSubmitting,
    submissionProgress,
    handleSubmit
  };
};
