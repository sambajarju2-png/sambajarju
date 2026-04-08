'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Users, UserCheck, MailOpen, MousePointerClick, Globe, MessageSquareReply,
  CalendarCheck, Trophy, XCircle, ChevronRight, X, StickyNote, RefreshCw,
  ArrowRight, Building2, Loader2
} from 'lucide-react';

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

export default function PipelineTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const [noteEdit, setNoteEdit] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pipeline');
      if (res.ok) { const d = await res.json(); setLeads(d.leads || []); }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const moveToStage = async (leadId: string, stage: string) => {
    setMoving(leadId);
    try {
      await fetch('/api/pipeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, pipeline_stage: stage }),
      });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipeline_stage: stage, pipeline_updated_at: new Date().toISOString() } : l));
      if (selectedLead?.id === leadId) setSelectedLead((p: any) => ({ ...p, pipeline_stage: stage }));
    } catch (e) { console.error(e); }
    setMoving(null);
  };

  const saveNote = async (leadId: string) => {
    await fetch('/api/pipeline', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: leadId, pipeline_stage: selectedLead.pipeline_stage, notes: noteEdit }),
    });
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: noteEdit } : l));
    setSelectedLead((p: any) => ({ ...p, notes: noteEdit }));
  };

  const timeAgo = (d: string) => {
    if (!d) return '';
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16 text-[#8BA3B5]">
      <Loader2 size={20} className="animate-spin mr-2" /> Loading pipeline...
    </div>
  );

  // Group leads by stage
  const grouped: Record<string, any[]> = {};
  STAGES.forEach(s => { grouped[s.id] = []; });
  leads.forEach(l => {
    const stage = l.pipeline_stage || 'prospect';
    if (grouped[stage]) grouped[stage].push(l);
    else grouped['prospect'].push(l);
  });

  // Only show stages that have leads OR are key stages
  const activeStages = STAGES.filter(s =>
    grouped[s.id].length > 0 || ['prospect', 'contacted', 'replied', 'won'].includes(s.id)
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-[#8BA3B5]" />
          <h3 className="text-sm font-bold text-[#023047]">Lead Pipeline</h3>
          <span className="text-[10px] text-[#8BA3B5] bg-[#f1f5f9] px-2 py-0.5 rounded-full font-semibold">{leads.length} leads</span>
        </div>
        <button onClick={fetchLeads} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f1f5f9] text-[11px] font-semibold text-[#64748b] cursor-pointer border-none hover:bg-[#e8edf2] transition">
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: 'x mandatory' }}>
        {activeStages.map(stage => {
          const StageIcon = stage.icon;
          const stageLeads = grouped[stage.id];
          return (
            <div key={stage.id} className="flex-shrink-0 w-[220px] flex flex-col" style={{ scrollSnapAlign: 'start' }}>
              {/* Column header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <StageIcon size={13} style={{ color: stage.color }} />
                <span className="text-[11px] font-bold text-[#023047]">{stage.label}</span>
                <span className="text-[10px] text-[#8BA3B5] bg-[#f1f5f9] px-1.5 py-0.5 rounded-full font-semibold ml-auto">{stageLeads.length}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 min-h-[80px] bg-[#f4f7fa] rounded-xl p-2">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-6 text-[10px] text-[#8BA3B5]">Empty</div>
                ) : stageLeads.map((lead: any) => {
                  const company = lead.companies;
                  return (
                    <button
                      key={lead.id}
                      onClick={() => { setSelectedLead(lead); setNoteEdit(lead.notes || ''); }}
                      className="w-full text-left p-3 rounded-lg bg-white border border-[#E8EDF2] hover:border-[#023047] hover:shadow-sm transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[#023047] truncate">{lead.first_name} {lead.last_name}</span>
                        <ChevronRight size={12} className="text-[#8BA3B5] opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      {company && (
                        <div className="flex items-center gap-1.5 mb-1">
                          {company.logo_url ? (
                            <img src={company.logo_url} alt="" className="w-3.5 h-3.5 rounded-sm" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-sm bg-[#f1f5f9]" />
                          )}
                          <span className="text-[10px] text-[#4A6B7F] truncate">{company.name || company.domain}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-[#8BA3B5]">{lead.role || ''}</span>
                        <span className="text-[9px] text-[#8BA3B5]">{timeAgo(lead.pipeline_updated_at)}</span>
                      </div>
                      {lead.notes && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <StickyNote size={9} className="text-[#f59e0b]" />
                          <span className="text-[9px] text-[#8BA3B5] truncate">{lead.notes.slice(0, 30)}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedLead(null)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EDF2]">
              <h3 className="text-sm font-bold text-[#023047]">{selectedLead.first_name} {selectedLead.last_name}</h3>
              <button onClick={() => setSelectedLead(null)} className="p-1 rounded-lg hover:bg-[#f1f5f9] transition cursor-pointer border-none bg-transparent">
                <X size={16} className="text-[#8BA3B5]" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* Company info */}
              {selectedLead.companies && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#f4f7fa]">
                  {selectedLead.companies.logo_url ? (
                    <img src={selectedLead.companies.logo_url} alt="" className="w-10 h-10 rounded-lg" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#E8EDF2] flex items-center justify-center">
                      <Building2 size={18} className="text-[#8BA3B5]" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-[#023047]">{selectedLead.companies.name || selectedLead.companies.domain}</p>
                    <p className="text-[11px] text-[#8BA3B5]">{selectedLead.companies.domain}</p>
                  </div>
                </div>
              )}

              {/* Contact info */}
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-[#8BA3B5]">Email</span><span className="text-[#023047] font-medium">{selectedLead.email}</span></div>
                <div className="flex justify-between"><span className="text-[#8BA3B5]">Role</span><span className="text-[#023047] font-medium">{selectedLead.role || '—'}</span></div>
              </div>

              {/* Current stage */}
              <div>
                <p className="text-[11px] font-semibold text-[#8BA3B5] uppercase tracking-wide mb-2">Current stage</p>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const st = STAGES.find(s => s.id === selectedLead.pipeline_stage);
                    const Icon = st?.icon || Users;
                    return (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: st?.color || '#8BA3B5' }}>
                        <Icon size={13} /> {st?.label || selectedLead.pipeline_stage}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Move to stage */}
              <div>
                <p className="text-[11px] font-semibold text-[#8BA3B5] uppercase tracking-wide mb-2">Move to</p>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.filter(s => s.id !== selectedLead.pipeline_stage).map(stage => {
                    const Icon = stage.icon;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => moveToStage(selectedLead.id, stage.id)}
                        disabled={moving === selectedLead.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border border-[#E8EDF2] bg-white hover:bg-[#f8fafc] transition cursor-pointer text-[#023047]"
                      >
                        {moving === selectedLead.id ? <Loader2 size={10} className="animate-spin" /> : <Icon size={10} style={{ color: stage.color }} />}
                        {stage.label}
                        <ArrowRight size={8} className="text-[#8BA3B5]" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[11px] font-semibold text-[#8BA3B5] uppercase tracking-wide mb-2">Notes</p>
                <textarea
                  value={noteEdit}
                  onChange={e => setNoteEdit(e.target.value)}
                  placeholder="Add notes about this lead..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-xs outline-none resize-y focus:border-[#023047] transition"
                />
                {noteEdit !== (selectedLead.notes || '') && (
                  <button
                    onClick={() => saveNote(selectedLead.id)}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#023047] text-white text-[11px] font-semibold cursor-pointer border-none hover:bg-[#034a6e] transition"
                  >
                    <StickyNote size={11} /> Save note
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
