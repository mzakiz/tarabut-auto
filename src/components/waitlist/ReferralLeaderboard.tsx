
import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Trophy, Crown, Medal } from 'lucide-react';
import { useWaitlistLeaderboard } from '@/hooks/useWaitlistLeaderboard';
import { useLocation } from 'react-router-dom';

interface LeaderboardUser {
  display_alias: string;
  points: number;
  tier: string;
  variant?: string;
}

interface ReferralLeaderboardProps {
  users?: LeaderboardUser[];
  variant?: string;
  visible?: boolean; // New prop to control visibility
}

const ReferralLeaderboard = ({ 
  users = [], 
  variant: propVariant,
  visible = false // Default to hidden based on user request
}: ReferralLeaderboardProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Get variant from URL if not provided as prop
  const getVariantFromUrl = () => {
    const pathParts = location.pathname.split('/');
    const variantIndex = pathParts.findIndex(part => 
      part === 'speed' || part === 'offer' || part === 'budget'
    );
    
    return variantIndex !== -1 ? pathParts[variantIndex] : 'speed';
  };
  
  const variant = propVariant || getVariantFromUrl();
  
  // Use the hook if no users are provided
  const { data: leaderboardData, isLoading } = useWaitlistLeaderboard(variant);
  
  // Use provided users or data from the hook
  const displayUsers = users.length > 0 ? users : (leaderboardData || []);
  
  const getRankIcon = (index: number) => {
    switch(index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Crown className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-gray-500">{index + 1}</span>;
    }
  };

  // If not visible, don't render anything
  if (!visible) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card">
      <h3 className="text-lg font-semibold p-4 border-b">
        {t('leaderboard.title')}
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t('leaderboard.rank')}</TableHead>
              <TableHead>{t('leaderboard.player')}</TableHead>
              <TableHead className="text-right">{t('leaderboard.points')}</TableHead>
              <TableHead className="text-right">{t('leaderboard.tier')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  {t('leaderboard.loading') || 'Loading...'}
                </TableCell>
              </TableRow>
            ) : displayUsers.length > 0 ? (
              displayUsers.map((user, index) => (
                <TableRow key={`${user.display_alias}-${index}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center">
                      {getRankIcon(index)}
                    </div>
                  </TableCell>
                  <TableCell>{user.display_alias}</TableCell>
                  <TableCell className="text-right">{user.points}</TableCell>
                  <TableCell className="text-right">{t(`tier.${user.tier.toLowerCase().replace(' ', '_')}`)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  {t('leaderboard.no_data') || 'No leaderboard data available yet'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReferralLeaderboard;
