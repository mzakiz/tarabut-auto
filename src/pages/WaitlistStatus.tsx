import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

const tierDescriptions = {
  'VIP Access': {
    emoji: '🚀',
    title: 'First in line. First to get approved.',
    description: 'Exclusive perks, early approvals, top priority.'
  },
  'Early Access': {
    emoji: '⚡',
    title: 'Beat the crowd. Get offers before anyone else.',
    description: 'Fast-track your financing and get notified first.'
  },
  'Fast Track': {
    emoji: '🚗',
    title: 'You\'re ahead of the pack.',
    description: 'Closer to early access. Just a few referrals away from the top.'
  },
  'Standard': {
    emoji: '🕓',
    title: 'You\'ve joined the waitlist!',
    description: 'Want to move up? Refer friends and unlock priority access.'
  }
};

const WaitlistStatus = () => {
  const { statusId } = useParams();
  const { t, language } = useTranslation();
  
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Type assertion to make TypeScript happy
      const { data, error } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('status_id', statusId)
        .eq('phone', phone.startsWith('+966') ? phone : `+966${phone}`)
        .eq('email', email)
        .single();

      if (error || !data) {
        setError(t('waitlist.status.invalid_credentials'));
        return;
      }

      setUserData(data);
    } catch (err) {
      setError(t('waitlist.status.error'));
    }
  };

  const renderUserStatus = () => {
    if (!userData) return null;

    const tier = tierDescriptions[userData.tier || 'Standard'];

    return (
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="text-center">
          <div className="text-5xl mb-4">{tier.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800">{tier.title}</h2>
          <p className="text-gray-600 mt-2">{tier.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">{t('waitlist.position')}</p>
            <p className="text-xl font-bold">#{userData.position}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('waitlist.points')}</p>
            <p className="text-xl font-bold">{userData.points}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        {!userData ? (
          <form onSubmit={handleVerify} className="bg-white rounded-xl shadow-md p-8 space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {t('waitlist.status.check')}
            </h2>
            <div>
              <Label>{t('form.phone')}</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('form.placeholder.phone')}
                className="mt-2"
              />
            </div>
            <div>
              <Label>{t('form.email')}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('form.placeholder.email')}
                className="mt-2"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              {t('waitlist.status.verify')}
            </Button>
          </form>
        ) : (
          renderUserStatus()
        )}
      </div>
    </div>
  );
};

export default WaitlistStatus;
