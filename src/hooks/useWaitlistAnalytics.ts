
import { Analytics } from '@/services/analytics';
import { useTranslation } from '@/hooks/useTranslation';

export const useWaitlistAnalytics = () => {
  const { language } = useTranslation();

  const trackFormSubmission = (
    success: boolean, 
    variant: string,
    hasReferral: boolean
  ) => {
    Analytics.trackWaitlistFormSubmitted({
      success,
      language,
      screen: 'waitlist_form',
      variant,
      has_referral: hasReferral,
      form_name: 'waitlist'
    });
  };

  const trackFormSubmissionFailed = (
    reason: string,
    variant: string
  ) => {
    Analytics.trackFormSubmissionFailed({
      reason,
      screen: 'waitlist_form',
      language,
      variant
    });
  };

  const trackReferralConversion = (
    referralCode: string,
    variant: string
  ) => {
    Analytics.trackPageViewed({
      page_name: 'Converted: Referral',
      screen: 'waitlist_form',
      language,
      variant,
      referral_code: referralCode
    });
  };

  return {
    trackFormSubmission,
    trackFormSubmissionFailed,
    trackReferralConversion
  };
};
