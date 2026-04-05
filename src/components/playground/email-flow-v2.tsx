'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mail, Clock, UserPlus, Send, Tag, CheckCircle2, Eye, Zap,
  Play, Pause, RotateCcw, X, MousePointerClick, BarChart3
} from 'lucide-react';

type NodeType = 'trigger' | 'delay' | 'email' | 'condition' | 'action' | 'end';

interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  detail?: { subject?: string; body?: string; metric?: string };
}

const nodeData: Record<string, FlowNode> = {
  trigger: { id: 'trigger', type: 'trigger', label: 'New Subscriber', sublabel: 'Form signup detected', icon: UserPlus },
  delay1: { id: 'delay1', type: 'delay', label: 'Wait 24 hours', sublabel: 'Timing optimization', icon: Clock },
  welcome: {
    id: 'welcome', type: 'email', label: 'Welcome Email', sublabel: '72% open rate', icon: Mail,
    detail: { subject: 'Welkom bij [Brand]!', body: 'Introductie, waardepropositie, eerste CTA naar productpagina.', metric: 'Open rate: 72% · CTR: 18%' },
  },
  condition: { id: 'condition', type: 'condition', label: 'Email opened?', sublabel: 'Check na 48 uur', icon: Eye },
  delay3: { id: 'delay3', type: 'delay', label: 'Wait 3 days', sublabel: 'Engagement window', icon: Clock },
  product: {
    id: 'product', type: 'email', label: 'Product Email', sublabel: '45% CTR', icon: Send,
    detail: { subject: 'Dit past bij jou', body: 'Gepersonaliseerde productaanbeveling met social proof en urgency.', metric: 'Open rate: 45% · CTR: 12%' },
  },
  tag_hot: { id: 'tag_hot', type: 'action', label: 'Tag: Hot Lead', sublabel: 'Naar sales pipeline', icon: Tag },
  converted: { id: 'converted', type: 'end', label: 'Converted', sublabel: '~12% van subscribers', icon: CheckCircle2 },
  reminder: {
    id: 'reminder', type: 'email', label: 'Re-engagement', sublabel: 'Win-back poging', icon: Mail,
    detail: { subject: 'We missen je!', body: 'Zachte herinnering met incentive (korting/gratis trial).', metric: 'Open rate: 28% · CTR: 6%' },
  },
  tag_nurture: { id: 'tag_nurture', type: 'action', label: 'Tag: Nurture', sublabel: 'Opnieuw over 30 dagen', icon: RotateCcw },
  nurture_pool: { id: 'nurture_pool', type: 'end', label: 'Nurture Pool', sublabel: 'Opnieuw proberen', icon: Clock },
};

const styles: Record<NodeType, { bg: string; text: string; icon: string; border: string }> = {
  trigger: { bg: 'bg-emerald-100 dark:bg-emerald-900', text: 'text-emerald-900 dark:text-emerald-100', icon: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700' },
  delay: { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-900 dark:text-amber-100', icon: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' },
  email: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-900 dark:text-blue-100', icon: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  condition: { bg: 'bg-violet-100 dark:bg-violet-900', text: 'text-violet-900 dark:text-violet-100', icon: 'text-violet-700 dark:text-violet-300', border: 'border-violet-300 dark:border-violet-700' },
  action: { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-900 dark:text-pink-100', icon: 'text-pink-700 dark:text-pink-300', border: 'border-pink-300 dark:border-pink-700' },
  end: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-900 dark:text-gray-100', icon: 'text-gray-600 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600' },
};

// Left path (opened) and right path (not opened)
const leftPath = ['trigger', 'delay1', 'welcome', 'condition', 'delay3', 'product', 'tag_hot', 'converted'];
const rightPath = ['reminder', 'tag_nurture', 'nurture_pool'];

function NodeCard({ node, isHighlighted, onClick }: {
  node: FlowNode; isHighlighted: boolean; onClick: () => void;
}) {
  const s = styles[node.type];
  const Icon = node.icon;
  const hasDetail = !!node.detail;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-300 w-full
        ${s.bg} ${s.border}
        ${isHighlighted ? 'ring-2 ring-accent ring-offset-2 ring-offset-background shadow-lg' : 'shadow-sm hover:shadow-md'}
      `}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/30 dark:bg-white/10`}>
        <Icon className={`w-4 h-4 ${s.icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-bold leading-tight ${s.text}`}>{node.label}</p>
        <p className={`text-[11px] leading-tight mt-0.5 opacity-70 ${s.text}`}>{node.sublabel}</p>
      </div>
      {hasDetail && <BarChart3 className={`w-3.5 h-3.5 flex-shrink-0 opacity-50 ${s.icon}`} />}
    </motion.button>
  );
}

function Connector({ color = 'bg-border' }: { color?: string }) {
  return (
    <div className="flex justify-center py-1">
      <div className={`w-0.5 h-6 ${color} rounded-full`} />
    </div>
  );
}

export function EmailFlowV2() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const pathRef = useRef(0);
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allPaths = [leftPath, ['trigger', 'delay1', 'welcome', 'condition', ...rightPath]];

  const runSim = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const path = allPaths[pathRef.current];
    stepRef.current = 0;

    timerRef.current = setInterval(() => {
      if (stepRef.current >= path.length) {
        setActiveNodeId(null);
        if (timerRef.current) clearInterval(timerRef.current);
        pathRef.current = pathRef.current === 0 ? 1 : 0;
        setTimeout(runSim, 1500);
        return;
      }
      setActiveNodeId(path[stepRef.current]);
      stepRef.current++;
    }, 800);
  }, []);

  useEffect(() => {
    if (isPlaying) runSim();
    else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, runSim]);

  const selectedDetail = selectedNode ? nodeData[selectedNode] : null;

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">Email Automation Flow</span>
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
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Flow */}
          <div>
            {/* Main flow: trigger → delay → welcome → condition */}
            <div className="max-w-sm">
              {['trigger', 'delay1', 'welcome', 'condition'].map((id, i) => (
                <div key={id}>
                  <NodeCard
                    node={nodeData[id]}
                    isHighlighted={activeNodeId === id}
                    onClick={() => setSelectedNode(selectedNode === id ? null : id)}
                  />
                  {i < 3 && <Connector />}
                </div>
              ))}
            </div>

            {/* Branch split */}
            <div className="mt-3">
              {/* Branch labels */}
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div className="text-center">
                  <div className="flex justify-center py-1"><div className="w-0.5 h-4 bg-emerald-400 dark:bg-emerald-600 rounded-full" /></div>
                  <span className="inline-block text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
                    Opened
                  </span>
                  <div className="flex justify-center py-1"><div className="w-0.5 h-4 bg-emerald-400 dark:bg-emerald-600 rounded-full" /></div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center py-1"><div className="w-0.5 h-4 bg-amber-400 dark:bg-amber-600 rounded-full" /></div>
                  <span className="inline-block text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                    Not opened
                  </span>
                  <div className="flex justify-center py-1"><div className="w-0.5 h-4 bg-amber-400 dark:bg-amber-600 rounded-full" /></div>
                </div>
              </div>

              {/* Two columns for branches */}
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                {/* Left: opened path */}
                <div>
                  {['delay3', 'product', 'tag_hot', 'converted'].map((id, i) => (
                    <div key={id}>
                      <NodeCard
                        node={nodeData[id]}
                        isHighlighted={activeNodeId === id}
                        onClick={() => setSelectedNode(selectedNode === id ? null : id)}
                      />
                      {i < 3 && <Connector color="bg-emerald-300 dark:bg-emerald-700" />}
                    </div>
                  ))}
                </div>

                {/* Right: not opened path */}
                <div>
                  {rightPath.map((id, i) => (
                    <div key={id}>
                      <NodeCard
                        node={nodeData[id]}
                        isHighlighted={activeNodeId === id}
                        onClick={() => setSelectedNode(selectedNode === id ? null : id)}
                      />
                      {i < rightPath.length - 1 && <Connector color="bg-amber-300 dark:bg-amber-700" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                  className="rounded-xl border border-dashed border-border bg-background-alt/50 p-6 text-center"
                >
                  <MousePointerClick className="w-6 h-6 text-foreground-subtle mx-auto mb-2" />
                  <p className="text-sm text-foreground-subtle">Click an email node to see campaign details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-foreground-subtle">
        <span>3 emails · 1 condition · 2 endpoints</span>
        <span className="text-accent font-medium">Deployteq / Marketing Cloud logic</span>
      </div>
    </div>
  );
}
