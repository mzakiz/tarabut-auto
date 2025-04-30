
import { useLocation, useParams } from 'react-router-dom';

export const useWaitlistUtils = () => {
  const location = useLocation();
  const params = useParams();
  
  // Extract variant from URL params or pathname
  const getVariant = () => {
    // First try to get it from the URL parameters
    if (params.variant) {
      return params.variant;
    }
    
    // If not available in params, extract from pathname
    const pathParts = location.pathname.split('/');
    const variantIndex = pathParts.findIndex(part => 
      part === 'speed' || part === 'offer' || part === 'budget'
    );
    
    return variantIndex !== -1 ? pathParts[variantIndex] : 'speed';
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

  return {
    getVariant,
    getUtmParams
  };
};
