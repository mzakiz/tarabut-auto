
import type {
  BaseAnalyticsProperties,
  CTAClickedProperties,
  LanguageSwitchedProperties,
  SectionScrolledProperties,
  FormFieldProperties,
  FormDropdownProperties,
  FormSubmittedProperties,
  FormSubmissionFailedProperties,
  ReferralSharedProperties,
  DeviceDetectedProperties,
  VideoEngagementProperties,
  CalculatorInteractionProperties,
  BankSelectionProperties,
  ErrorProperties
} from './types';

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

  // Form interactions
  trackFormFieldEntered: (props: FormFieldProperties) => {
    if (window.analytics) {
      window.analytics.track('form_field_entered', props);
      console.log('Track form field entered:', props);
    }
  },

  trackFormDropdownSelected: (props: FormDropdownProperties) => {
    if (window.analytics) {
      window.analytics.track('form_dropdown_selected', props);
      console.log('Track form dropdown selected:', props);
    }
  },

  trackWaitlistFormSubmitted: (props: FormSubmittedProperties) => {
    if (window.analytics) {
      window.analytics.track('waitlist_form_submitted', props);
      console.log('Track form submitted:', props);
    }
  },

  trackFormSubmissionFailed: (props: FormSubmissionFailedProperties) => {
    if (window.analytics) {
      window.analytics.track('form_submission_failed', props);
      console.log('Track form submission failed:', props);
    }
  },

  // Referral tracking
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

export * from './types';
export * from './hooks';
