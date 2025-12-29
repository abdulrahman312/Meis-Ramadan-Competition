import React, { useState } from 'react';
import { UserRole } from '../types';
import { GlassCard } from '../components/GlassCard';
import { GraduationCap, Users, Briefcase, Info, X } from 'lucide-react';
import { useLanguage } from '../App';
import { getHijriDate } from '../utils/i18n';
import { Instructions } from '../components/Instructions';
import { Button } from '../components/Button';

interface RoleSelectionProps {
  day: string;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ day, onSelectRole }) => {
  const { t, lang } = useLanguage();
  const [showInstructions, setShowInstructions] = useState(false);
  
  const roles = [
    { 
      id: UserRole.STUDENT, 
      label: t('roleStudent'), 
      sub: t('roleStudentSub'),
      icon: GraduationCap, 
      emoji: "🎓",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    { 
      id: UserRole.PARENT, 
      label: t('roleParent'), 
      sub: t('roleParentSub'),
      icon: Users, 
      emoji: "👨‍👩‍👧‍👦",
      color: "bg-teal-50 text-teal-600 border-teal-100"
    },
    { 
      id: UserRole.STAFF, 
      label: t('roleStaff'), 
      sub: t('roleStaffSub'),
      icon: Briefcase, 
      emoji: "👔",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
  ];

  return (
    <div className="w-full flex items-center justify-center p-4">
      {/* Increased max-w-2xl to max-w-4xl for better spacing */}
      <div className="w-full max-w-4xl animate-scale-in">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-primary/10 text-primary-dark px-6 py-2 rounded-full text-base font-bold tracking-wider mb-4 border border-primary/10 font-arabic">
             {getHijriDate(lang)}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 animate-text-glow">
            {t('quizFor')} {day}
          </h1>
          <p className="text-text-muted text-lg">{t('selectRole')}</p>
        </div>

        {/* Increased gap-4 to gap-8 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <GlassCard 
                key={role.id}
                variant="interactive"
                className="cursor-pointer group"
            >
                <button
                  onClick={() => onSelectRole(role.id)}
                  className="w-full h-full p-6 flex flex-col items-center justify-center text-center gap-4"
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2 transition-transform group-hover:scale-110 ${role.color} border-2`}>
                    {role.emoji}
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">
                        {role.label}
                      </h3>
                      <p className="text-sm text-text-muted">{role.sub}</p>
                  </div>
                </button>
            </GlassCard>
          ))}
        </div>

        {/* Instructions Button */}
        <div className="mt-12 flex justify-center w-full animate-fade-in delay-300">
            <Button 
                variant="secondary" 
                onClick={() => setShowInstructions(true)}
                className="px-8 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm"
            >
                <Info size={20} />
                <span>{t('instructionsBtn')}</span>
            </Button>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-dark/50 backdrop-blur-sm animate-fade-in">
            <div 
                className="relative w-full max-w-3xl max-h-[85vh] bg-[#F0FDFA] rounded-3xl shadow-2xl flex flex-col animate-scale-in border border-white/50"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="p-4 px-6 border-b border-primary/10 flex justify-between items-center bg-white/50 backdrop-blur-md rounded-t-3xl">
                    <div className="flex items-center gap-2 text-primary-dark">
                        <Info size={24} />
                        <h2 className="text-xl font-bold">{t('instructionsTitle')}</h2>
                    </div>
                    <button 
                        onClick={() => setShowInstructions(false)}
                        className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-colors text-text-muted"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <Instructions />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};