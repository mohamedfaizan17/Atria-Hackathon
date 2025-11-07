import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsAPI } from '../utils/api';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPage = async () => {
      try {
        const device = getDeviceType();
        const browser = getBrowserName();
        
        await analyticsAPI.trackPageView({
          page: location.pathname,
          source: document.referrer || 'direct',
          device,
          browser,
          country: 'Unknown' // Can be enhanced with IP geolocation
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPage();
  }, [location]);

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  const getBrowserName = () => {
    const ua = navigator.userAgent;
    let browserName;
    
    if (ua.includes('Firefox')) {
      browserName = 'Firefox';
    } else if (ua.includes('Chrome')) {
      browserName = 'Chrome';
    } else if (ua.includes('Safari')) {
      browserName = 'Safari';
    } else if (ua.includes('Edge')) {
      browserName = 'Edge';
    } else {
      browserName = 'Other';
    }
    
    return browserName;
  };

  const trackConversion = async (type) => {
    try {
      await analyticsAPI.trackConversion({ type });
    } catch (error) {
      console.error('Conversion tracking error:', error);
    }
  };

  return { trackConversion };
};
