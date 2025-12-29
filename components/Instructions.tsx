import React from 'react';
import { Users, Lock, Calendar } from 'lucide-react';
import { useLanguage } from '../App';
import { GlassCard } from './GlassCard';

export const Instructions: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="w-full grid gap-6 text-left rtl:text-right">
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