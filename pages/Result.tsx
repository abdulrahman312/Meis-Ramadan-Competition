import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useLanguage } from '../App';

const useConfetti = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
             {Array.from({length: 50}).map((_, i) => (
                 <div 
                    key={i} 
                    className="absolute w-2 h-4 bg-primary animate-confetti opacity-0"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 4}s`,
                        backgroundColor: Math.random() > 0.5 ? '#0D9488' : '#D4AF37'
                    }}
                 />
             ))}
        </div>
    )
}

interface ResultProps {
  type: 'success' | 'timeout' | 'already-submitted';
  onHome: () => void;
  day?: string;
}

export const Result: React.FC<ResultProps> = ({ type, onHome, day }) => {
  const Confetti = useConfetti;
  const { t } = useLanguage();

  const content = {
    success: {
      icon: CheckCircle,
      title: t('successTitle'),
      desc: t('successDesc'),
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success"
    },
    timeout: {
      icon: Clock,
      title: t('timeoutTitle'),
      desc: t('timeoutDesc'),
      color: "text-error",
      bg: "bg-error/10",
      border: "border-error"
    },
    'already-submitted': {
      icon: AlertTriangle,
      title: t('alreadyTitle'),
      desc: t('alreadyDesc'),
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent"
    }
  };

  const current = content[type];
  const Icon = current.icon;

  return (
    <div className="flex flex-grow items-center justify-center p-4">
      {type === 'success' && <Confetti />}
      
      <GlassCard className="w-full max-w-lg p-10 text-center flex flex-col items-center animate-scale-in z-20 bg-white">
        <div className={`mb-6 p-6 rounded-full ${current.bg} ${current.border} border-2 shadow-lg`}>
            <Icon size={60} className={current.color} />
        </div>

        <h1 className={`text-3xl font-bold mb-4 ${current.color}`}>
            {current.title}
        </h1>

        <p className="text-text-muted text-lg mb-10 leading-relaxed font-medium">
            {current.desc}
        </p>

        <Button onClick={onHome} variant={type === 'success' ? 'primary' : 'secondary'} className="w-full">
            {t('returnHome')}
        </Button>
      </GlassCard>
    </div>
  );
};