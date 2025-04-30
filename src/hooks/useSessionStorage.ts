
export const useSessionStorage = () => {
  const storeWaitlistData = (data: {
    referralCode: string;
    position: number;
    points: number;
    statusId: string;
    variant: string;
  }) => {
    sessionStorage.setItem('waitlist_referralCode', data.referralCode);
    sessionStorage.setItem('waitlist_position', data.position.toString());
    sessionStorage.setItem('waitlist_points', data.points.toString());
    sessionStorage.setItem('waitlist_statusId', data.statusId);
    sessionStorage.setItem('waitlist_variant', data.variant);
    sessionStorage.setItem('waitlist_timestamp', Date.now().toString());
  };

  return {
    storeWaitlistData
  };
};
