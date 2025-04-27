
import React, { useEffect, useRef } from 'react';
import { Analytics } from '@/services/analytics';
import { useLanguage } from '@/contexts/LanguageContext';

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const trackVideoEvent = (action: 'play' | 'pause' | 'complete') => {
      Analytics.trackVideoEngagement({
        action,
        duration: video.duration,
        time: video.currentTime,
        language,
        screen: 'showcase'
      });
    };

    video.addEventListener('play', () => trackVideoEvent('play'));
    video.addEventListener('pause', () => trackVideoEvent('pause'));
    video.addEventListener('ended', () => trackVideoEvent('complete'));

    return () => {
      video.removeEventListener('play', () => trackVideoEvent('play'));
      video.removeEventListener('pause', () => trackVideoEvent('pause'));
      video.removeEventListener('ended', () => trackVideoEvent('complete'));
    };
  }, [language]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/Camry-2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default VideoBackground;
