
import type {
  BaseAnalyticsProperties,
  ViewEventProperties,
  ClickEventProperties,
  LanguageSwitchedProperties,
  SectionScrolledProperties,
  FormFieldProperties,
  FormDropdownProperties,
  FormSubmittedProperties,
  FormSubmissionFailedProperties,
  ReferralSharedProperties,
  ReferralClickedProperties,
  DeviceDetectedProperties,
  VideoEngagementProperties,
  CalculatorInteractionProperties,
  BankSelectionProperties,
  ErrorProperties,
  ScrollDepthProperties,
  SessionProperties,
  FormViewProperties,
  FormStartProperties
} from './types';

// Generate a unique session ID
const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get or create a session ID from sessionStorage
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);
    sessionStorage.setItem('session_start_time', Date.now().toString());
    sessionStorage.setItem('pages_viewed', '1');
    sessionStorage.setItem('is_bounce', 'true');
  } else {
    // Update pages viewed counter
    const pagesViewed = parseInt(sessionStorage.getItem('pages_viewed') || '1', 10);
    sessionStorage.setItem('pages_viewed', (pagesViewed + 1).toString());
    sessionStorage.setItem('is_bounce', 'false');
  }
  return sessionId;
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

// Get referral code from URL if present
const getReferralCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref') || undefined;
};

// Enhanced analytics service with consistent naming convention and improved tracking
export const Analytics = {
  // Initialize analytics with user identification
  identify: (userId: string, traits: object = {}) => {
    if (window.analytics) {
      window.analytics.identify(userId, traits);
      console.log('Identified User:', userId, traits);
    }
  },

  // Page views with "Viewed:" prefix
  page: (name: string, properties: ViewEventProperties = {}) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      const referralCode = getReferralCode();
      
      const enhancedProps = {
        ...properties,
        ...utmParams,
        session_id: sessionId,
        view_location: properties.view_location || 'page',
        timestamp: Date.now(),
        referral_code: referralCode
      };
      
      window.analytics.track(`Viewed: ${name}`, enhancedProps);
      console.log(`Viewed: ${name}`, enhancedProps);
    }
  },

  // CTA clicks with "Clicked:" prefix
  trackCTAClicked: (props: ClickEventProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track(`Clicked: ${props.element_type}`, enhancedProps);
      console.log(`Clicked: ${props.element_type}`, enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Language switching becomes an action
  trackLanguageSwitched: (props: LanguageSwitchedProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Selected: Language', enhancedProps);
      console.log('Selected: Language', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Track scroll depth with percentages
  trackScrollDepth: (props: ScrollDepthProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track(`Scrolled: ${props.depth}%`, enhancedProps);
      console.log(`Scrolled: ${props.depth}%`, enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Section scrolling becomes a view
  trackSectionScrolledTo: (props: SectionScrolledProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        view_location: 'section',
        timestamp: Date.now()
      };
      
      window.analytics.track(`Viewed: ${props.section} Section`, enhancedProps);
      console.log(`Viewed: ${props.section} Section`, enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Form view tracking
  trackFormView: (props: FormViewProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track(`Viewed: ${props.form_name} Form`, enhancedProps);
      console.log(`Viewed: ${props.form_name} Form`, enhancedProps);
      
      // Mark form view time for calculating completion time
      sessionStorage.setItem('form_view_time', Date.now().toString());
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Form start tracking
  trackFormStart: (props: FormStartProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track(`Started: ${props.form_name} Form`, enhancedProps);
      console.log(`Started: ${props.form_name} Form`, enhancedProps);
      
      // Mark form start time for calculating completion time
      sessionStorage.setItem('form_start_time', Date.now().toString());
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Form interactions become actions
  trackFormFieldEntered: (props: FormFieldProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      const formStartTime = sessionStorage.getItem('form_start_time');
      
      // If no form start time is recorded yet, this is the first field
      if (!formStartTime) {
        sessionStorage.setItem('form_start_time', Date.now().toString());
        
        // Also track form start event
        Analytics.trackFormStart({
          form_name: props.screen || 'unknown_form',
          first_field: props.field_name,
          screen: props.screen
        });
      }
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track(`Entered: Form Field`, enhancedProps);
      console.log('Entered: Form Field', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  trackFormDropdownSelected: (props: FormDropdownProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track(`Selected: Dropdown Option`, enhancedProps);
      console.log('Selected: Dropdown Option', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  trackWaitlistFormSubmitted: (props: FormSubmittedProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      const formStartTime = parseInt(sessionStorage.getItem('form_start_time') || '0', 10);
      const formViewTime = parseInt(sessionStorage.getItem('form_view_time') || '0', 10);
      
      // Calculate time to complete if form start time is available
      let timeToComplete;
      if (formStartTime > 0) {
        timeToComplete = Math.round((Date.now() - formStartTime) / 1000);
      }
      
      // Calculate view to submit time
      let viewToSubmitTime;
      if (formViewTime > 0) {
        viewToSubmitTime = Math.round((Date.now() - formViewTime) / 1000);
      }
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now(),
        time_to_complete: timeToComplete,
        view_to_submit_time: viewToSubmitTime,
        form_name: props.form_name || 'waitlist'
      };
      
      window.analytics.track('Submitted: Waitlist Form', enhancedProps);
      console.log('Submitted: Waitlist Form', enhancedProps);
      
      // Clear form timing data
      sessionStorage.removeItem('form_start_time');
      sessionStorage.removeItem('form_view_time');
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  trackFormSubmissionFailed: (props: FormSubmissionFailedProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Encountered: Form Submission Error', enhancedProps);
      console.log('Encountered: Form Submission Error', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Referral tracking
  trackReferralShared: (props: ReferralSharedProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Shared: Referral', enhancedProps);
      console.log('Shared: Referral', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Track when a user clicks on a referral link
  trackReferralClicked: (props: ReferralClickedProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Clicked: Referral Link', enhancedProps);
      console.log('Clicked: Referral Link', enhancedProps);
    }
  },

  // Device detection
  trackDeviceDetected: (props: DeviceDetectedProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Detected: Device', enhancedProps);
      console.log('Detected: Device', enhancedProps);
    }
  },

  trackFormFieldLeftBlank: (props: FormFieldProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Left Blank: Form Field', enhancedProps);
      console.log('Left Blank: Form Field', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Video engagement tracking
  trackVideoEngagement: (props: VideoEngagementProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Engaged: Video', enhancedProps);
      console.log('Engaged: Video', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Calculator interaction tracking
  trackCalculatorInteraction: (props: CalculatorInteractionProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Interacted: Calculator', enhancedProps);
      console.log('Interacted: Calculator', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Bank selection tracking
  trackBankSelection: (props: BankSelectionProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Selected: Bank', enhancedProps);
      console.log('Selected: Bank', enhancedProps);
      
      // Mark session as not a bounce
      sessionStorage.setItem('is_bounce', 'false');
    }
  },

  // Error tracking
  trackError: (props: ErrorProperties) => {
    if (window.analytics) {
      const sessionId = getSessionId();
      const utmParams = getUtmParams();
      
      const enhancedProps = {
        ...props,
        ...utmParams,
        session_id: sessionId,
        timestamp: Date.now()
      };
      
      window.analytics.track('Encountered: Error', enhancedProps);
      console.log('Encountered: Error', enhancedProps);
    }
  },
  
  // Track session end
  trackSessionEnd: () => {
    if (window.analytics) {
      const sessionId = sessionStorage.getItem('analytics_session_id');
      const sessionStartTime = parseInt(sessionStorage.getItem('session_start_time') || '0', 10);
      const pagesViewed = parseInt(sessionStorage.getItem('pages_viewed') || '1', 10);
      const isBounce = sessionStorage.getItem('is_bounce') === 'true';
      const utmParams = getUtmParams();
      
      if (sessionId && sessionStartTime) {
        const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
        
        const sessionProperties: SessionProperties = {
          session_id: sessionId,
          duration_seconds: sessionDuration,
          pages_viewed: pagesViewed,
          is_bounce: isBounce,
          landing_page: sessionStorage.getItem('landing_page') || window.location.pathname,
          exit_page: window.location.pathname,
          ...utmParams,
          timestamp: Date.now()
        };
        
        window.analytics.track('Ended: Session', sessionProperties);
        console.log('Ended: Session', sessionProperties);
      }
    }
  },
  
  // Page view tracking (alias for page method)
  trackPageViewed: (props: ViewEventProperties) => {
    if (window.analytics) {
      // Store landing page for first page view
      if (!sessionStorage.getItem('landing_page')) {
        sessionStorage.setItem('landing_page', window.location.pathname);
      }
      
      Analytics.page(props.page_name || 'unknown_page', props);
    }
  }
};

export * from './types';
export * from './hooks';
