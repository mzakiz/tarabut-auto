
import React from 'react';

interface PointsSectionProps {
  getTranslation: (key: string) => string;
  points: number;
}

export const PointsSection: React.FC<PointsSectionProps> = ({ 
  getTranslation,
  points 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-2 text-center">
        {getTranslation('confirmation.points_title')}
      </h2>
      <div className="flex justify-center items-center space-x-2 mb-4">
        <span className="text-3xl font-bold text-tarabut-dark">{points}</span>
        <span className="text-gray-600">{getTranslation('confirmation.points')}</span>
      </div>
      <p className="text-sm text-gray-600 text-center">
        {getTranslation('confirmation.points_description')}
      </p>
    </div>
  );
};
