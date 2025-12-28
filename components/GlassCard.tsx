import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'base' | 'interactive' | 'alert';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', variant = 'base' }) => {
  const baseStyles = "rounded-3xl border transition-all duration-300 backdrop-blur-sm";
  
  const variants = {
    base: "bg-white/80 border-white/60 shadow-[0_10px_40px_-10px_rgba(13,148,136,0.1)]",
    interactive: "bg-white border-primary/10 shadow-lg shadow-primary/5 hover:border-primary/30 hover:shadow-primary/10 hover:-translate-y-1",
    alert: "bg-white border-error/20 shadow-lg shadow-error/5"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};