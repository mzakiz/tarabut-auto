
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';

interface ShowcaseButtonsProps {
  onWaitlistCTAClick?: () => void;
}

const ShowcaseButtons: React.FC<ShowcaseButtonsProps> = ({ onWaitlistCTAClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleWaitlistClick = () => {
    if (onWaitlistCTAClick) {
      onWaitlistCTAClick();
    }
    navigate('/waitlist-signup');
  };

  const handleDealershipClick = () => {
    navigate('/dealership-signup');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
      <Button
        onClick={handleWaitlistClick}
        className="bg-tarabut-teal hover:bg-tarabut-teal/90 text-tarabut-dark min-h-[56px] font-medium text-xl px-10 py-7 w-full sm:w-auto"
      >
        {t('waitlist.join')}
      </Button>
      <Button
        variant="outline"
        onClick={handleDealershipClick}
        className="bg-transparent border-2 border-white text-white hover:bg-white/10 min-h-[56px] text-xl px-10 py-7 w-full sm:w-auto"
      >
        {t('dealership.cta')}
      </Button>
    </div>
  );
};

export default ShowcaseButtons;
