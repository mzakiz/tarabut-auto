
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Analytics } from '@/services/analytics';
import { useTranslation } from '@/hooks/useTranslation';
import { refreshTranslationVersion } from '@/utils/translationPreloader';
import type { Tables } from '@/integrations/supabase/types';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  variant?: string; // Add variant as an optional parameter
}

export const useWaitlistSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const { t, language } = useTranslation();

  // Extract variant from URL params or pathname
  const getVariant = () => {
    // First try to get it from the URL parameters
    if (params.variant) {
      return params.variant;
    }
    
    // If not available in params, extract from pathname
    const pathParts = location.pathname.split('/');
    const variantIndex = pathParts.findIndex(part => 
      part === 'speed' || part === 'offer' || part === 'budget'
    );
    
    return variantIndex !== -1 ? pathParts[variantIndex] : 'speed';
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Get variant from the form data or extract from the URL
      const variant = formData.variant || getVariant();
      
      // Ensure translation version is refreshed before navigation
      refreshTranslationVersion();
      
      // Get initial alias for the user
      const { data: displayAlias, error: aliasError } = await supabase.rpc('generate_display_alias');
      if (aliasError) throw aliasError;
      
      const { data: positionData, error: positionError } = await supabase.rpc('get_next_waitlist_position');
      if (positionError) throw positionError;
      
      const { data: referralCodeData, error: referralCodeError } = await supabase.rpc('generate_referral_code');
      if (referralCodeError) throw referralCodeError;
      
      // Create the user data object with proper typing
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: `+966${formData.phoneNumber}`,
        referral_code: referralCodeData,
        referrer_code: formData.referralCode || null,
        position: positionData,
        display_alias: displayAlias,
        points: 100, // Initial points
        variant: variant // Store which variant the user signed up from
      } as unknown as Tables<'waitlist_users'>;
      
      const { data: user, error } = await supabase
        .from('waitlist_users')
        .insert(userData)
        .select('position, points, referral_code, status_id')
        .single();
      
      if (error) {
        if (error.code === '23505' && error.message.includes('waitlist_users_email_key')) {
          const { data: existingUser } = await supabase
            .from('waitlist_users')
            .select('position, status_id')
            .eq('email', formData.email)
            .maybeSingle();

          if (existingUser) {
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
      
      Analytics.trackWaitlistFormSubmitted({
        success: true,
        language,
        screen: 'waitlist_form',
        variant
      });
      
      // Instead of using React Router's navigate, use window.location for a full page load
      // This ensures all scripts re-initialize and translations load properly
      const confirmationPath = `/${language}/${variant}/waitlist-signup/confirmation`;
      
      // Create a serialized state object to pass as query parameters
      const stateParams = new URLSearchParams({
        referralCode: referralCodeData,
        position: positionData.toString(),
        points: '100',
        statusId: user?.status_id || '',
        variant
      });
      
      // Navigate to the confirmation page with query parameters instead of state
      window.location.href = `${confirmationPath}?${stateParams.toString()}`;
      
    } catch (error: any) {
      console.error('[useWaitlistSubmission] Error joining waitlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
      
      Analytics.trackFormSubmissionFailed({
        reason: 'server_error',
        screen: 'waitlist_form',
        language,
        variant: formData.variant || getVariant()
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
