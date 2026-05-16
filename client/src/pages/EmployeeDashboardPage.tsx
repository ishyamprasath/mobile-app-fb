import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, History, Lock, MessageSquareHeart, ThumbsUp } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { LoadingScreen } from '../components/LoadingScreen';
import { fetchEmployeeDashboard, submitFeedback } from '../lib/api';
import { DashboardQuestion, EmployeeDashboardData, SubmitPayload } from '../types';
import { useDailyNotification } from '../hooks/useDailyNotification';

const MOOD_OPTIONS: Array<{ value: SubmitPayload['mood']; label: string; emoji: string }> = [
  { value: 'excited', label: 'Excited', emoji: '😀' },
  { value: 'happy', label: 'Happy', emoji: '🙂' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'tired', label: 'Tired', emoji: '😴' },
  { value: 'stressed', label: 'Stressed', emoji: '😤' },
];

export function EmployeeDashboardPage() {
  const [dashboard, setDashboard] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'mood' | 'questions' | 'confidential'>('mood');

  const [mood, setMood] = useState<SubmitPayload['mood'] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidentialNote, setConfidentialNote] = useState('');
  const [anonymousNote, setAnonymousNote] = useState(true);

  useEffect(() => {
    fetchEmployeeDashboard()
      .then((data) => {
        setDashboard(data);
        setSubmitted(!data.todayStatus.canSubmit);
      })
      .catch(() => setError('Unable to load feedback form. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  useDailyNotification({
    enabled: dashboard?.todayStatus.canSubmit ?? false,
    title: dashboard?.notification.title || 'Daily pulse check',
    body: dashboard?.notification.description || 'Please share your daily workplace feedback.',
    triggerAt: dashboard?.todayStatus.nextResetAt || new Date().toISOString(),
  });

  const allAnswered = useMemo(() => {
    if (!dashboard) {
      return false;
    }
    return dashboard.questions.every((question) => Boolean(answers[question.id]));
  }, [answers, dashboard]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!dashboard) {
    return (
      <AppShell title="Share Your Feedback" subtitle="Daily workplace pulse check" badge="Employee">
        <div className="text-center text-[#94a3b8]">{error || 'No data available.'}</div>
      </AppShell>
    );
  }

  async function handleSubmit() {
    if (!dashboard || !mood) {
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      await submitFeedback({
        mood,
        answers: dashboard.questions.map((question) => ({
          questionId: question.id,
          answer: answers[question.id],
        })),
        confidentialNote: confidentialNote.trim() || undefined,
        anonymousNote,
      });
      setSubmitted(true);
    } catch (err) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(apiMessage || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      title={`Hi ${dashboard.employee.name.split(' ')[0]}, share your feedback`}
      subtitle="Daily reset at 9:00 AM · One submission per day · Feedback stays confidential"
      badge="Employee"
    >
      <div className="mx-auto max-w-2xl">
        <SolidCard className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8a1216] text-[#E31E24]">
                <MessageSquareHeart size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Daily pulse check</h3>
                <p className="text-sm text-[#94a3b8]">Submit once each day before reset.</p>
              </div>
            </div>
            <div className="rounded-full border border-[#8a1216] bg-[#8a1216] px-3 py-1 text-xs text-white">
              {dashboard.todayStatus.businessDateKey}
            </div>
          </div>

          {submitted ? (
            <SuccessPanel nextResetAt={dashboard.todayStatus.nextResetAt} />
          ) : (
            <div>
              <StepIndicator step={step} />

              <AnimatePresence mode="wait">
                {step === 'mood' ? (
                  <motion.div
                    key="mood"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="mt-5 text-base font-medium text-white">How are you feeling at work right now?</h4>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                      {MOOD_OPTIONS.map((option) => (
                        <motion.button
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          key={option.value}
                          onClick={() => setMood(option.value)}
                          className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 transition ${
                            mood === option.value
                              ? 'border-[#E31E24] bg-[#8a1216] text-white'
                              : 'border-[#1a3a5c] bg-[#0c2244] text-[#cbd5e1] hover:border-[#E31E24] hover:bg-[#0e2a50]'
                          }`}
                        >
                          <span className="text-3xl">{option.emoji}</span>
                          <span className="text-xs uppercase tracking-widest">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        disabled={!mood}
                        onClick={() => setStep('questions')}
                        className="rounded-2xl bg-[#E31E24] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#c9191f] disabled:opacity-50"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                {step === 'questions' ? (
                  <motion.div
                    key="questions"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4"
                  >
                    {dashboard.questions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        value={answers[question.id]}
                        onChange={(answer) => setAnswers((prev) => ({ ...prev, [question.id]: answer }))}
                      />
                    ))}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => setStep('mood')}
                        className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] px-5 py-3 text-sm uppercase tracking-widest text-[#cbd5e1] transition hover:border-[#E31E24]"
                      >
                        Back
                      </button>
                      <button
                        disabled={!allAnswered}
                        onClick={() => setStep('confidential')}
                        className="rounded-2xl bg-[#E31E24] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#c9191f] disabled:opacity-50"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                {step === 'confidential' ? (
                  <motion.div
                    key="confidential"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4"
                  >
                    <div className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-[#cbd5e1]">
                        <Lock size={16} className="text-[#E31E24]" /> Confidential note (optional)
                      </div>
                      <textarea
                        value={confidentialNote}
                        onChange={(event) => setConfidentialNote(event.target.value)}
                        rows={4}
                        maxLength={1200}
                        placeholder="Share concerns, suggestions, or feedback. Visible only to HR."
                        className="w-full resize-none rounded-2xl border border-[#1a3a5c] bg-[#071830] p-3 text-sm text-white placeholder:text-[#475569] focus:border-[#E31E24] focus:outline-none"
                      />
                      <div className="mt-3 flex items-center justify-between text-xs text-[#64748b]">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={anonymousNote}
                            onChange={(event) => setAnonymousNote(event.target.checked)}
                            className="h-4 w-4 rounded border-[#334155] bg-[#0c2244]"
                          />
                          Submit anonymously
                        </label>
                        <span>{confidentialNote.length}/1200</span>
                      </div>
                    </div>

                    {error ? <div className="rounded-2xl border border-[#7f1d1d] bg-[#450a0a] p-3 text-sm text-[#fecaca]">{error}</div> : null}

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => setStep('questions')}
                        className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] px-5 py-3 text-sm uppercase tracking-widest text-[#cbd5e1] transition hover:border-[#E31E24]"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#E31E24] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#c9191f] disabled:opacity-60"
                      >
                        <ThumbsUp size={16} /> {submitting ? 'Submitting...' : 'Submit feedback'}
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )}
        </SolidCard>

        {dashboard.history.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-white">
              <History size={18} className="text-[#E31E24]" />
              Your past submissions
            </h3>
            <div className="space-y-3">
              {dashboard.history.map((item) => (
                <HistoryCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function SolidCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-3xl border border-[#1a3a5c] bg-[#0c2244] transition-colors hover:border-[#E31E24] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function StepIndicator({ step }: { step: 'mood' | 'questions' | 'confidential' }) {
  const steps: Array<{ id: 'mood' | 'questions' | 'confidential'; label: string }> = [
    { id: 'mood', label: 'Mood' },
    { id: 'questions', label: 'Questions' },
    { id: 'confidential', label: 'Confidential' },
  ];
  const activeIndex = steps.findIndex((item) => item.id === step);

  return (
    <div className="flex items-center gap-3">
      {steps.map((item, index) => {
        const isActive = index <= activeIndex;
        return (
          <div key={item.id} className="flex flex-1 items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                isActive ? 'border-[#E31E24] bg-[#E31E24] text-white' : 'border-[#1a3a5c] bg-[#0c2244] text-[#94a3b8]'
              }`}
            >
              {index + 1}
            </div>
            <div className={`text-xs uppercase tracking-widest ${isActive ? 'text-white' : 'text-[#64748b]'}`}>{item.label}</div>
            {index < steps.length - 1 ? <div className="h-px flex-1 bg-[#1a3a5c]" /> : null}
          </div>
        );
      })}
    </div>
  );
}

function QuestionCard({
  question,
  value,
  onChange,
}: {
  question: DashboardQuestion;
  value?: string;
  onChange: (answer: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] p-4">
      <div className="mb-1 text-xs uppercase tracking-widest text-[#E31E24]">{question.category}</div>
      <div className="mb-3 text-base font-medium text-white">{question.question}</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
              value === option
                ? 'border-[#E31E24] bg-[#8a1216] text-white'
                : 'border-[#1a3a5c] bg-[#071830] text-[#cbd5e1] hover:border-[#E31E24]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function HistoryCard({ item }: { item: EmployeeDashboardData['history'][number] }) {
  const [expanded, setExpanded] = useState(false);
  const moodLabels: Record<string, string> = {
    excited: '😀 Excited',
    happy: '🙂 Happy',
    neutral: '😐 Neutral',
    tired: '😴 Tired',
    stressed: '😤 Stressed',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#1a3a5c] bg-[#0c2244] p-4"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#94a3b8]">{item.businessDateKey}</span>
          <span className="text-sm text-white">{moodLabels[item.mood] || item.mood}</span>
          <span className="rounded-full bg-[#1a3a5c] px-2 py-0.5 text-xs text-[#94a3b8]">
            Avg {item.averageScore} · Stress {item.stressScore}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-[#94a3b8] transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3 border-t border-[#1a3a5c] pt-3">
              {item.answers.map((answer, idx) => (
                <div key={idx} className="rounded-xl bg-[#071830] p-3">
                  <div className="text-xs text-[#E31E24]">Q{idx + 1}</div>
                  <div className="text-sm text-white">{answer.question}</div>
                  <div className="mt-1 text-sm text-[#94a3b8]">→ {answer.answer}</div>
                </div>
              ))}

              {item.confidentialNote && (
                <div className="rounded-xl border border-[#8a1216] bg-[#450a0a] p-3">
                  <div className="flex items-center gap-2 text-xs text-[#fecaca]">
                    <Lock size={14} /> Confidential note
                    {item.anonymousNote && (
                      <span className="rounded-full bg-[#7f1d1d] px-2 py-0.5 text-[10px]">Anonymous</span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-[#fecaca]">{item.confidentialNote}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SuccessPanel({ nextResetAt }: { nextResetAt: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 rounded-2xl border border-[#065f46] bg-[#064e3b] px-6 py-12 text-center text-white"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#065f46]">
        <CheckCircle2 size={36} className="text-emerald-400" />
      </div>
      <h3 className="text-xl font-semibold">Thank you for your feedback!</h3>
      <p className="max-w-md text-sm text-[#94a3b8]">
        Your pulse for today has been recorded. The form will reset automatically at 9:00 AM tomorrow.
      </p>
      <div className="rounded-full border border-[#065f46] bg-[#064e3b] px-4 py-2 text-xs uppercase tracking-widest text-emerald-300">
        Next reset · {new Date(nextResetAt).toLocaleString()}
      </div>
    </motion.div>
  );
}
