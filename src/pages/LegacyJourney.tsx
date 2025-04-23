
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const LegacyJourney: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Legacy Journey</h1>
          <p className="text-gray-600 text-center mb-8">
            This page contains the legacy journey for analytics and tracking purposes.
          </p>
          
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
            <p className="text-center text-gray-500">
              This section is preserved for backup and analytics continuity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegacyJourney;
