
import { 
  preloadAllTranslations, 
  storeTranslationsInSession,
  refreshTranslationVersion 
} from '@/utils/translationPreloader';
import { useTranslation } from '@/hooks/useTranslation';

export const useTranslationPreloading = () => {
  const { refreshTranslations } = useTranslation();
  
  const preloadTranslations = async () => {
    for (let i = 0; i < 3; i++) {
      preloadAllTranslations();
      storeTranslationsInSession();
      refreshTranslationVersion();
      refreshTranslations();
    }
  };
  
  return { preloadTranslations };
};
