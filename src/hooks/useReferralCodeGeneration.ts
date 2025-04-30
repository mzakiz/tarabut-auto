
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useReferralCodeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const generateReferralCodes = async () => {
    setIsGenerating(true);
    try {
      // Generate display alias for the user
      const { data: displayAlias, error: aliasError } = await supabase.rpc('generate_display_alias');
      if (aliasError) throw aliasError;
      
      // Get next waitlist position
      const { data: positionData, error: positionError } = await supabase.rpc('get_next_waitlist_position');
      if (positionError) throw positionError;
      
      // Generate referral code
      const { data: referralCode, error: referralCodeError } = await supabase.rpc('generate_referral_code');
      if (referralCodeError) throw referralCodeError;
      
      return {
        displayAlias,
        position: positionData,
        referralCode
      };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate referral codes",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateReferralCodes,
    isGenerating
  };
};
