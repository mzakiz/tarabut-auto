import { useEffect } from 'react';

// Define event properties interfaces for type safety
export interface BaseAnalyticsProperties {
  language?: string;
  variant?: string;
  screen?: string;
  waitlist_position?: number;
  has_referral?: boolean;
}

export interface CTAClickedProperties extends BaseAnalyticsProperties {
  element: string;
}

export interface LanguageSwitchedProperties extends BaseAnalyticsProperties {
  from: string;
  to: string;
}

export interface SectionScrolledProperties extends BaseAnalyticsProperties {
  section: string;
}

export interface FormFieldProperties extends BaseAnalyticsProperties {
  field_name: string;
}

export interface FormDropdownProperties extends BaseAnalyticsProperties {
  dropdown_name: string;
  selected_option: string;
}

export interface FormSubmittedProperties extends BaseAnalyticsProperties {
  success: boolean;
}

export interface FormSubmissionFailedProperties extends BaseAnalyticsProperties {
  reason: string;
  field?: string;
}

export interface ReferralSharedProperties extends BaseAnalyticsProperties {
  method: string;
}

export interface DeviceDetectedProperties extends BaseAnalyticsProperties {
  device_type: string;
  os: string;
  browser: string;
}

export interface VideoEngagementProperties extends BaseAnalyticsProperties {
  action: 'play' | 'pause' | 'complete';
  duration?: number;
  time?: number;
}

export interface CalculatorInteractionProperties extends BaseAnalyticsProperties {
  action: 'amount_changed' | 'term_changed';
  value: number;
}

export interface BankSelectionProperties extends BaseAnalyticsProperties {
  bank_id: string;
  bank_name: string;
}

export interface ErrorProperties extends BaseAnalyticsProperties {
  error_type: string;
  error_message: string;
  component?: string;
}

// Analytics service with type-safe methods
export const Analytics = {
  // Page views
  page: (name: string, properties: BaseAnalyticsProperties = {}) => {
    if (window.analytics) {
      window.analytics.page(name, properties);
      console.log('Page tracked:', name, properties);
    }
  },

  // CTA clicks
  trackCTAClicked: (props: CTAClickedProperties) => {
    if (window.analytics) {
      window.analytics.track('cta_clicked', props);
      console.log('Track CTA clicked:', props);
    }
  },

  // Language switching
  trackLanguageSwitched: (props: LanguageSwitchedProperties) => {
    if (window.analytics) {
      window.analytics.track('language_switched', props);
      console.log('Track language switched:', props);
    }
  },

  // Section scrolling
  trackSectionScrolledTo: (props: SectionScrolledProperties) => {
    if (window.analytics) {
      window.analytics.track('section_scrolled_to', props);
      console.log('Track section scrolled to:', props);
    }
  },

  // Form field interaction
  trackFormFieldEntered: (props: FormFieldProperties) => {
    if (window.analytics) {
      window.analytics.track('form_field_entered', props);
      console.log('Track form field entered:', props);
    }
  },

  // Form dropdown selection
  trackFormDropdownSelected: (props: FormDropdownProperties) => {
    if (window.analytics) {
      window.analytics.track('form_dropdown_selected', props);
      console.log('Track form dropdown selected:', props);
    }
  },

  // Form submission success
  trackWaitlistFormSubmitted: (props: FormSubmittedProperties) => {
    if (window.analytics) {
      window.analytics.track('waitlist_form_submitted', props);
      console.log('Track form submitted:', props);
    }
  },

  // Form submission failure
  trackFormSubmissionFailed: (props: FormSubmissionFailedProperties) => {
    if (window.analytics) {
      window.analytics.track('form_submission_failed', props);
      console.log('Track form submission failed:', props);
    }
  },

  // Referral sharing
  trackReferralShared: (props: ReferralSharedProperties) => {
    if (window.analytics) {
      window.analytics.track('referral_shared', props);
      console.log('Track referral shared:', props);
    }
  },

  // Device detection
  trackDeviceDetected: (props: DeviceDetectedProperties) => {
    if (window.analytics) {
      window.analytics.track('device_detected', props);
      console.log('Track device detected:', props);
    }
  },

  // Form field left blank
  trackFormFieldLeftBlank: (props: FormFieldProperties) => {
    if (window.analytics) {
      window.analytics.track('form_field_left_blank', props);
      console.log('Track form field left blank:', props);
    }
  },

  // Video engagement tracking
  trackVideoEngagement: (props: VideoEngagementProperties) => {
    if (window.analytics) {
      window.analytics.track('video_engagement', props);
      console.log('Track video engagement:', props);
    }
  },

  // Calculator interaction tracking
  trackCalculatorInteraction: (props: CalculatorInteractionProperties) => {
    if (window.analytics) {
      window.analytics.track('calculator_interaction', props);
      console.log('Track calculator interaction:', props);
    }
  },

  // Bank selection tracking
  trackBankSelection: (props: BankSelectionProperties) => {
    if (window.analytics) {
      window.analytics.track('bank_selected', props);
      console.log('Track bank selected:', props);
    }
  },

  // Error tracking
  trackError: (props: ErrorProperties) => {
    if (window.analytics) {
      window.analytics.track('error_occurred', props);
      console.log('Track error:', props);
    }
  }
};

// React hook for page views
export const useAnalyticsPage = (pageName: string, properties: BaseAnalyticsProperties = {}) => {
  useEffect(() => {
    Analytics.page(pageName, properties);
    // We only want to track the page view once when the component mounts
  }, [pageName]); // eslint-disable-line react-hooks/exhaustive-deps
};

// React hook for device detection
export const useDeviceDetection = () => {
  useEffect(() => {
    // Simple device detection logic
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    let os = 'unknown';
    let browser = 'unknown';

    // Device type detection
    if (/mobile/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    // OS detection
    if (/windows/i.test(userAgent)) {
      os = 'Windows';
    } else if (/macintosh|mac os/i.test(userAgent)) {
      os = 'macOS';
    } else if (/android/i.test(userAgent)) {
      os = 'Android';
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      os = 'iOS';
    } else if (/linux/i.test(userAgent)) {
      os = 'Linux';
    }

    // Browser detection
    if (/edge/i.test(userAgent)) {
      browser = 'Edge';
    } else if (/chrome/i.test(userAgent)) {
      browser = 'Chrome';
    } else if (/firefox/i.test(userAgent)) {
      browser = 'Firefox';
    } else if (/safari/i.test(userAgent)) {
      browser = 'Safari';
    } else if (/msie|trident/i.test(userAgent)) {
      browser = 'Internet Explorer';
    }

    // Track the device information
    Analytics.trackDeviceDetected({
      device_type: deviceType,
      os,
      browser,
      screen: 'global'
    });
  }, []);
};

// Type definition for window.analytics
declare global {
  interface Window {
    analytics?: {
      page: (name: string, properties?: object) => void;
      track: (event: string, properties?: object) => void;
      identify: (userId: string, traits?: object) => void;
    };
  }
}
