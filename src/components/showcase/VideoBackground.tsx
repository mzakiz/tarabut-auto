
import React from 'react';

const VideoBackground = () => {
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover opacity-50"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source src="/Camry-2.mp4" type="video/mp4" />
    </video>
  );
};

export default VideoBackground;
