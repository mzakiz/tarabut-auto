
import React from 'react';
import { useTierDetails } from '@/utils/tierUtils';

interface PointsSectionProps {
  getTranslation: (key: string) => string;
  points: number;
}

export const PointsSection: React.FC<PointsSectionProps> = ({ 
  getTranslation,
  points 
}) => {
  // Get detailed tier information
  const tierDetails = useTierDetails(points);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-3 text-center">
        {getTranslation('confirmation.points_title')}
      </h2>
      
      <p className="text-center text-gray-600 mb-4">
        {getTranslation('confirmation.points_description')}
      </p>
      
      <div className="flex items-center justify-center mb-4">
        <div className="text-3xl font-bold">{points}</div>
        <div className="text-lg ml-2">{getTranslation('confirmation.points')}</div>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-lg font-semibold mb-1">
          {getTranslation('confirmation.your.tier')}
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`${tierDetails.color} w-16 h-16 rounded-full flex items-center justify-center mb-2`}>
            <span className="text-2xl">{tierDetails.emoji}</span>
          </div>
          <div className="text-xl font-bold">{tierDetails.name}</div>
          <div className="text-sm text-gray-500 mt-1">{tierDetails.points}</div>
          <div className="text-md text-gray-700 mt-2 max-w-md">{tierDetails.description}</div>
        </div>
      </div>
    </div>
  );
};
