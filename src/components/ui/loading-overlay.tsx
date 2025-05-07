
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LoadingOverlayProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Processing...',
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="font-medium text-xl">{message}</h3>
          
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
