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
  DeviceDetectedProperties,
  VideoEngagementProperties,
  CalculatorInteractionProperties,
  BankSelectionProperties,
  ErrorProperties
} from './types';

// Analytics service with consistent naming convention
export const Analytics = {
  // Page views with "Viewed:" prefix
  page: (name: string, properties: ViewEventProperties = {}) => {
    if (window.analytics) {
      window.analytics.track(`Viewed: ${name}`, {
        ...properties,
        view_location: 'page',
      });
      console.log(`Viewed: ${name}`, properties);
    }
  },

  // CTA clicks with "Clicked:" prefix
  trackCTAClicked: (props: ClickEventProperties) => {
    if (window.analytics) {
      window.analytics.track(`Clicked: ${props.element_type}`, props);
      console.log(`Clicked: ${props.element_type}`, props);
    }
  },

  // Language switching becomes an action
  trackLanguageSwitched: (props: LanguageSwitchedProperties) => {
    if (window.analytics) {
      window.analytics.track('Selected: Language', props);
      console.log('Selected: Language', props);
    }
  },

  // Section scrolling becomes a view
  trackSectionScrolledTo: (props: SectionScrolledProperties) => {
    if (window.analytics) {
      window.analytics.track(`Viewed: ${props.section} Section`, {
        ...props,
        view_location: 'section'
      });
      console.log(`Viewed: ${props.section} Section`, props);
    }
  },

  // Form interactions become actions
  trackFormFieldEntered: (props: FormFieldProperties) => {
    if (window.analytics) {
      window.analytics.track(`Entered: Form Field`, props);
      console.log('Entered: Form Field', props);
    }
  },

  trackFormDropdownSelected: (props: FormDropdownProperties) => {
    if (window.analytics) {
      window.analytics.track(`Selected: Dropdown Option`, props);
      console.log('Selected: Dropdown Option', props);
    }
  },

  trackWaitlistFormSubmitted: (props: FormSubmittedProperties) => {
    if (window.analytics) {
      window.analytics.track('Submitted: Waitlist Form', props);
      console.log('Submitted: Waitlist Form', props);
    }
  },

  trackFormSubmissionFailed: (props: FormSubmissionFailedProperties) => {
    if (window.analytics) {
      window.analytics.track('Encountered: Form Submission Error', props);
      console.log('Encountered: Form Submission Error', props);
    }
  },

  // Referral tracking
  trackReferralShared: (props: ReferralSharedProperties) => {
    if (window.analytics) {
      window.analytics.track('Shared: Referral', props);
      console.log('Shared: Referral', props);
    }
  },

  // Device detection
  trackDeviceDetected: (props: DeviceDetectedProperties) => {
    if (window.analytics) {
      window.analytics.track('Detected: Device', props);
      console.log('Detected: Device', props);
    }
  },

  trackFormFieldLeftBlank: (props: FormFieldProperties) => {
    if (window.analytics) {
      window.analytics.track('Left Blank: Form Field', props);
      console.log('Left Blank: Form Field', props);
    }
  },

  // Video engagement tracking
  trackVideoEngagement: (props: VideoEngagementProperties) => {
    if (window.analytics) {
      window.analytics.track('Engaged: Video', props);
      console.log('Engaged: Video', props);
    }
  },

  // Calculator interaction tracking
  trackCalculatorInteraction: (props: CalculatorInteractionProperties) => {
    if (window.analytics) {
      window.analytics.track('Interacted: Calculator', props);
      console.log('Interacted: Calculator', props);
    }
  },

  // Bank selection tracking
  trackBankSelection: (props: BankSelectionProperties) => {
    if (window.analytics) {
      window.analytics.track('Selected: Bank', props);
      console.log('Selected: Bank', props);
    }
  },

  // Error tracking
  trackError: (props: ErrorProperties) => {
    if (window.analytics) {
      window.analytics.track('Encountered: Error', props);
      console.log('Encountered: Error', props);
    }
  }
};

export * from './types';
export * from './hooks';
