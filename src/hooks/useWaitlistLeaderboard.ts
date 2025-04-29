
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Define types for our waitlist user data
interface WaitlistUser {
  display_alias: string | null;
  points: number;
  tier?: string;
  variant?: string;
}

export const useWaitlistLeaderboard = (variant?: string) => {
  return useQuery({
    queryKey: ['waitlist-leaderboard', variant],
    queryFn: async () => {
      let query = supabase
        .from('waitlist_users')
        .select('display_alias, points, variant')
        .order('points', { ascending: false })
        .limit(10);
      
      // Filter by variant if provided
      if (variant) {
        query = query.eq('variant', variant);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Use Promise.all to handle async operations in map
      return Promise.all((data as Tables<'waitlist_users'>[]).map(async (user) => ({
        ...user,
        tier: await getTierForPoints(user.points)
      })));
    },
    enabled: false // Disable auto-fetching since we're not displaying the leaderboard
  });
};

const getTierForPoints = async (points: number) => {
  const { data, error } = await supabase.rpc('get_user_tier', { user_points: points });
  if (error) throw error;
  return data;
};
