import React, { useState, useEffect, useContext } from 'react';
import { User, UserRole } from './types';
import { dbService } from './services/dbService';
import { ParticleBackground } from './components/ParticleBackground';
import { IslamicPattern, BorderFlourish } from './components/IslamicPattern';
import { Splash } from './pages/Splash';
import { RoleSelection } from './pages/RoleSelection';
import { IdVerification } from './pages/IdVerification';
import { Quiz } from './pages/Quiz';
import { Result } from './pages/Result';
import { GlassCard } from './components/GlassCard';
import { Button } from './components/Button';
import { translations, Language } from './utils/i18n';
import { Globe } from 'lucide-react';

// Language Context
interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const LanguageContext = React.createContext<LanguageContextType>({
  lang: 'ar',
  toggleLang: () => {},
  t: (key) => translations['ar'][key as keyof typeof translations['ar']] || key,
});

export const useLanguage = () => useContext(LanguageContext);

// Header Component with School Logo & Lang Toggle
const SchoolHeader = () => {
    const { lang, toggleLang } = useLanguage();
    
    return (
        <div className="w-full flex flex-col items-center justify-center pt-4 pb-0 px-4 z-20 relative animate-fade-in">
            {/* Language Toggle - Absolute Top Right (Left in RTL) */}
            <button 
                onClick={toggleLang}
                className="absolute top-4 right-4 md:right-10 flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-primary-dark/30 text-primary-dark hover:bg-white transition-all hover:shadow-md z-50 text-sm font-bold"
            >
                <Globe size={16} />
                <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Logo with Glowing Border Animation */}
            <div className="mb-2 p-1 rounded-full border-2 animate-border-glow bg-white/20 backdrop-blur-sm shadow-lg">
                <img 
                    src="https://i.ibb.co/bgFrgXkW/meis.png" 
                    alt="Middle East International School Logo" 
                    className="h-20 w-20 object-contain rounded-full hover:scale-105 transition-transform duration-300"
                />
            </div>
            
            <div className="text-center space-y-0">
                <h1 className="text-lg md:text-xl font-bold text-primary-dark font-arabic">
                    {translations[lang].schoolNameAr}
                </h1>
                <h2 className="text-xs md:text-sm font-semibold text-text-muted font-sans tracking-wide">
                    {translations[lang].schoolNameEn}
                </h2>
            </div>
        </div>
    );
};

// Modal for Identity Confirmation
const ConfirmModal = ({ user, onConfirm, onCancel }: { user: User, onConfirm: () => void, onCancel: () => void }) => {
    const { t, lang } = useLanguage();
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/20 backdrop-blur-sm animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <GlassCard className="max-w-md w-full p-8 text-center border-primary-dark/30 animate-scale-in bg-white shadow-2xl">
                <h3 className="text-2xl font-bold text-primary-dark mb-6">{t('confirmTitle')}</h3>
                
                <div className="w-20 h-20 mx-auto bg-secondary/50 rounded-full flex items-center justify-center mb-4 text-primary text-4xl shadow-inner">
                    👤
                </div>
                
                <h4 className="text-xl font-bold text-text-main mb-2">{user.name}</h4>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary-dark font-bold text-xs uppercase tracking-wider mb-8">
                    {user.role}
                </span>

                <div className="bg-secondary/30 border-l-4 border-primary p-4 text-left mb-8 rounded-r-lg rtl:border-l-0 rtl:border-r-4 rtl:rounded-l-lg rtl:rounded-r-none rtl:text-right">
                    <p className="text-sm text-text-main flex gap-2 font-medium">
                        <span>⏱</span>
                        {t('confirmTime')}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button variant="secondary" onClick={onCancel} className="flex-1">{t('cancel')}</Button>
                    <Button onClick={onConfirm} className="flex-1">{t('proceed')}</Button>
                </div>
            </GlassCard>
        </div>
    );
};

const AppContent: React.FC = () => {
  const [view, setView] = useState<'splash' | 'roles' | 'verify' | 'quiz' | 'result'>('splash');
  const [day, setDay] = useState<string>('NA');
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultType, setResultType] = useState<'success' | 'timeout' | 'already-submitted'>('success');
  const { lang } = useLanguage();

  const handleStatusCheck = (currentDay: string) => {
    setDay(currentDay);
    setView('roles');
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setView('verify');
  };

  const handleUserVerified = async (verifiedUser: User) => {
    const submitted = await dbService.checkSubmission(verifiedUser.id, day);
    if (submitted) {
        setUser(verifiedUser);
        setResultType('already-submitted');
        setView('result');
    } else {
        setUser(verifiedUser);
        setShowConfirm(true);
    }
  };

  const startQuiz = () => {
    setShowConfirm(false);
    setView('quiz');
  };

  const handleQuizComplete = () => {
    setResultType('success');
    setView('result');
  };

  const handleTimeout = () => {
    setResultType('timeout');
    setView('result');
  };

  const resetApp = () => {
    setView('splash');
    setUser(null);
    setRole(null);
    setResultType('success');
  };

  return (
    <div 
        className={`font-sans min-h-screen relative text-text-main flex flex-col ${lang === 'ar' ? 'font-arabic' : ''}`} 
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <ParticleBackground />
      <IslamicPattern />
      <BorderFlourish position="top" />
      <BorderFlourish position="bottom" />

      {/* Persistent School Header */}
      <SchoolHeader />

      {/* Decorative Image - Adjusted Spacing */}
      <div className="w-full flex justify-center -mt-6 -mb-6 z-10 animate-fade-in pointer-events-none">
         <img 
            src="https://i.ibb.co/5hMhj2b5/Untitled-design.png" 
            alt="Ramadan Decoration"
            className="h-28 md:h-44 object-contain drop-shadow-md opacity-90 transition-all duration-500 hover:scale-105"
         />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-start md:justify-center w-full max-w-4xl mx-auto pb-10">
        {view === 'splash' && <Splash onStatusCheck={handleStatusCheck} />}
        
        {view === 'roles' && <RoleSelection day={day} onSelectRole={handleRoleSelect} />}
        
        {view === 'verify' && role && (
            <IdVerification 
                role={role} 
                onBack={() => setView('roles')} 
                onVerify={handleUserVerified} 
            />
        )}

        {view === 'quiz' && user && (
            <Quiz 
                day={day} 
                user={user} 
                onComplete={handleQuizComplete} 
                onTimeout={handleTimeout}
            />
        )}

        {view === 'result' && (
            <Result type={resultType} day={day} onHome={resetApp} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full flex flex-col items-center justify-center py-4 pb-8 gap-3 mt-auto animate-fade-in">
        <img 
          src="https://i.ibb.co/hJyS62tj/Gemini-Generated-Image-kaor2tkaor2tkaor-removebg-preview.png" 
          alt="Ramadan Lantern" 
          className="h-20 md:h-24 object-contain drop-shadow-sm opacity-90 hover:scale-105 transition-transform duration-300"
        />
        <p className="text-primary-dark font-bold text-sm md:text-base tracking-wide text-center px-4 font-serif" dir="ltr">
          MEIS Al-Muruj • Ramadan Quiz Portal • 2026
        </p>
      </footer>

      {/* Confirmation Modal Overlay */}
      {showConfirm && user && (
          <ConfirmModal 
            user={user} 
            onConfirm={startQuiz} 
            onCancel={() => {
                setShowConfirm(false);
                setUser(null);
            }} 
          />
      )}
    </div>
  );
};

const App: React.FC = () => {
    const [lang, setLang] = useState<Language>('ar');

    const toggleLang = () => {
        setLang(prev => prev === 'ar' ? 'en' : 'ar');
    };

    const t = (key: keyof typeof translations['en']) => {
        return translations[lang][key] || key;
    };
    
    // Update HTML dir attribute for accessibility
    useEffect(() => {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            <AppContent />
        </LanguageContext.Provider>
    );
}

export default App;