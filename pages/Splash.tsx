import React, { useEffect, useState } from 'react';
import { RefreshCw, Moon, Users, Lock, Calendar } from 'lucide-react';
import { dbService } from '../services/dbService';
import { useLanguage } from '../App';
import { GlassCard } from '../components/GlassCard';

interface SplashProps {
  onStatusCheck: (day: string) => void;
}

const Instructions = () => {
    const { t } = useLanguage();
    
    return (
        <div className="w-full max-w-3xl mt-16 grid gap-6 text-left rtl:text-right animate-slide-in pb-8">
             {/* Who Can Participate */}
             <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-5 text-primary-dark border-b border-primary/10 pb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold">{t('whoTitle')}</h3>
                </div>
                <ul className="list-disc list-outside pl-6 rtl:pr-6 space-y-3 text-text-main font-medium text-lg leading-relaxed marker:text-primary">
                    <li>{t('whoStudent')}</li>
                    <li>{t('whoParent')}</li>
                    <li>{t('whoStaff')}</li>
                </ul>
             </GlassCard>

             {/* How to Enter */}
             <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-5 text-primary-dark border-b border-primary/10 pb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Lock size={24} />
                    </div>
                    <h3 className="text-xl font-bold">{t('howTitle')}</h3>
                </div>
                <ul className="list-disc list-outside pl-6 rtl:pr-6 space-y-3 text-text-main font-medium text-lg leading-relaxed marker:text-primary">
                    <li>{t('howStudent')}</li>
                    <li>{t('howParent')}</li>
                    <li>{t('howStaff')}</li>
                </ul>
             </GlassCard>

             {/* Schedule */}
             <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-5 text-primary-dark border-b border-primary/10 pb-3">
                     <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar size={24} />
                    </div>
                    <h3 className="text-xl font-bold">{t('scheduleTitle')}</h3>
                </div>
                <ul className="list-disc list-outside pl-6 rtl:pr-6 space-y-3 text-text-main font-medium text-lg leading-relaxed marker:text-primary">
                    <li>{t('scheduleStart')}</li>
                    <li>{t('scheduleTime')}</li>
                    <li className="list-none pt-2">
                        <GlassCard className="bg-secondary/20 p-4 border-none shadow-inner">
                            <span className="font-bold text-primary-dark block mb-2">{t('scheduleFormatTitle')}</span>
                            <ul className="list-[circle] list-outside pl-5 rtl:pr-5 space-y-2 text-base text-text-muted">
                                <li>{t('scheduleFormat1')}</li>
                                <li>{t('scheduleFormat2')}</li>
                                <li>{t('scheduleFormat3')}</li>
                            </ul>
                        </GlassCard>
                    </li>
                </ul>
             </GlassCard>
        </div>
    );
};

export const Splash: React.FC<SplashProps> = ({ onStatusCheck }) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const { t } = useLanguage();

  const checkStatus = async () => {
    setLoading(true);
    try {
      const currentDay = await dbService.getStatus();
      setStatus(currentDay);
      if (currentDay !== 'NA') {
        // Wait a moment for animation
        setTimeout(() => onStatusCheck(currentDay), 1500);
      }
    } catch (error) {
      console.error("Failed to check status", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status !== 'NA' && !loading) {
    return null; // Will redirect via parent
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center pt-8">
          <div className="animate-float mb-8 bg-secondary/30 p-8 rounded-full shadow-inner">
            <Moon size={80} className="text-primary" fill="currentColor" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-primary-dark text-center mb-4">
            {loading ? t('loadingStatus') : t('noQuiz')}
          </h1>
          
          {!loading && (
            <p className="text-text-muted text-lg text-center mb-10 max-w-md leading-relaxed">
              {t('checkBack')}
            </p>
          )}

          <button 
            onClick={checkStatus}
            className="group relative z-10"
            aria-label={t('refresh')}
          >
            <div className="absolute inset-0 bg-primary opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-full"></div>
            <div className="relative w-16 h-16 bg-white border border-primary/20 shadow-lg rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/30">
              <RefreshCw 
                size={24} 
                className={`text-primary ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} 
              />
            </div>
          </button>
      </div>

      {/* Instructions Section (Only shown when not loading and status is NA) */}
      {!loading && <Instructions />}
    </div>
  );
};