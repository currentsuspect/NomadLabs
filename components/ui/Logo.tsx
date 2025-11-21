import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="purpleGradient" cx="40%" cy="40%">
        <stop offset="0%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6b21a8', stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <g transform="translate(256, 256) rotate(22)">
      <circle cx="0" cy="0" r="220" fill="url(#purpleGradient)"/>
      <circle cx="0" cy="0" r="215" fill="none" stroke="#000000" strokeWidth="10"/>
      <path d="M 0 -215 L 18 -85 L 0 -105 L -18 -85 Z" fill="#000000"/>
      <path d="M 0 215 L -18 85 L 0 105 L 18 85 Z" fill="#000000" opacity="0.5"/>
      <path d="M 215 0 L 85 -18 L 105 0 L 85 18 Z" fill="#000000" opacity="0.5"/>
      <path d="M -215 0 L -85 18 L -105 0 L -85 -18 Z" fill="#000000" opacity="0.5"/>
      <circle cx="0" cy="0" r="14" fill="#000000"/>
    </g>
  </svg>
);