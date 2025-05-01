
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusURLProps {
  getTranslation: (key: string) => string;
  statusId: string;
}

export const StatusURL: React.FC<StatusURLProps> = ({ 
  getTranslation,
  statusId 
}) => {
  const [copied, setCopied] = useState(false);
  
  // Generate status URL
  const statusURL = `${window.location.origin}/waitlist-status/${statusId}`;
  
  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(statusURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-3 text-center">
        {getTranslation('waitlist.status.check')}
      </h2>
      
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 border rounded flex-1 py-2 px-3 text-sm overflow-x-auto whitespace-nowrap">
          {statusURL}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 whitespace-nowrap" 
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              <span>{getTranslation('confirmation.code.copied')}</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              <span>{getTranslation('confirmation.copy')}</span>
            </>
          )}
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 text-center">
        {getTranslation('confirmation.code.share')}
      </p>
    </div>
  );
};
