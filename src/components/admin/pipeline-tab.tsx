'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Users, UserCheck, MailOpen, MousePointerClick, Globe, MessageSquareReply,
  CalendarCheck, Trophy, XCircle, ChevronRight, X, StickyNote, RefreshCw,
  ArrowRight, Building2, Loader2, Clock, Link2, Bell, Check
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

function LinkedinIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

const STAGES = [
  { id: 'prospect', label: 'Prospect', icon: Users, color: '#8BA3B5' },
  { id: 'contacted', label: 'Contacted', icon: UserCheck, color: '#023047' },
  { id: 'opened', label: 'Opened', icon: MailOpen, color: '#f59e0b' },
  { id: 'clicked', label: 'Clicked', icon: MousePointerClick, color: '#06B6D4' },
  { id: 'visited', label: 'Visited', icon: Globe, color: '#8B5CF6' },
  { id: 'replied', label: 'Replied', icon: MessageSquareReply, color: '#16a34a' },
  { id: 'meeting', label: 'Meeting', icon: CalendarCheck, color: '#EF476F' },
  { id: 'won', label: 'Won', icon: Trophy, color: '#16a34a' },
  { id: 'lost', label: 'Lost', icon: XCircle, color: '#dc2626' },
];

function LogoImg({ company, size = 20 }: { company: any; size?: number }) {
  const [err, setErr] = useState(false);
  const url = company?.logo_dev_url;
  if (!url || err) return <div style={{ width: size, height: size }} className="rounded bg-[#f1f5f9] flex items-center justify-center"><Building2 size={size * 0.6} className="text-[#8BA3B5]" /></div>;
  return <img src={url} alt="" width={size} height={size} className="rounded object-contain" onError={() => setErr(true)} />;
}

export default function PipelineTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const [noteEdit, setNoteEdit] = useState('');
  const [linkedinEdit, setLinkedinEdit] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pipeline');
      if (res.ok) { const d = await res.json(); setLeads(d.leads || []); setActions(d.scheduledActions || []); }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const moveToStage = async (leadId: string, stage: string) => {
    setMoving(leadId);
    await fetch('/api/pipeline', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: leadId, pipeline_stage: stage }) });
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipeline_stage: stage, pipeline_updated_at: new Date().toISOString() } : l));
    if (selected?.id === leadId) setSelected((p: any) => ({ ...p, pipeline_stage: stage }));
    setMoving(null);
  };

  const saveField = async (leadId: string, field: string, value: string) => {
    await fetch('/api/pipeline', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: leadId, pipeline_stage: selected.pipeline_stage, [field]: value }) });
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, [field]: value } : l));
    setSelected((p: any) => ({ ...p, [field]: value }));
  };

  const scheduleLinkedIn = async (lead: any, daysFromNow: number) => {
    setScheduling(true);
    const scheduledFor = new Date(Date.now() + daysFromNow * 86400000).toISOString();
    await fetch('/api/pipeline', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact_id: lead.id,
        action_type: 'linkedin_connect',
        scheduled_for: scheduledFor,
        metadata: { linkedin_url: lead.linkedin_url, name: `${lead.first_name} ${lead.last_name}`, company: lead.companies?.domain },
      }),
    });
    await fetchLeads();
    setScheduling(false);
  };

  const timeAgo = (d: string) => {
    if (!d) return '';
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    return hrs < 24 ? `${hrs}h` : `${Math.floor(hrs / 24)}d`;
  };

  const momentum = (lead: any) => {
    const daysSince = (Date.now() - new Date(lead.pipeline_updated_at).getTime()) / 86400000;
    if (daysSince < 1) return { label: 'Surging', color: 'text-[#16a34a]', bg: 'bg-emerald-50' };
    if (daysSince < 3) return { label: 'Active', color: 'text-[#06B6D4]', bg: 'bg-cyan-50' };
    if (daysSince < 7) return { label: 'Stale', color: 'text-[#f59e0b]', bg: 'bg-amber-50' };
    return { label: 'Cold', color: 'text-[#dc2626]', bg: 'bg-red-50' };
  };

  if (loading) return <div className="flex items-center justify-center py-16 text-[#8BA3B5] text-sm"><Loader2 size={16} className="animate-spin mr-2" /> Loading pipeline...</div>;

  const grouped: Record<string, any[]> = {};
  STAGES.forEach(s => { grouped[s.id] = []; });
  leads.forEach(l => { const st = l.pipeline_stage || 'prospect'; (grouped[st] || grouped['prospect']).push(l); });

  const activeStages = STAGES.filter(s => grouped[s.id].length > 0 || ['prospect', 'contacted', 'replied', 'won'].includes(s.id));

  // Upcoming LinkedIn actions
  const pendingLinkedIn = actions.filter(a => a.action_type === 'linkedin_connect');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-[#8BA3B5]" />
          <h3 className="text-sm font-bold text-[#023047]">Lead Pipeline</h3>
          <span className="text-[10px] text-[#8BA3B5] bg-[#f1f5f9] px-2 py-0.5 rounded-full font-semibold">{leads.length}</span>
        </div>
        <button onClick={fetchLeads} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f1f5f9] text-[11px] font-semibold text-[#64748b] cursor-pointer border-none hover:bg-[#e8edf2] transition">
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* Upcoming LinkedIn actions */}
      {pendingLinkedIn.length > 0 && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2"><Bell size={13} className="text-[#3b82f6]" /><span className="text-[11px] font-bold text-[#1e40af]">Upcoming LinkedIn actions</span></div>
          <div className="flex flex-col gap-1.5">
            {pendingLinkedIn.map((a: any) => (
              <div key={a.id} className="flex items-center gap-2 text-[11px]">
                <LinkedinIcon size={12} className="text-[#0A66C2]" />
                <span className="text-[#023047] font-medium">{a.metadata?.name}</span>
                <span className="text-[#8BA3B5]">at {a.metadata?.company}</span>
                <span className="ml-auto text-[10px] text-[#3b82f6] font-semibold">
                  <Clock size={10} className="inline mr-0.5" />
                  {new Date(a.scheduled_for).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversion funnel */}
      {leads.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8EDF2] p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={13} className="text-[#8BA3B5]" />
            <span className="text-[11px] font-bold text-[#023047]">Funnel</span>
          </div>
          <div className="flex items-end gap-1">
            {STAGES.filter(s => grouped[s.id].length > 0 || ['prospect', 'contacted', 'won'].includes(s.id)).map(stage => {
              const count = grouped[stage.id].length;
              const max = Math.max(...Object.values(grouped).map(g => g.length), 1);
              const pct = (count / max) * 100;
              return (
                <div key={stage.id} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#023047]">{count}</span>
                  <div className="w-full rounded-t" style={{ height: Math.max(pct * 0.6, 4), background: stage.color, opacity: 0.7, transition: 'height 0.3s' }} />
                  <span className="text-[8px] text-[#8BA3B5] truncate w-full text-center">{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: 'x mandatory' }}>
        {activeStages.map(stage => {
          const Icon = stage.icon;
          const stageLeads = grouped[stage.id];
          return (
            <div key={stage.id} className="flex-shrink-0 w-[220px] flex flex-col" style={{ scrollSnapAlign: 'start' }}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Icon size={13} style={{ color: stage.color }} />
                <span className="text-[11px] font-bold text-[#023047]">{stage.label}</span>
                <span className="text-[10px] text-[#8BA3B5] bg-[#f1f5f9] px-1.5 py-0.5 rounded-full font-semibold ml-auto">{stageLeads.length}</span>
              </div>
              <div className="flex flex-col gap-2 min-h-[80px] bg-[#f4f7fa] rounded-xl p-2">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-6 text-[10px] text-[#8BA3B5]">Empty</div>
                ) : stageLeads.map((lead: any) => {
                  const co = lead.companies;
                  const hasLinkedin = !!lead.linkedin_url;
                  return (
                    <button key={lead.id} onClick={() => { setSelected(lead); setNoteEdit(lead.notes || ''); setLinkedinEdit(lead.linkedin_url || ''); }} className="w-full text-left p-3 rounded-lg bg-white border border-[#E8EDF2] hover:border-[#023047] hover:shadow-sm transition cursor-pointer group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[#023047] truncate">{lead.first_name} {lead.last_name}</span>
                        <div className="flex items-center gap-1">
                          {hasLinkedin && <LinkedinIcon size={10} className="text-[#0A66C2]" />}
                          <ChevronRight size={12} className="text-[#8BA3B5] opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      </div>
                      {co && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <LogoImg company={co} size={14} />
                          <span className="text-[10px] text-[#4A6B7F] truncate">{co.name || co.domain}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px] text-[#8BA3B5]">{lead.role || ''}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${momentum(lead).bg} ${momentum(lead).color}`}>{momentum(lead).label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail slide-over */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EDF2] sticky top-0 bg-white z-10">
              <h3 className="text-sm font-bold text-[#023047]">{selected.first_name} {selected.last_name}</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-[#f1f5f9] transition cursor-pointer border-none bg-transparent"><X size={16} className="text-[#8BA3B5]" /></button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* Company */}
              {selected.companies && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#f4f7fa]">
                  <LogoImg company={selected.companies} size={40} />
                  <div>
                    <p className="text-sm font-bold text-[#023047]">{selected.companies.name || selected.companies.domain}</p>
                    <p className="text-[11px] text-[#8BA3B5]">{selected.companies.domain}</p>
                  </div>
                </div>
              )}

              {/* Contact info */}
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-[#8BA3B5]">Email</span><span className="text-[#023047] font-medium">{selected.email}</span></div>
                <div className="flex justify-between"><span className="text-[#8BA3B5]">Role</span><span className="text-[#023047] font-medium">{selected.role || '—'}</span></div>
              </div>

              {/* LinkedIn */}
              <div>
                <p className="text-[11px] font-semibold text-[#8BA3B5] uppercase tracking-wide mb-2 flex items-center gap-1"><LinkedinIcon size={12} className="text-[#0A66C2]" /> LinkedIn</p>
                <div className="flex gap-2">
                  <input
                    value={linkedinEdit}
                    onChange={e => setLinkedinEdit(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="flex-1 px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs outline-none focus:border-[#0A66C2] transition"
                  />
                  {linkedinEdit !== (selected.linkedin_url || '') && (
                    <button onClick={() => saveField(selected.id, 'linkedin_url', linkedinEdit)} className="px-3 py-2 rounded-lg bg-[#0A66C2] text-white text-[11px] font-semibold cursor-pointer border-none"><Check size={12} /></button>
                  )}
                </div>
                {selected.linkedin_url && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    <a href={selected.linkedin_url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[11px] text-[#0A66C2] font-medium no-underline hover:underline">
                      <Link2 size={11} /> Open profile
                    </a>
                    {/* Schedule LinkedIn follow-up */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-[#8BA3B5]">Send connect request:</span>
                      {[1, 2, 3, 7].map(d => (
                        <button
                          key={d}
                          onClick={() => scheduleLinkedIn(selected, d)}
                          disabled={scheduling}
                          className="px-2 py-1 rounded text-[10px] font-semibold border border-[#E8EDF2] bg-white hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition cursor-pointer text-[#023047]"
                        >
                          {scheduling ? '...' : `+${d}d`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Current stage + signal */}
              <div>
                <p className="text-[11px] font-semibold text-[#8BA3B5] uppercase tracking-wide mb-2">Stage</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {(() => {
                    const st = STAGES.find(s => s.id === selected.pipeline_stage);
                    const Icon = st?.icon || Users;
                    return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: st?.color || '#8BA3B5' }}><Icon size={13} /> {st?.label}</span>;
                  })()}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${momentum(selected).bg} ${momentum(selected).color}`}>{momentum(selected).label}</span>
                </div>
                {/* Why explanation */}
                <div className="mt-2 p-2.5 rounded-lg bg-[#f8fafc] border border-[#f4f7fa]">
                  <p className="text-[10px] text-[#4A6B7F] leading-relaxed">
                    {(() => {
                      const m = momentum(selected);
                      const daysSince = Math.floor((Date.now() - new Date(selected.pipeline_updated_at).getTime()) / 86400000);
                      const reasons: string[] = [];
                      if (selected.pipeline_stage === 'clicked') reasons.push('clicked your email CTA');
                      if (selected.pipeline_stage === 'opened') reasons.push('opened your email');
                      if (selected.pipeline_stage === 'visited') reasons.push('visited your website');
                      if (selected.pipeline_stage === 'replied') reasons.push('replied to your outreach');
                      if (selected.pipeline_stage === 'contacted') reasons.push('was contacted via outreach');
                      if (m.label === 'Surging') reasons.push('activity in the last 24h');
                      if (m.label === 'Cold') reasons.push(`no activity for ${daysSince}+ days — consider re-engagement`);
                      if (m.label === 'Stale') reasons.push(`last activity ${daysSince}d ago — follow up soon`);
                      return reasons.length > 0
                        ? `${selected.first_name} ${reasons.join(', ')}.`
                        : `In ${selected.pipeline_stage} stage for ${daysSince} days.`;
                    })()}
                  </p>
                </div>
              </div>

              {/* Move to */}
              <div>
                <p className="text-[11px] font-semibold text-[#8BA3B5] uppercase tracking-wide mb-2">Move to</p>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.filter(s => s.id !== selected.pipeline_stage).map(stage => {
                    const Icon = stage.icon;
                    return (
                      <button key={stage.id} onClick={() => moveToStage(selected.id, stage.id)} disabled={!!moving} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border border-[#E8EDF2] bg-white hover:bg-[#f8fafc] transition cursor-pointer text-[#023047]">
                        {moving === selected.id ? <Loader2 size={10} className="animate-spin" /> : <Icon size={10} style={{ color: stage.color }} />}
                        {stage.label} <ArrowRight size={8} className="text-[#8BA3B5]" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[11px] font-semibold text-[#8BA3B5] uppercase tracking-wide mb-2">Notes</p>
                <textarea value={noteEdit} onChange={e => setNoteEdit(e.target.value)} placeholder="Add notes..." rows={3} className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-xs outline-none resize-y focus:border-[#023047] transition" />
                {noteEdit !== (selected.notes || '') && (
                  <button onClick={() => saveField(selected.id, 'notes', noteEdit)} className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#023047] text-white text-[11px] font-semibold cursor-pointer border-none"><StickyNote size={11} /> Save</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
