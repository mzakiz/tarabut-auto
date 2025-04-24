
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeadProps {
  title?: string;
  description?: string;
}

export const Head = ({ 
  title = 'Tarabut Auto | Fast, Smart 1-minute Approval', 
  description = 'Join the waitlist for 1-minute car financing approval in KSA. No paperwork. No delays. Just drive.'
}: HeadProps) => {
  const { language } = useLanguage();
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/Logos/Tarabut_logo_no_text.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TarabutGateway" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/Logos/Tarabut_logo_no_text.png" />
      <link rel="icon" type="image/png" href="/Logos/Tarabut_logo_no_text.png" />
      <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
    </Helmet>
  );
};

