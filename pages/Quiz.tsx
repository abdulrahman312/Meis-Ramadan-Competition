import React, { useState, useEffect, useCallback } from 'react';
import { Question, User } from '../types';
import { dbService } from '../services/dbService';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Clock } from 'lucide-react';
import { useLanguage } from '../App';
import { getHijriDate } from '../utils/i18n';

interface QuizProps {
  day: string;
  user: User;
  onComplete: () => void;
  onTimeout: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ day, user, onComplete, onTimeout }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, lang } = useLanguage();

  // Helper to detect Arabic
  const isArabic = (text: string) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  };

  const handleTimeout = useCallback(async () => {
    await dbService.submitAnswer(user.id, day, false);
    onTimeout();
  }, [user.id, day, onTimeout]);

  useEffect(() => {
    if (!question || isSubmitting) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, question, isSubmitting, handleTimeout]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const q = await dbService.getQuestion(day);
        setQuestion(q);
      } catch (e) {
        console.error("Error fetching question");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [day]);

  const handleSubmit = async () => {
    if (selectedOption === null || !question) return;
    setIsSubmitting(true);
    
    const isCorrect = selectedOption === question.correctOptionIndex;
    
    try {
        await dbService.submitAnswer(user.id, day, isCorrect);
    } catch (e) {
        console.error("Submission failed", e);
    } finally {
        // Immediately complete without showing correct/wrong feedback
        onComplete();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <div className="animate-spin text-primary"><Clock size={48} /></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex flex-grow items-center justify-center p-4">
        <GlassCard className="p-8 text-center">
          <h2 className="text-xl text-primary-dark">{t('qNotFound')}</h2>
          <Button onClick={onComplete} className="mt-4">{t('returnHome')}</Button>
        </GlassCard>
      </div>
    );
  }

  let timerColor = "text-primary";
  if (timeLeft < 40) timerColor = "text-accent";
  if (timeLeft < 20) timerColor = "text-error animate-pulse";

  const radius = 26; 
  const circumference = 2 * Math.PI * radius;
  const progress = ((60 - timeLeft) / 60) * circumference;
  
  // Use DB question lang detection for content, but interface follows app lang
  const isQuestionArabic = isArabic(question.text);

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      {/* Sticky Header */}
      <div className="sticky top-4 z-20">
        <GlassCard className="relative flex items-center justify-center p-4 h-24 bg-white/95 border-secondary">
          <div className="flex flex-col items-center justify-center z-10">
            <span className="text-3xl font-bold font-serif text-primary-dark drop-shadow-sm tracking-wide">
              {getHijriDate(lang)}
            </span>
          </div>
          
          <div className="absolute right-4 rtl:right-auto rtl:left-4 flex items-center justify-center w-16 h-16">
             <svg className="absolute transform -rotate-90 rtl:rotate-90 w-full h-full overflow-visible">
                <circle cx="50%" cy="50%" r={radius} stroke="#E2E8F0" strokeWidth="4" fill="transparent" />
                <circle 
                    cx="50%" cy="50%" r={radius} 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={-progress}
                    className={`transition-all duration-1000 ease-linear ${timerColor}`}
                    strokeLinecap="round"
                />
             </svg>
             <div className="flex flex-col items-center justify-center bg-secondary/20 rounded-full w-12 h-12">
                <span className={`text-lg font-mono font-bold ${timerColor} leading-none`}>{timeLeft}</span>
             </div>
          </div>
        </GlassCard>
      </div>

      {/* Question Card */}
      <GlassCard className="p-6 md:p-10 flex-grow flex flex-col justify-center animate-scale-in">
        <h2 
            className={`text-2xl md:text-3xl font-bold text-center text-primary-dark mb-10 leading-relaxed ${isQuestionArabic ? 'font-arabic' : ''}`}
            dir={isQuestionArabic ? "rtl" : "ltr"}
        >
          {question.text}
        </h2>

        <div className="flex flex-col gap-4">
          {question.options.map((option, index) => {
             const isSelected = selectedOption === index;
             const isOptionArabic = isArabic(option);
             
             let optionStyle = "border-slate-200 bg-white hover:bg-slate-50 hover:border-primary/50 text-text-main shadow-sm";
             
             if (isSelected) {
                 optionStyle = "border-primary bg-secondary/30 text-primary-dark shadow-md ring-1 ring-primary";
             } else if (isSubmitting) {
                 optionStyle = "opacity-50 grayscale bg-slate-100";
             }

             return (
              <button
                key={index}
                onClick={() => !isSubmitting && setSelectedOption(index)}
                disabled={isSubmitting}
                className={`group relative p-5 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${optionStyle}`}
                dir={isOptionArabic ? "rtl" : "ltr"}
              >
                <div className="flex items-center gap-4 w-full">
                    <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'bg-slate-100 text-text-muted border-slate-300'}`}>
                        {String.fromCharCode(65 + index)}
                    </span>
                    <span className={`text-lg font-medium flex-grow ${isOptionArabic ? 'text-right' : 'text-left'}`}>{option}</span>
                </div>
              </button>
             );
          })}
        </div>

        <div className="mt-10">
            <Button 
                onClick={handleSubmit} 
                disabled={selectedOption === null || isSubmitting} 
                className="w-full h-14 text-lg shadow-lg"
                isLoading={isSubmitting}
            >
                {isSubmitting ? t('processing') : t('submit')}
            </Button>
        </div>
      </GlassCard>
    </div>
  );
};