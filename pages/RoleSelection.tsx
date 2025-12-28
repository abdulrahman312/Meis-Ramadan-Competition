import React from 'react';
import { UserRole } from '../types';
import { GlassCard } from '../components/GlassCard';
import { GraduationCap, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '../App';
import { getHijriDate } from '../utils/i18n';

interface RoleSelectionProps {
  day: string;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ day, onSelectRole }) => {
  const { t, lang } = useLanguage();
  
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
      </div>
    </div>
  );
};