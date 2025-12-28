import React from 'react';

export const IslamicPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-geo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#0D9488" strokeWidth="1"/>
            <circle cx="20" cy="20" r="5" fill="#0D9488" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-geo)" />
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