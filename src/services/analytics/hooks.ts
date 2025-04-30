
import { useEffect, useRef, useState } from 'react';
import { ViewEventProperties, ScrollDepthProperties } from './types';
import { Analytics } from './index';
import { detectDeviceInfo } from './deviceDetection';

export const useAnalyticsPage = (pageName: string, properties: ViewEventProperties = {}) => {
  useEffect(() => {
    // Track page view with enhanced properties
    Analytics.page(pageName, {
      ...properties,
      referrer: document.referrer || undefined,
    });
    
    // Track UTM params on initial page load
    const urlParams = new URLSearchParams(window.location.search);
    const hasUtm = urlParams.has('utm_source') || urlParams.has('utm_medium') || 
                  urlParams.has('utm_campaign') || urlParams.has('utm_content') || 
                  urlParams.has('utm_term');
    
    if (hasUtm) {
      const utmProps = {
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
      };
      
      // Track campaign attribution
      Analytics.page('Campaign Landing', {
        ...properties,
        ...utmProps,
        referrer: document.referrer || undefined,
      });
    }
    
    // Track referral attribution
    const refCode = urlParams.get('ref');
    if (refCode) {
      Analytics.trackReferralClicked({
        referral_code: refCode,
        ...properties
      });
    }
    
    // Set up session tracking
    const handleBeforeUnload = () => {
      Analytics.trackSessionEnd();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pageName]); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useDeviceDetection = () => {
  useEffect(() => {
    const deviceInfo = detectDeviceInfo();
    Analytics.trackDeviceDetected(deviceInfo);
  }, []);
};

export const useScrollDepthTracking = () => {
  const scrollDepthsTracked = useRef<Set<number>>(new Set());
  
  useEffect(() => {
    // Track scroll depth at 25%, 50%, 75%, and 100%
    const trackScrollDepth = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      
      // Check each threshold
      [25, 50, 75, 100].forEach(threshold => {
        if (scrollPercentage >= threshold && !scrollDepthsTracked.current.has(threshold)) {
          // Track this threshold
          scrollDepthsTracked.current.add(threshold);
          
          const scrollProps: ScrollDepthProperties = {
            depth: threshold,
            page_path: window.location.pathname
          };
          
          Analytics.trackScrollDepth(scrollProps);
        }
      });
    };
    
    // Add scroll listener
    window.addEventListener('scroll', trackScrollDepth);
    
    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
    };
  }, []);
};

export const useFormAnalytics = (formName: string) => {
  const [formStarted, setFormStarted] = useState(false);
  
  useEffect(() => {
    // Track form view when component mounts
    Analytics.trackFormView({ form_name: formName });
    
    return () => {
      // Clean up any form tracking related state
      sessionStorage.removeItem('form_field_times');
    };
  }, [formName]);
  
  const trackFieldFocus = (fieldName: string) => {
    if (!formStarted) {
      setFormStarted(true);
      Analytics.trackFormStart({ 
        form_name: formName,
        first_field: fieldName
      });
    }
    
    Analytics.trackFormFieldEntered({
      field_name: fieldName,
      screen: formName
    });
  };
  
  const trackFieldBlur = (fieldName: string, value: string) => {
    if (!value) {
      Analytics.trackFormFieldLeftBlank({
        field_name: fieldName,
        screen: formName
      });
    }
  };
  
  const trackFormSubmit = (success: boolean, additionalProps = {}) => {
    Analytics.trackWaitlistFormSubmitted({
      success,
      form_name: formName,
      ...additionalProps
    });
  };
  
  const trackFormError = (reason: string, field?: string) => {
    Analytics.trackFormSubmissionFailed({
      reason,
      field,
      screen: formName
    });
  };
  
  return {
    trackFieldFocus,
    trackFieldBlur,
    trackFormSubmit,
    trackFormError
  };
};

// Hook to track referral sharing
export const useReferralAnalytics = (referralCode: string) => {
  const trackReferralCopy = () => {
    Analytics.trackReferralShared({
      method: 'copy',
      referral_code: referralCode
    });
  };
  
  const trackReferralShare = (method: string) => {
    Analytics.trackReferralShared({
      method,
      referral_code: referralCode
    });
  };
  
  return {
    trackReferralCopy,
    trackReferralShare
  };
};
