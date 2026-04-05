'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Trophy, BarChart3, RotateCcw, ChevronRight } from 'lucide-react';

interface ABTest {
  id: number;
  context: string;
  variantA: string;
  variantB: string;
  winner: 'A' | 'B';
  statsA: { openRate: number; ctr: number };
  statsB: { openRate: number; ctr: number };
  insight: string;
}

const tests: ABTest[] = [
  {
    id: 1,
    context: 'Welcome email for new energy customers',
    variantA: 'Welkom bij Samba Energy!',
    variantB: 'Jouw eerste stap naar groene energie ⚡',
    winner: 'B',
    statsA: { openRate: 42, ctr: 8 },
    statsB: { openRate: 67, ctr: 14 },
    insight: 'Benefit-driven subject lines with emoji outperform generic welcomes by 60%.',
  },
  {
    id: 2,
    context: 'Win-back campaign for churned subscribers',
    variantA: 'We missen je! Kom je terug?',
    variantB: 'Nog 48 uur: €50 korting op je volgende factuur',
    winner: 'B',
    statsA: { openRate: 18, ctr: 3 },
    statsB: { openRate: 31, ctr: 9 },
    insight: 'Urgency + specific incentive beats emotional appeals for win-back campaigns.',
  },
  {
    id: 3,
    context: 'Monthly newsletter with product updates',
    variantA: 'Samba Energy Nieuwsbrief — Maart 2026',
    variantB: 'Wat er achter je stekker veranderde in maart',
    winner: 'B',
    statsA: { openRate: 22, ctr: 4 },
    statsB: { openRate: 38, ctr: 11 },
    insight: 'Curiosity-driven lines outperform "newsletter" labels. People ignore newsletters, not stories.',
  },
  {
    id: 4,
    context: 'Solar panel promotion email',
    variantA: 'Bespaar tot €1.200 per jaar met zonnepanelen',
    variantB: 'Zonnepanelen: aanvraag starten',
    winner: 'A',
    statsA: { openRate: 45, ctr: 15 },
    statsB: { openRate: 29, ctr: 7 },
    insight: 'Specific numbers in subject lines build trust. "Tot €1.200" beats vague CTAs.',
  },
  {
    id: 5,
    context: 'Cleanprofs seasonal cleaning reminder',
    variantA: 'Tijd om je GFT-bak te laten reinigen',
    variantB: 'Je buren deden het al — GFT-bak schoon voor de zomer',
    winner: 'B',
    statsA: { openRate: 33, ctr: 10 },
    statsB: { openRate: 48, ctr: 16 },
    insight: 'Social proof ("je buren deden het al") is powerful for local services.',
  },
];

export function ABTestArena() {
  const [currentTest, setCurrentTest] = useState(0);
  const [vote, setVote] = useState<'A' | 'B' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const test = tests[currentTest];
  const isFinished = currentTest >= tests.length;

  const handleVote = (choice: 'A' | 'B') => {
    setVote(choice);
    setTimeout(() => {
      setRevealed(true);
      setScore(prev => ({
        correct: prev.correct + (choice === test.winner ? 1 : 0),
        total: prev.total + 1,
      }));
    }, 500);
  };

  const nextTest = () => {
    setVote(null);
    setRevealed(false);
    setCurrentTest(prev => prev + 1);
  };

  const reset = () => {
    setCurrentTest(0);
    setVote(null);
    setRevealed(false);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">A/B Test Arena</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground-subtle">
          <Trophy className="w-3 h-3" />
          {score.correct}/{score.total} correct
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {score.correct >= 4 ? 'Email marketing pro!' : score.correct >= 2 ? 'Niet slecht!' : 'Nog even oefenen!'}
              </h3>
              <p className="text-foreground-muted">
                Je had {score.correct} van de {score.total} goed.
                {score.correct >= 4 && ' Je hebt een neus voor goede subject lines.'}
              </p>
              <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
                Opnieuw spelen
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Context */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Round {currentTest + 1}/{tests.length}
                </span>
                <p className="text-sm text-foreground-muted mt-1">{test.context}</p>
                <p className="text-xs text-foreground-subtle mt-1">Which subject line performs better?</p>
              </div>

              {/* Variants */}
              <div className="grid gap-3">
                {(['A', 'B'] as const).map((variant) => {
                  const subject = variant === 'A' ? test.variantA : test.variantB;
                  const stats = variant === 'A' ? test.statsA : test.statsB;
                  const isWinner = revealed && test.winner === variant;
                  const isLoser = revealed && test.winner !== variant;
                  const isVoted = vote === variant;

                  return (
                    <motion.button
                      key={variant}
                      onClick={() => !revealed && handleVote(variant)}
                      disabled={revealed}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                        isWinner
                          ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                          : isLoser
                          ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 opacity-60'
                          : isVoted
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-border-hover bg-background-alt'
                      }`}
                      whileHover={!revealed ? { scale: 1.01 } : {}}
                      whileTap={!revealed ? { scale: 0.99 } : {}}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-foreground-subtle">Variant {variant}</span>
                          <p className="text-sm font-semibold text-foreground mt-1">{subject}</p>
                        </div>
                        {isWinner && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                            <Trophy className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          </motion.div>
                        )}
                      </div>

                      {/* Stats reveal */}
                      {revealed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-border flex gap-4"
                        >
                          <div>
                            <p className="text-[10px] text-foreground-subtle">Open rate</p>
                            <p className="text-sm font-bold text-foreground">{stats.openRate}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-foreground-subtle">CTR</p>
                            <p className="text-sm font-bold text-foreground">{stats.ctr}%</p>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Insight + next */}
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="p-3 rounded-lg bg-background-alt border border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BarChart3 className="w-3 h-3 text-accent" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Insight</span>
                    </div>
                    <p className="text-sm text-foreground-muted">{test.insight}</p>
                  </div>
                  <button onClick={nextTest} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
                    {currentTest < tests.length - 1 ? 'Next round' : 'See results'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
