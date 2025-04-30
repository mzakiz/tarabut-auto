// Analytics event property interfaces
export interface BaseAnalyticsProperties {
  language?: string;
  variant?: string;
  screen?: string;
  waitlist_position?: number;
  has_referral?: boolean;
  session_id?: string;
  user_id?: string;
  timestamp?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  referral_code?: string;  // Added referral_code to BaseAnalyticsProperties
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
  scroll_depth?: number; // Percentage of section scrolled
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
  form_name?: string;
  time_to_complete?: number; // Time from form_start to form_submit in seconds
}

export interface FormSubmissionFailedProperties extends BaseAnalyticsProperties {
  reason: string;
  field?: string;
}

export interface ReferralSharedProperties extends BaseAnalyticsProperties {
  method: string;
  referral_code: string;
}

export interface ReferralClickedProperties extends BaseAnalyticsProperties {
  referral_code: string;
  referring_user_id?: string;
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
  action: 'amount_changed' | 'term_changed' | 'monthly_payment_updated';
  value: number;
  term?: number;
  monthly_payment?: number;
  currency?: string;
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

export interface ScrollDepthProperties extends BaseAnalyticsProperties {
  depth: number; // 25, 50, 75, or 100 percent
  page_path: string;
}

export interface SessionProperties extends BaseAnalyticsProperties {
  duration_seconds?: number;
  pages_viewed?: number;
  is_bounce?: boolean;
  landing_page?: string;
  exit_page?: string;
}

export interface FormViewProperties extends BaseAnalyticsProperties {
  form_name: string;
}

export interface FormStartProperties extends BaseAnalyticsProperties {
  form_name: string;
  first_field: string;
}

// View events properties
export interface ViewEventProperties extends BaseAnalyticsProperties {
  page_name?: string;          // Name of the page being viewed
  view_location?: string;      // For views within a page (e.g., modal, section)
  view_context?: string;       // Additional context about the view
  referrer?: string;           // Where the user came from
}

// Updated naming for action events
export interface ClickEventProperties extends BaseAnalyticsProperties {
  element_type: string;        // button, link, icon, etc.
  element_location: string;    // header, footer, main, etc.
  element_context?: string;    // Additional context about the click
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
