import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'base' | 'interactive' | 'alert';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', variant = 'base' }) => {
  // Reverted to standard thin border (removed border-2)
  const baseStyles = "rounded-3xl border transition-all duration-300 backdrop-blur-sm";
  
  const variants = {
    base: "bg-white/90 border-primary-dark/30 shadow-[0_10px_40px_-10px_rgba(13,148,136,0.1)] animate-border-glow",
    interactive: "bg-white border-primary-dark/30 shadow-lg shadow-primary/5 hover:-translate-y-1 animate-border-glow",
    alert: "bg-white border-error/50 shadow-lg shadow-error/5"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};