'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import {
  Mail, Clock, GitBranch, UserPlus, MousePointerClick,
  Send, Tag, CheckCircle2, XCircle, Eye, Zap, Play, Pause,
  RotateCcw
} from 'lucide-react';

type NodeType = 'trigger' | 'delay' | 'email' | 'condition' | 'action' | 'end';

interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number;
  y: number;
  children?: string[];
  childLabels?: string[];
}

const flowNodes: FlowNode[] = [
  { id: 'trigger', type: 'trigger', label: 'New Subscriber', sublabel: 'Form signup', icon: UserPlus, x: 50, y: 8, children: ['delay1'] },
  { id: 'delay1', type: 'delay', label: 'Wait 1 day', sublabel: '24 hours', icon: Clock, x: 50, y: 22, children: ['welcome'] },
  { id: 'welcome', type: 'email', label: 'Welcome Email', sublabel: '72% open rate', icon: Mail, x: 50, y: 36, children: ['check_open'] },
  { id: 'check_open', type: 'condition', label: 'Opened?', sublabel: 'Check engagement', icon: Eye, x: 50, y: 52, children: ['product_email', 'reminder'], childLabels: ['Yes', 'No'] },
  { id: 'product_email', type: 'email', label: 'Product Email', sublabel: '45% CTR', icon: Send, x: 25, y: 68, children: ['tag_engaged'] },
  { id: 'reminder', type: 'email', label: 'Reminder', sublabel: 'Re-engage', icon: Mail, x: 75, y: 68, children: ['end_inactive'] },
  { id: 'tag_engaged', type: 'action', label: 'Tag: Engaged', sublabel: 'Add to segment', icon: Tag, x: 25, y: 84, children: ['end_active'] },
  { id: 'end_active', type: 'end', label: 'Converted', sublabel: '12% conversion', icon: CheckCircle2, x: 25, y: 96 },
  { id: 'end_inactive', type: 'end', label: 'Nurture Pool', sublabel: 'Re-enter flow', icon: RotateCcw, x: 75, y: 84 },
];

const nodeColors: Record<NodeType, { bg: string; border: string; icon: string; glow: string }> = {
  trigger: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', icon: 'text-emerald-600 dark:text-emerald-400', glow: 'shadow-emerald-200/50 dark:shadow-emerald-800/30' },
  delay: { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-600 dark:text-amber-400', glow: 'shadow-amber-200/50 dark:shadow-amber-800/30' },
  email: { bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800', icon: 'text-blue-600 dark:text-blue-400', glow: 'shadow-blue-200/50 dark:shadow-blue-800/30' },
  condition: { bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-200 dark:border-violet-800', icon: 'text-violet-600 dark:text-violet-400', glow: 'shadow-violet-200/50 dark:shadow-violet-800/30' },
  action: { bg: 'bg-pink-50 dark:bg-pink-950/40', border: 'border-pink-200 dark:border-pink-800', icon: 'text-pink-600 dark:text-pink-400', glow: 'shadow-pink-200/50 dark:shadow-pink-800/30' },
  end: { bg: 'bg-gray-50 dark:bg-gray-900/40', border: 'border-gray-200 dark:border-gray-700', icon: 'text-gray-600 dark:text-gray-400', glow: 'shadow-gray-200/50 dark:shadow-gray-800/30' },
};

interface Particle {
  id: number;
  path: string[];
  currentIndex: number;
  startTime: number;
}

export function EmailFlowVisualizer() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleCounter, setParticleCounter] = useState(0);

  // Generate paths for particles
  const paths = [
    ['trigger', 'delay1', 'welcome', 'check_open', 'product_email', 'tag_engaged', 'end_active'],
    ['trigger', 'delay1', 'welcome', 'check_open', 'reminder', 'end_inactive'],
  ];

  const spawnParticle = useCallback(() => {
    const pathIndex = Math.random() > 0.35 ? 0 : 1; // 65% convert, 35% nurture
    setParticleCounter(prev => {
      const newId = prev + 1;
      setParticles(p => [...p, {
        id: newId,
        path: paths[pathIndex],
        currentIndex: 0,
        startTime: Date.now(),
      }]);
      return newId;
    });
  }, []);

  // Spawn particles periodically
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(spawnParticle, 2200);
    return () => clearInterval(interval);
  }, [isPlaying, spawnParticle]);

  // Advance particles
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            currentIndex: p.currentIndex + 1,
          }))
          .filter(p => p.currentIndex < p.path.length)
      );
    }, 800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getNodeById = (id: string) => flowNodes.find(n => n.id === id);

  // SVG connection lines
  const connections: { from: FlowNode; to: FlowNode; label?: string }[] = [];
  flowNodes.forEach(node => {
    node.children?.forEach((childId, i) => {
      const child = getNodeById(childId);
      if (child) {
        connections.push({
          from: node,
          to: child,
          label: node.childLabels?.[i],
        });
      }
    });
  });

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background-alt/50">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-bold text-foreground text-sm">Email Automation Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-3">
            <span className="relative flex h-2 w-2">
              {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
            </span>
            <span className="text-xs text-foreground-subtle">{isPlaying ? 'Running' : 'Paused'}</span>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg border border-border hover:bg-surface-hover transition-colors text-foreground-muted"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => { setParticles([]); setIsPlaying(true); }}
            className="p-1.5 rounded-lg border border-border hover:bg-surface-hover transition-colors text-foreground-muted"
            aria-label="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Flow canvas */}
      <div className="relative w-full" style={{ paddingBottom: '110%', minHeight: 500 }}>
        <div className="absolute inset-0 p-4">
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {connections.map(({ from, to, label }) => {
              const x1 = `${from.x}%`;
              const y1 = `${from.y + 3}%`;
              const x2 = `${to.x}%`;
              const y2 = `${to.y - 1}%`;
              const midY = `${(from.y + to.y) / 2 + 1}%`;
              return (
                <g key={`${from.id}-${to.id}`}>
                  <path
                    d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  {label && (
                    <text
                      x={`${(from.x + to.x) / 2 + (to.x > from.x ? 3 : -3)}%`}
                      y={`${(from.y + to.y) / 2 + 2}%`}
                      textAnchor="middle"
                      className="fill-foreground-subtle text-[10px] font-semibold"
                    >
                      {label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Animated particles */}
          <AnimatePresence>
            {particles.map((particle) => {
              const currentNode = getNodeById(particle.path[particle.currentIndex]);
              if (!currentNode) return null;
              return (
                <motion.div
                  key={particle.id}
                  className="absolute z-20 pointer-events-none"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0.8],
                    scale: [0, 1.2, 1, 1],
                    left: `${currentNode.x}%`,
                    top: `${currentNode.y + 1}%`,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/40" />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Flow nodes */}
          {flowNodes.map((node) => {
            const colors = nodeColors[node.type];
            const Icon = node.icon;
            const isActive = activeNode === node.id;
            const hasParticle = particles.some(
              p => p.path[p.currentIndex] === node.id
            );

            return (
              <motion.div
                key={node.id}
                className="absolute z-10"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                whileHover={{ scale: 1.08 }}
                onHoverStart={() => setActiveNode(node.id)}
                onHoverEnd={() => setActiveNode(null)}
              >
                <div
                  className={`
                    relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 cursor-pointer
                    transition-all duration-300 min-w-[120px] max-w-[160px]
                    ${colors.bg} ${colors.border}
                    ${isActive ? `shadow-lg ${colors.glow}` : 'shadow-sm'}
                    ${hasParticle ? 'ring-2 ring-accent/40 ring-offset-1 ring-offset-surface' : ''}
                  `}
                >
                  {/* Node type indicator */}
                  {node.type === 'condition' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                      <GitBranch className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}

                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                    <Icon className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground leading-tight truncate">{node.label}</p>
                    {node.sublabel && (
                      <p className="text-[10px] text-foreground-subtle leading-tight truncate">{node.sublabel}</p>
                    )}
                  </div>
                </div>

                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap z-30 shadow-lg"
                    >
                      {node.type === 'trigger' && 'Starts when a user signs up'}
                      {node.type === 'delay' && 'Waits before next step'}
                      {node.type === 'email' && 'Sends automated email'}
                      {node.type === 'condition' && 'Splits based on behavior'}
                      {node.type === 'action' && 'Tags user in CRM'}
                      {node.type === 'end' && 'Flow endpoint'}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-background-alt/50 text-xs text-foreground-subtle">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            3 emails in flow
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            1 condition
          </span>
        </div>
        <span className="flex items-center gap-1">
          <MousePointerClick className="w-3 h-3" />
          Hover nodes for details
        </span>
      </div>
    </div>
  );
}
