
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="nomadGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    
    {/* Outer Ring - Compass */}
    <circle cx="50" cy="50" r="42" stroke="url(#nomadGradient)" strokeWidth="3" strokeOpacity="0.2" />
    <circle cx="50" cy="50" r="42" stroke="url(#nomadGradient)" strokeWidth="3" strokeDasharray="10 15" strokeLinecap="round" />
    
    {/* Inner Signal Wave */}
    <path 
      d="M20 50 C 30 50, 35 20, 45 50 C 55 80, 65 20, 75 50 C 85 80, 90 50, 90 50" 
      stroke="url(#nomadGradient)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* Center Node */}
    <circle cx="50" cy="50" r="4" fill="white" />
  </svg>
);
