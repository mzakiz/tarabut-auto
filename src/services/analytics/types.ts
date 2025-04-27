
// Analytics event property interfaces
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
