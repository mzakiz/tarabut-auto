
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Analytics } from '@/services/analytics';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  preloadAllTranslations, 
  storeTranslationsInSession,
  refreshTranslationVersion 
} from '@/utils/translationPreloader';
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
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const { t, language, refreshTranslations } = useTranslation();

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
  
  // Extract UTM parameters from URL
  const getUtmParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
    };
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Aggressively preload translations before submission
      for (let i = 0; i < 3; i++) {
        preloadAllTranslations();
        storeTranslationsInSession();
        refreshTranslationVersion();
        refreshTranslations();
      }
      
      // Get variant from the form data or extract from the URL
      const variant = formData.variant || getVariant();
      
      // Get UTM parameters for attribution
      const utmParams = getUtmParams();
      const sessionId = sessionStorage.getItem('analytics_session_id');
      
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
        variant: variant, // Store which variant the user signed up from
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium, 
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content,
        utm_term: utmParams.utm_term,
        session_id: sessionId
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
            // Track existing user attempt
            Analytics.trackFormSubmissionFailed({
              reason: 'email_already_exists',
              screen: 'waitlist_form',
              language,
              variant
            });
            
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
      Analytics.trackWaitlistFormSubmitted({
        success: true,
        language,
        screen: 'waitlist_form',
        variant,
        has_referral: !!formData.referralCode,
        form_name: 'waitlist'
      });
      
      // If the user was referred, track a successful referral conversion
      if (formData.referralCode) {
        // Fix: Replace the generic track method with a proper analytics method
        // Analytics.track('Converted: Referral', {
        Analytics.trackPageViewed({
          page_name: 'Converted: Referral',
          referral_code: formData.referralCode,
          screen: 'waitlist_form',
          language,
          variant
        });
      }
      
      // Store necessary data in sessionStorage for confirmation page
      sessionStorage.setItem('waitlist_referralCode', user?.referral_code || referralCodeData || '');
      sessionStorage.setItem('waitlist_position', user?.position.toString() || positionData.toString());
      sessionStorage.setItem('waitlist_points', user?.points?.toString() || '100');
      sessionStorage.setItem('waitlist_statusId', user?.status_id || '');
      sessionStorage.setItem('waitlist_variant', variant);
      sessionStorage.setItem('waitlist_timestamp', Date.now().toString());
      
      // Force preload translations one more time
      preloadAllTranslations();
      storeTranslationsInSession();
      
      // Create URL with query parameters - use full absolute URL
      const baseUrl = window.location.origin;
      const confirmationPath = `/${language}/${variant}/waitlist-signup/confirmation`;
      const confirmationUrl = `${baseUrl}${confirmationPath}?` + new URLSearchParams({
        referralCode: user?.referral_code || referralCodeData || '',
        position: user?.position.toString() || positionData.toString(),
        points: user?.points?.toString() || '100',
        statusId: user?.status_id || '',
        variant,
        refresh: Date.now().toString() // Force cache invalidation
      }).toString();
      
      // Use hard navigation to force a complete page reload with translations
      window.location.href = confirmationUrl;
      
    } catch (error: any) {
      console.error('[useWaitlistSubmission] Error joining waitlist:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
      
      // Track form submission failure
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
