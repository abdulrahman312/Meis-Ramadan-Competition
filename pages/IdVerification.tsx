import React, { useState, useEffect, useRef } from 'react';
import { UserRole, User } from '../types';
import { dbService } from '../services/dbService';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../App';

interface IdVerificationProps {
  role: UserRole;
  onBack: () => void;
  onVerify: (user: User) => Promise<void> | void;
}

export const IdVerification: React.FC<IdVerificationProps> = ({ role, onBack, onVerify }) => {
  const [idInput, setIdInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLanguage();
  
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getPlaceholder = () => {
    switch (role) {
      case UserRole.STUDENT: return t('studentPlaceholder');
      case UserRole.PARENT: return t('parentPlaceholder');
      case UserRole.STAFF: return t('staffPlaceholder');
      default: return "";
    }
  };

  const getLabel = () => {
    switch (role) {
      case UserRole.STUDENT: return t('studentLabel');
      case UserRole.PARENT: return t('parentLabel');
      case UserRole.STAFF: return t('staffLabel');
      default: return "ID";
    }
  };

  const getTitle = () => {
    switch (role) {
      case UserRole.STUDENT: return t('verifyStudent');
      case UserRole.PARENT: return t('verifyParent');
      case UserRole.STAFF: return t('verifyStaff');
      default: return t('verifyTitle');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idInput.trim()) return;

    setLoading(true);
    setError(null);

    // Safety timeout: Reload if stuck for 35s
    const safetyTimeout = setTimeout(() => {
      window.location.reload();
    }, 35000);

    try {
      const user = await dbService.verifyUser(idInput, role);
      
      clearTimeout(safetyTimeout); // Clear timeout immediately after response

      if (!isMounted.current) return;

      if (user) {
        // Await the parent handler (for checks like submission status)
        await onVerify(user);
      } else {
        setError(t('idNotFound'));
      }
    } catch (err) {
      clearTimeout(safetyTimeout); // Clear timeout on error
      if (isMounted.current) {
        setError(t('connError'));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-lg p-8 animate-slide-in">
        <button 
          onClick={onBack}
          className="flex items-center text-text-muted hover:text-primary transition-colors mb-6 group text-sm font-semibold gap-1"
        >
          {lang === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {t('backToRoles')}
        </button>

        <h2 className="text-3xl font-bold text-primary-dark mb-2">{getTitle()}</h2>
        <p className="text-text-muted mb-8">{getPlaceholder()}</p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className={`relative transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
            <label className="block text-sm font-bold text-text-main mb-2 ml-1">
                {getLabel()}
            </label>
            <input
              type="number"
              value={idInput}
              onChange={(e) => {
                  setIdInput(e.target.value);
                  setError(null);
              }}
              placeholder={role === UserRole.PARENT ? "Mobile Number" : getPlaceholder()}
              // Updated border from border-slate-200 to border-primary-dark/30
              className={`w-full bg-white border-2 ${error ? 'border-error ring-1 ring-error/20' : 'border-primary-dark/30 focus:border-primary'} rounded-xl px-4 py-4 text-lg text-text-main placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm`}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-error bg-red-50 p-3 rounded-lg text-sm border border-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <Button type="submit" isLoading={loading} className="w-full mt-4">
            {loading ? t('verifyingWait') : t('verifyBtn')}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
};