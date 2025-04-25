
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Define types for our waitlist user data
interface WaitlistUser {
  display_alias: string | null;
  points: number;
  tier?: string;
}

export const useWaitlistLeaderboard = () => {
  return useQuery({
    queryKey: ['waitlist-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist_users')
        .select('display_alias, points')
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Use Promise.all to handle async operations in map
      return Promise.all((data as Tables<'waitlist_users'>[]).map(async (user) => ({
        ...user,
        tier: await getTierForPoints(user.points)
      })));
    }
  });
};

const getTierForPoints = async (points: number) => {
  const { data, error } = await supabase.rpc('get_user_tier', { user_points: points });
  if (error) throw error;
  return data;
};
