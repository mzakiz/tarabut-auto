
import { DeviceDetectedProperties } from './types';
import { Analytics } from './index';

export const detectDeviceInfo = (): DeviceDetectedProperties => {
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

  return {
    device_type: deviceType,
    os,
    browser,
    screen: 'global'
  };
};
