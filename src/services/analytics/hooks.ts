
import { useEffect } from 'react';
import { ViewEventProperties } from './types';
import { Analytics } from './index';
import { detectDeviceInfo } from './deviceDetection';

export const useAnalyticsPage = (pageName: string, properties: ViewEventProperties = {}) => {
  useEffect(() => {
    Analytics.page(pageName, {
      ...properties,
      referrer: document.referrer || undefined,
    });
  }, [pageName]); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useDeviceDetection = () => {
  useEffect(() => {
    const deviceInfo = detectDeviceInfo();
    Analytics.trackDeviceDetected(deviceInfo);
  }, []);
};
