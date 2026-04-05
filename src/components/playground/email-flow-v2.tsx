'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mail, Clock, UserPlus, MousePointerClick, Send,
  Tag, CheckCircle2, Eye, Zap, Play, Pause,
  RotateCcw, X, BarChart3
} from 'lucide-react';

interface FlowNode {
  id: string;
  type: 'trigger' | 'delay' | 'email' | 'condition' | 'action' | 'end';
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  detail?: { subject?: string; body?: string; metric?: string };
}

interface FlowStep {
  nodeId: string;
  next?: string;
  branches?: { label: string; next: string; color: string }[];
}

const nodes: Record<string, FlowNode> = {
  trigger: { id: 'trigger', type: 'trigger', label: 'New Subscriber', sublabel: 'Form signup detected', icon: UserPlus },
  delay_1d: { id: 'delay_1d', type: 'delay', label: 'Wait 24 hours', sublabel: 'Timing optimization', icon: Clock },
  welcome: {
    id: 'welcome', type: 'email', label: 'Welcome Email', sublabel: 'Sent to all new subscribers', icon: Mail,
    detail: { subject: 'Welkom bij [Brand]!', body: 'Introductie, waardepropositie, eerste CTA naar product pagina.', metric: 'Open rate: 72% · CTR: 18%' },
  },
  check_open: { id: 'check_open', type: 'condition', label: 'Email opened?', sublabel: 'Engagement check after 48h', icon: Eye },
  delay_3d: { id: 'delay_3d', type: 'delay', label: 'Wait 3 days', sublabel: 'Give time to engage', icon: Clock },
  product: {
    id: 'product', type: 'email', label: 'Product Highlight', sublabel: 'Personalized recommendation', icon: Send,
    detail: { subject: 'Dit past bij jou', body: 'Productaanbeveling op basis van signup data. Bevat social proof en urgency.', metric: 'Open rate: 45% · CTR: 12%' },
  },
  reminder: {
    id: 'reminder', type: 'email', label: 'Re-engagement', sublabel: 'Win-back attempt', icon: Mail,
    detail: { subject: 'We missen je!', body: 'Zachte herinnering met incentive (korting/gratis trial). Laatste poging.', metric: 'Open rate: 28% · CTR: 6%' },
  },
  tag_hot: { id: 'tag_hot', type: 'action', label: 'Tag: Hot Lead', sublabel: 'Move to sales pipeline', icon: Tag },
  tag_nurture: { id: 'tag_nurture', type: 'action', label: 'Tag: Nurture', sublabel: 'Re-enter in 30 days', icon: RotateCcw },
  end_converted: { id: 'end_converted', type: 'end', label: 'Converted', sublabel: '~12% of subscribers', icon: CheckCircle2 },
  end_nurture: { id: 'end_nurture', type: 'end', label: 'Nurture Pool', sublabel: 'Try again later', icon: Clock },
};

const flow: FlowStep[] = [
  { nodeId: 'trigger', next: 'delay_1d' },
  { nodeId: 'delay_1d', next: 'welcome' },
  { nodeId: 'welcome', next: 'check_open' },
  { nodeId: 'check_open', branches: [
    { label: 'Opened', next: 'delay_3d', color: 'text-emerald-500' },
    { label: 'Not opened', next: 'reminder', color: 'text-amber-500' },
  ]},
  { nodeId: 'delay_3d', next: 'product' },
  { nodeId: 'product', next: 'tag_hot' },
  { nodeId: 'tag_hot', next: 'end_converted' },
  { nodeId: 'reminder', next: 'tag_nurture' },
  { nodeId: 'tag_nurture', next: 'end_nurture' },
];

const typeStyles = {
  trigger: { bg: 'bg-emerald-50 dark:bg-emerald-950/50', border: 'border-emerald-300 dark:border-emerald-700', icon: 'text-emerald-600 dark:text-emerald-400' },
  delay: { bg: 'bg-amber-50 dark:bg-amber-950/50', border: 'border-amber-300 dark:border-amber-700', icon: 'text-amber-600 dark:text-amber-400' },
  email: { bg: 'bg-blue-50 dark:bg-blue-950/50', border: 'border-blue-300 dark:border-blue-700', icon: 'text-blue-600 dark:text-blue-400' },
  condition: { bg: 'bg-violet-50 dark:bg-violet-950/50', border: 'border-violet-300 dark:border-violet-700', icon: 'text-violet-600 dark:text-violet-400' },
  action: { bg: 'bg-pink-50 dark:bg-pink-950/50', border: 'border-pink-300 dark:border-pink-700', icon: 'text-pink-600 dark:text-pink-400' },
  end: { bg: 'bg-gray-50 dark:bg-gray-800/50', border: 'border-gray-300 dark:border-gray-600', icon: 'text-gray-500 dark:text-gray-400' },
};

// Two possible journey paths
const journeyPaths = [
  ['trigger', 'delay_1d', 'welcome', 'check_open', 'delay_3d', 'product', 'tag_hot', 'end_converted'],
  ['trigger', 'delay_1d', 'welcome', 'check_open', 'reminder', 'tag_nurture', 'end_nurture'],
];

function NodeCard({ node, isActive, isHighlighted, onClick }: {
  node: FlowNode; isActive: boolean; isHighlighted: boolean; onClick: () => void;
}) {
  const style = typeStyles[node.type];
  const Icon = node.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full max-w-xs flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-300
        ${style.bg} ${style.border}
        ${isHighlighted ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}
        ${isActive ? 'shadow-lg scale-[1.02]' : 'shadow-sm hover:shadow-md'}
      `}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg} border ${style.border}`}>
        <Icon className={`w-4 h-4 ${style.icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground leading-tight">{node.label}</p>
        <p className="text-[11px] text-foreground-subtle leading-tight mt-0.5">{node.sublabel}</p>
      </div>
      {node.detail && (
        <BarChart3 className="w-3.5 h-3.5 text-foreground-subtle flex-shrink-0" />
      )}
    </motion.button>
  );
}

export function EmailFlowV2() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pathRef = useRef(0);
  const stepRef = useRef(0);

  const runSimulation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const path = journeyPaths[pathRef.current];
    stepRef.current = 0;

    timerRef.current = setInterval(() => {
      if (stepRef.current >= path.length) {
        // Switch to other path
        pathRef.current = pathRef.current === 0 ? 1 : 0;
        stepRef.current = 0;
        setActiveNodeId(null);
        // Brief pause between runs
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => {
          if (isPlaying) runSimulation();
        }, 1200);
        return;
      }
      setActiveNodeId(path[stepRef.current]);
      stepRef.current++;
    }, 900);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      runSimulation();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, runSimulation]);

  const selectedDetail = selectedNode ? nodes[selectedNode] : null;

  // Build the visual layout: main column, then branch
  const mainFlow = flow.filter(s => !['reminder', 'tag_nurture', 'end_nurture'].includes(s.nodeId));
  const branchFlow = flow.filter(s => ['reminder', 'tag_nurture', 'end_nurture'].includes(s.nodeId));

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">Email Automation Flow</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">9 steps</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
          </span>
          <span className="text-xs text-foreground-subtle">{isPlaying ? 'Simulating' : 'Paused'}</span>
          <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 rounded-lg border border-border hover:bg-surface-hover transition-colors text-foreground-muted ml-1">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Flow diagram */}
          <div className="space-y-0">
            {flow.map((step, i) => {
              const node = nodes[step.nodeId];
              if (!node) return null;

              // Skip branch nodes in main column — we'll render them differently
              if (['reminder', 'tag_nurture', 'end_nurture'].includes(step.nodeId)) return null;

              const isCondition = !!step.branches;

              return (
                <div key={step.nodeId}>
                  {/* Node */}
                  <div className={`flex ${isCondition ? 'justify-center' : 'justify-start lg:justify-start'}`}>
                    <NodeCard
                      node={node}
                      isActive={selectedNode === node.id}
                      isHighlighted={activeNodeId === node.id}
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    />
                  </div>

                  {/* Connector */}
                  {step.next && (
                    <div className="flex justify-start lg:justify-start pl-[26px] lg:pl-[26px]">
                      <div className="w-px h-6 bg-border relative">
                        <motion.div
                          className="absolute top-0 left-0 w-px bg-accent"
                          initial={{ height: 0 }}
                          animate={{ height: activeNodeId === step.next ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Condition branches */}
                  {isCondition && step.branches && (
                    <div className="mt-2 mb-2">
                      <div className="flex justify-start lg:justify-start pl-[26px]">
                        <div className="w-px h-4 bg-border" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 max-w-lg">
                        {/* Left branch: Opened → continues in main flow */}
                        <div className="text-center">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                            Opened
                          </span>
                          <div className="mx-auto w-px h-4 bg-emerald-300 dark:bg-emerald-700 mt-1" />
                        </div>
                        {/* Right branch: Not opened → separate flow */}
                        <div className="text-center">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
                            Not opened
                          </span>
                          <div className="mx-auto w-px h-4 bg-amber-300 dark:bg-amber-700 mt-1" />
                          {/* Branch nodes inline */}
                          <div className="space-y-0 mt-1">
                            {branchFlow.map((bs, bi) => {
                              const bNode = nodes[bs.nodeId];
                              return (
                                <div key={bs.nodeId}>
                                  <NodeCard
                                    node={bNode}
                                    isActive={selectedNode === bNode.id}
                                    isHighlighted={activeNodeId === bNode.id}
                                    onClick={() => setSelectedNode(selectedNode === bNode.id ? null : bNode.id)}
                                  />
                                  {bs.next && (
                                    <div className="flex justify-center">
                                      <div className="w-px h-4 bg-border" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <AnimatePresence mode="wait">
              {selectedDetail?.detail ? (
                <motion.div
                  key={selectedDetail.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="rounded-xl border border-border bg-background-alt p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">Email details</span>
                    <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-surface-hover text-foreground-subtle">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-subtle mb-1">Subject line</p>
                    <p className="text-sm font-semibold text-foreground">{selectedDetail.detail.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-subtle mb-1">Content strategy</p>
                    <p className="text-sm text-foreground-muted leading-relaxed">{selectedDetail.detail.body}</p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-foreground-subtle mb-1">Performance</p>
                    <p className="text-sm font-mono font-medium text-foreground">{selectedDetail.detail.metric}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-dashed border-border bg-background-alt/50 p-5 text-center"
                >
                  <MousePointerClick className="w-6 h-6 text-foreground-subtle mx-auto mb-2" />
                  <p className="text-sm text-foreground-subtle">Click an email node to see details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-foreground-subtle">
        <span>3 emails · 1 condition · 2 endpoints</span>
        <span className="text-accent font-medium">Built with Deployteq / Marketing Cloud logic</span>
      </div>
    </div>
  );
}
