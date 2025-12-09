'use client';

import { useEffect, useRef } from 'react';

export default function CurvedHeroText() {
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const textLength = textRef.current.getComputedTextLength();
      // Adjust the path viewBox based on text length
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <svg
        viewBox="0 0 1200 400"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Define the curved path for text */}
          <path
            id="curve"
            d="M 100,300 Q 600,100 1100,300"
            fill="transparent"
          />
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* The curved text */}
        <text
          ref={textRef}
          className="fill-transparent stroke-white"
          style={{
            fontSize: '72px',
            fontWeight: '800',
            letterSpacing: '0.1em',
            strokeWidth: '1.5px',
            filter: 'url(#glow)',
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
