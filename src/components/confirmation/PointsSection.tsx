
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PointsSectionProps {
  getTranslation: (key: string) => string;
  points: number;
}

export const PointsSection: React.FC<PointsSectionProps> = ({ 
  getTranslation,
  points 
}) => {
  const [tier, setTier] = useState<string>('');

  // Get tier information based on points
  useEffect(() => {
    const fetchTier = async () => {
      try {
        const { data, error } = await supabase.rpc('get_user_tier', { user_points: points });
        if (error) throw error;
        setTier(data || '');
      } catch (error) {
        console.error('Error fetching tier:', error);
        // Fallback tier calculation if RPC fails
        if (points >= 600) setTier('VIP Access');
        else if (points >= 400) setTier('Early Access');
        else if (points >= 250) setTier('Fast Track');
        else setTier('Standard');
      }
    };

    fetchTier();
  }, [points]);

  // Get translation key for the tier
  const getTierTranslationKey = () => {
    const tierKey = tier?.toLowerCase().replace(' ', '_') || 'standard';
    return `tier.${tierKey}`;
  };

  // Get translation key for points range
  const getTierPointsRangeKey = () => {
    const tierKey = tier?.toLowerCase().replace(' ', '_') || 'standard';
    return `tier.${tierKey}.points`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-2 text-center">
        {getTranslation('confirmation.points_title')}
      </h2>
      <div className="flex justify-center items-center space-x-2 mb-4">
        <span className="text-3xl font-bold text-tarabut-dark">{points}</span>
        <span className="text-gray-600">{getTranslation('confirmation.points')}</span>
      </div>
      
      {/* Tier Information */}
      {tier && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {getTranslation('confirmation.your.tier')}
          </p>
          <div className="inline-block bg-tarabut-light text-tarabut-dark px-4 py-2 rounded-full font-medium mb-2">
            {getTranslation(getTierTranslationKey())}
          </div>
          <p className="text-xs text-gray-500">
            {getTranslation(getTierPointsRangeKey())}
          </p>
        </div>
      )}
      
      <p className="text-sm text-gray-600 text-center mt-4">
        {getTranslation('confirmation.points_description')}
      </p>
    </div>
  );
};
