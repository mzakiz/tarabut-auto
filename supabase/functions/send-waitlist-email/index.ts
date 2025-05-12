
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend@1.0.0';

// Initialize Resend with your API key
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequestPayload {
  to: string;
  name: string;
  position: number;
  points: number;
  referralCode: string;
  statusId: string;
  variant: string;
  language: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, position, points, referralCode, statusId, variant, language } = await req.json() as EmailRequestPayload;
    
    // Get origin for status link
    const url = new URL(req.url);
    const origin = url.origin.includes('localhost') ? 'http://localhost:5173' : url.origin;
    
    // Create status URL
    const statusURL = `${origin}/waitlist-status/${statusId}`;
    
    // Determine tier based on points
    const tier = points >= 600 ? 'VIP Access' : 
                points >= 400 ? 'Early Access' : 
                points >= 250 ? 'Fast Track' : 'Standard';
    
    // Generate email content based on language
    const subject = language === 'ar' 
      ? `مرحباً ${name}! تمت إضافتك لقائمة انتظار ترابط أوتو` 
      : `Welcome to Tarabut Auto Waitlist, ${name}!`;
    
    // Get the appropriate template based on language
    const htmlContent = language === 'ar' 
      ? getArabicTemplate(name, position, referralCode, statusURL, tier, variant)
      : getEnglishTemplate(name, position, referralCode, statusURL, tier, variant);
    
    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Tarabut Auto <noreply@tarabutauto.com>',
      to: [to],
      subject: subject,
      html: htmlContent,
    });
    
    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    // Log the email send in our database
    const { data: logData, error: logError } = await fetch(`${url.origin}/rest/v1/email_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}`,
      },
      body: JSON.stringify({
        email_to: to,
        template: 'waitlist_confirmation',
        status: 'sent',
        metadata: {
          position,
          referral_code: referralCode,
          variant,
          language,
          resend_id: data?.id
        }
      })
    }).then(res => res.json());
    
    if (logError) {
      console.error('Failed to log email:', logError);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully', id: data?.id }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Send email function error:', error.message);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});

// English email template
function getEnglishTemplate(name: string, position: number, referralCode: string, statusURL: string, tier: string, variant: string): string {
  // Customize the variant-specific messaging
  let variantMessage = '';
  if (variant === 'speed') {
    variantMessage = 'Get exclusive access to 1-minute approvals';
  } else if (variant === 'offer') {
    variantMessage = 'Get the best exclusive rate';
  } else if (variant === 'budget') {
    variantMessage = 'Experience KSA\'s best-selling sedan from 1,299 SAR/month';
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tarabut Auto Waitlist Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo img { max-width: 180px; }
        h1 { color: #15803d; margin-bottom: 20px; }
        .position { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
        .position-number { font-size: 32px; font-weight: bold; color: #15803d; }
        .tier { font-weight: bold; margin-top: 10px; color: #15803d; }
        .referral { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; }
        .referral-code { font-family: monospace; font-size: 18px; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; }
        .button { display: inline-block; background-color: #15803d; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .footer { margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="logo">
        <img src="https://tarabutauto.com/Logos/Tarabut_Auto-2.png" alt="Tarabut Auto">
      </div>
      
      <h1>Congratulations, ${name}!</h1>
      
      <p>You've been successfully added to the Tarabut Auto waitlist. We're excited to have you join us for Shariah-compliant auto financing in Saudi Arabia!</p>
      
      <p><strong>${variantMessage}</strong></p>
      
      <div class="position">
        <p>Your position in the waitlist:</p>
        <div class="position-number">#${position}</div>
        <div class="tier">Current Tier: ${tier}</div>
      </div>
      
      <div class="referral">
        <p><strong>Share your referral code with friends to move up the waitlist:</strong></p>
        <div class="referral-code">${referralCode}</div>
        <p>Every time someone signs up using your code, you'll earn 50 points!</p>
      </div>
      
      <p>You can check your waitlist status at any time using the link below:</p>
      
      <a href="${statusURL}" class="button">Check Your Status</a>
      
      <p>We'll notify you as soon as Tarabut Auto is ready to launch. In the meantime, feel free to refer friends to get ahead in line!</p>
      
      <div class="footer">
        <p>Tarabut Auto - Shariah-compliant auto financing</p>
        <p>© ${new Date().getFullYear()} Tarabut Auto. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

// Arabic email template (RTL)
function getArabicTemplate(name: string, position: number, referralCode: string, statusURL: string, tier: string, variant: string): string {
  // Translate tier names
  const tierInArabic = 
    tier === 'VIP Access' ? 'وصول VIP' :
    tier === 'Early Access' ? 'وصول مبكر' :
    tier === 'Fast Track' ? 'المسار السريع' : 'عادي';
  
  // Customize the variant-specific messaging in Arabic
  let variantMessage = '';
  if (variant === 'speed') {
    variantMessage = 'خذ الموافقة الحصرية في دقيقة';
  } else if (variant === 'offer') {
    variantMessage = 'احصل على أفضل سعر حصري';
  } else if (variant === 'budget') {
    variantMessage = 'جرب أفضل سيدان مبيعاً في المملكة من 1,299 ريال/شهر';
  }

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد الانضمام لقائمة انتظار ترابط أوتو</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl; text-align: right; }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo img { max-width: 180px; }
        h1 { color: #15803d; margin-bottom: 20px; }
        .position { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
        .position-number { font-size: 32px; font-weight: bold; color: #15803d; }
        .tier { font-weight: bold; margin-top: 10px; color: #15803d; }
        .referral { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; }
        .referral-code { font-family: monospace; font-size: 18px; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; text-align: center; }
        .button { display: inline-block; background-color: #15803d; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .footer { margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="logo">
        <img src="https://tarabutauto.com/Logos/Tarabut_Auto-2.png" alt="ترابط أوتو">
      </div>
      
      <h1>ألف مبروك، ${name}!</h1>
      
      <p>تمت إضافتك بنجاح إلى قائمة انتظار ترابط أوتو. نحن متحمسون لانضمامك إلينا للحصول على تمويل سيارات متوافق مع الشريعة في المملكة العربية السعودية!</p>
      
      <p><strong>${variantMessage}</strong></p>
      
      <div class="position">
        <p>موقعك في قائمة الانتظار:</p>
        <div class="position-number">#${position}</div>
        <div class="tier">المستوى الحالي: ${tierInArabic}</div>
      </div>
      
      <div class="referral">
        <p><strong>شارك رمز الإحالة الخاص بك مع الأصدقاء للتقدم في قائمة الانتظار:</strong></p>
        <div class="referral-code">${referralCode}</div>
        <p>في كل مرة يسجل فيها شخص ما باستخدام رمزك، ستربح 50 نقطة!</p>
      </div>
      
      <p>يمكنك التحقق من حالة قائمة الانتظار في أي وقت باستخدام الرابط أدناه:</p>
      
      <a href="${statusURL}" class="button">تحقق من حالتك</a>
      
      <p>سنعلمك بمجرد أن يكون ترابط أوتو جاهزًا للإطلاق. في غضون ذلك، لا تتردد في دعوة الأصدقاء للتقدم في قائمة الانتظار!</p>
      
      <div class="footer">
        <p>ترابط أوتو - تمويل سيارات متوافق مع الشريعة</p>
        <p>© ${new Date().getFullYear()} ترابط أوتو. جميع الحقوق محفوظة.</p>
      </div>
    </body>
    </html>
  `;
}
