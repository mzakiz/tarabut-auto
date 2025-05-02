
import { useTranslation } from '@/hooks/useTranslation';

export interface TierDetails {
  name: string;
  points: string;
  emoji: string;
  color: string;
  description: string;
}

export const getTierForPoints = (points: number, t: (key: string) => string): TierDetails => {
  if (points >= 600) {
    return {
      name: t('tier.vip_access'),
      points: t('tier.vip_access.points'),
      emoji: '👑',
      color: 'bg-purple-500',
      description: t('tier.vip_access.description') || 'Exclusive early access with premium benefits'
    };
  } else if (points >= 400) {
    return {
      name: t('tier.early_access'),
      points: t('tier.early_access.points'),
      emoji: '⭐',
      color: 'bg-blue-500',
      description: t('tier.early_access.description') || 'Access before the general public'
    };
  } else if (points >= 250) {
    return {
      name: t('tier.fast_track'),
      points: t('tier.fast_track.points'),
      emoji: '🚀',
      color: 'bg-green-500',
      description: t('tier.fast_track.description') || 'Accelerated access to our platform'
    };
  } else {
    return {
      name: t('tier.standard'),
      points: t('tier.standard.points'),
      emoji: '🏁',
      color: 'bg-gray-500',
      description: t('tier.standard.description') || 'Join our waitlist at a standard position'
    };
  }
};

export const useTierDetails = (points: number): TierDetails => {
  const { t } = useTranslation();
  return getTierForPoints(points, t);
};
