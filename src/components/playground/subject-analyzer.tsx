'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, RotateCcw, Loader2, AlertCircle, CheckCircle2, Target } from 'lucide-react';

interface Analysis {
  score: number;
  feedback: string;
}

export function SubjectLineAnalyzer() {
  const [subject, setSubject] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!subject.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analyseer deze email subject line en geef een score van 1-100 plus kort feedback (max 3 zinnen). Focus op: lengte, urgentie, personalisatie, curiosity, en mobiele preview. Antwoord ALLEEN in dit exacte formaat, niets anders:
SCORE: [nummer]
FEEDBACK: [jouw feedback in 2-3 zinnen]

Subject line: "${subject}"`,
          }],
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          setError('Je hebt de limiet bereikt (10 analyses per dag). Kom morgen terug om het opnieuw te proberen!');
          setIsLoading(false);
          return;
        }
        throw new Error('API error');
      }
      const data = await res.json();
      if (data.rateLimited) {
        setError('Je hebt de limiet bereikt (10 analyses per dag). Kom morgen terug om het opnieuw te proberen!');
        setIsLoading(false);
        return;
      }
      const reply = data.reply || '';

      // Parse score and feedback
      const scoreMatch = reply.match(/SCORE:\s*(\d+)/i);
      const feedbackMatch = reply.match(/FEEDBACK:\s*([\s\S]+)/i);

      if (scoreMatch && feedbackMatch) {
        setAnalysis({
          score: Math.min(100, Math.max(0, parseInt(scoreMatch[1]))),
          feedback: feedbackMatch[1].trim(),
        });
      } else {
        // Fallback: show the raw reply as feedback with a default score
        setAnalysis({ score: 50, feedback: reply.slice(0, 200) });
      }
    } catch {
      setError('Analyse niet beschikbaar. Probeer het later nog eens.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs work';
    return 'Weak';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const examples = [
    'Welkom bij onze community!',
    'Laatste kans: 30% korting verloopt vanavond',
    'Jan, je winkelwagen wacht op je',
    'Nieuwsbrief #42 — Updates',
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">Subject Line Analyzer</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">AI</span>
        </div>
        <Sparkles className="w-4 h-4 text-foreground-subtle" />
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Input */}
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyze()}
              placeholder="Type een email subject line..."
              className="flex-1 bg-background-alt border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-accent transition-colors"
              maxLength={120}
            />
            <button
              onClick={analyze}
              disabled={!subject.trim() || isLoading}
              className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-40 transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Analyze</span>
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-foreground-subtle">{subject.length}/120 characters</span>
            {subject.length > 0 && subject.length <= 50 && (
              <span className="text-[10px] text-emerald-500 flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" /> Good length for mobile</span>
            )}
            {subject.length > 50 && (
              <span className="text-[10px] text-amber-500 flex items-center gap-0.5"><AlertCircle className="w-2.5 h-2.5" /> May get truncated on mobile</span>
            )}
          </div>
        </div>

        {/* Example pills */}
        {!analysis && !isLoading && (
          <div>
            <p className="text-[10px] text-foreground-subtle mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-1.5">
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setSubject(ex)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-background-alt text-foreground-muted hover:text-foreground hover:border-border-hover transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-8 gap-2 text-sm text-foreground-subtle">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            Analyzing with AI...
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-6">
                {/* Score ring */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={getScoreRingColor(analysis.score)}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - analysis.score / 100) }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-xl font-bold ${getScoreColor(analysis.score)}`}
                    >
                      {analysis.score}
                    </motion.span>
                    <span className="text-[9px] text-foreground-subtle">{getScoreLabel(analysis.score)}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-foreground-muted leading-relaxed">{analysis.feedback}</p>
                </div>
              </div>

              <button
                onClick={() => { setAnalysis(null); setSubject(''); }}
                className="inline-flex items-center gap-1.5 text-xs text-foreground-subtle hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Try another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
