import React from 'react';

export const IslamicPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Subtle Gradient Overlay for Depth and Softness */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light/5 via-transparent to-primary-light/10" />

      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gold Gradient for the Stroke */}
          <linearGradient id="gold-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FCD34D" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
          </linearGradient>

          {/* Moroccan Trellis / Quatrefoil Pattern */}
          <pattern id="islamic-trellis" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
            {/* Base Fill for the shapes - very subtle teal tint */}
            <path 
                d="M30 0 Q 45 15 60 0 Q 45 15 60 30 Q 45 45 60 60 Q 45 45 30 60 Q 15 45 0 60 Q 15 45 0 30 Q 15 15 0 0 Q 15 15 30 0" 
                fill="#2DD4BF" 
                fillOpacity="0.03"
                stroke="none"
            />
            
            {/* Gold Outline */}
            <path 
                d="M30 0 Q 45 15 60 0 Q 45 15 60 30 Q 45 45 60 60 Q 45 45 30 60 Q 15 45 0 60 Q 15 45 0 30 Q 15 15 0 0 Q 15 15 30 0" 
                fill="none" 
                stroke="url(#gold-stroke)" 
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
          </pattern>
        </defs>
        
        {/* Render the pattern */}
        <rect width="100%" height="100%" fill="url(#islamic-trellis)" />
      </svg>
    </div>
  );
};

export const BorderFlourish: React.FC<{ position: 'top' | 'bottom' }> = ({ position }) => {
    const isTop = position === 'top';
    return (
        <div className={`absolute left-0 w-full h-24 z-0 pointer-events-none ${isTop ? 'top-0' : 'bottom-0'}`}>
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 60" className="opacity-20 text-primary">
                <path 
                    d={isTop 
                        ? "M0,0 H1200 V20 Q600,80 0,20 Z" 
                        : "M0,60 H1200 V40 Q600,-20 0,40 Z"} 
                    fill="currentColor" 
                />
            </svg>
        </div>
    )
}