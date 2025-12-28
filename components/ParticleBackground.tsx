import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  size: number;
}

export const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.2,
      size: 4 + Math.random() * 8
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft Light Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-white to-secondary/20" />
      
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 bg-primary rounded-full blur-[2px] animate-float"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity
          }}
        />
      ))}
    </div>
  );
};