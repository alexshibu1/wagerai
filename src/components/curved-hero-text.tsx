'use client';

import { useEffect, useRef } from 'react';

export default function CurvedHeroText() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <svg
        viewBox="0 0 1200 350"
        className="w-full h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="curve"
            d="M 100,300 Q 600,100 1100,300"
            fill="transparent"
          />
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <text
          className="fill-white"
          style={{
            fontSize: '68px',
            fontWeight: '800',
            letterSpacing: '0.15em',
            filter: 'url(#glow)',
            fontFamily: 'inherit'
          }}
        >
          <textPath
            href="#curve"
            startOffset="50%"
            textAnchor="middle"
          >
            THE ASSET CLASS OF YOU
          </textPath>
        </text>
      </svg>
    </div>
  );
}
