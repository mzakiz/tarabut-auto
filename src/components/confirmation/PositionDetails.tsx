
import React from 'react';

interface PositionDetailsProps {
  getTranslation: (key: string) => string;
  position: number;
}

export const PositionDetails: React.FC<PositionDetailsProps> = ({ 
  getTranslation,
  position
}) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <img 
          src="/Logos/Tarabut_Auto-2.png" 
          alt="Tarabut Auto Logo" 
          className="h-16" 
        />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        {getTranslation('confirmation.title')}
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        {getTranslation('confirmation.subtitle')}
      </p>
      
      {/* Enhanced waitlist position display */}
      <div className="bg-gray-50 py-6 px-4 rounded-lg shadow-sm mb-6">
        <p className="text-lg font-medium text-gray-700 mb-2">
          {getTranslation('confirmation.position_message')}
        </p>
        <div className="flex justify-center items-center">
          <span className="text-5xl font-bold text-tarabut-dark">{position}</span>
        </div>
      </div>
    </div>
  );
};
