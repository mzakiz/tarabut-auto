
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Analytics } from '@/services/analytics';
import { Progress } from '@/components/ui/progress';

interface LoadingScreenProps {
  progress?: number;
  showProgress?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  progress = 0,
  showProgress = false 
}) => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Track loading screen view
    Analytics.page('Loading Screen', {
      language,
      screen: 'loading_screen'
    });
  }, [language]);
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-6">
          <img 
            src="/Logos/Tarabut_Auto-2.png" 
            alt="Tarabut Auto Logo" 
            className="h-16 mb-2"
          />
          
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          
          <p className="text-gray-600 text-lg">
            {language === 'ar' ? 'جاري التقديم...' : 'Submitting...'}
          </p>
          
          {showProgress && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{progress}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
