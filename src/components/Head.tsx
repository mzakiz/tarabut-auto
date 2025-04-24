
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeadProps {
  title?: string;
  description?: string;
}

export const Head = ({ 
  title = 'Tarabut Auto', 
  description = 'Get Shariah-compliant car financing with Tarabut Auto. Join our waitlist for exclusive access to the best Murabaha car financing deals.'
}: HeadProps) => {
  const { language } = useLanguage();
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/Logos/tarabut_logo_no_text.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TarabutGateway" />
      <link rel="icon" type="image/png" href="/Logos/tarabut_logo_no_text.png" />
      <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
    </Helmet>
  );
};
