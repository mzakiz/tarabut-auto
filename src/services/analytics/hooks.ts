
import { useEffect } from 'react';
import { BaseAnalyticsProperties } from './types';
import { Analytics } from './index';
import { detectDeviceInfo } from './deviceDetection';

export const useAnalyticsPage = (pageName: string, properties: BaseAnalyticsProperties = {}) => {
  useEffect(() => {
    Analytics.page(pageName, properties);
  }, [pageName]); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useDeviceDetection = () => {
  useEffect(() => {
    const deviceInfo = detectDeviceInfo();
    Analytics.trackDeviceDetected(deviceInfo);
  }, []);
};
