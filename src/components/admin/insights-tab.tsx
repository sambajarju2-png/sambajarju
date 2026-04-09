'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, Clock, BarChart3, RefreshCw, Loader2, Zap, Building2, ArrowRight,
  Globe, Send, AlertTriangle, Mail
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function InsightsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [ipVisitors, setIpVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<'funnel' | 'timing' | 'companies' | 'visitors' | 'automation'>('funnel');
  const [sendingReengage, setSendingReengage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pipeRes, visRes] = await Promise.all([
        fetch('/api/pipeline'),
        fetch('/api/analytics/abm-visits'),
      ]);
      if (pipeRes.ok) {
        const d = await pipeRes.json();
        setLeads(d.leads || []);
        setCompanies(d.companyScores || []);
      }
      if (visRes.ok) {
        const v = await visRes.json();
        setIpVisitors(v.visits || []);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Stage funnel
  const stages = ['prospect', 'contacted', 'opened', 'clicked', 'visited', 'replied', 'meeting', 'won'];
  const stageCounts = stages.map(s => ({ stage: s, count: leads.filter(l => l.pipeline_stage === s).length }));
  const maxCount = Math.max(...stageCounts.map(s => s.count), 1);

  // Time-to-convert calculations
  const timeMetrics = leads.filter(l => l.first_contacted_at).map(l => {
    const contacted = new Date(l.first_contacted_at).getTime();
    const opened = l.first_opened_at ? new Date(l.first_opened_at).getTime() : null;
    const clicked = l.first_clicked_at ? new Date(l.first_clicked_at).getTime() : null;
    return {
      name: `${l.first_name} ${l.last_name}`,
      company: l.companies?.display_name || l.companies?.name || '',
      contactToOpen: opened ? Math.round((opened - contacted) / 60000) : null,
      openToClick: opened && clicked ? Math.round((clicked - opened) / 60000) : null,
      totalMinutes: clicked ? Math.round((clicked - contacted) / 60000) : null,
    };
  });

  const avgContactToOpen = timeMetrics.filter(t => t.contactToOpen !== null).reduce((s, t) => s + t.contactToOpen!, 0) / Math.max(timeMetrics.filter(t => t.contactToOpen !== null).length, 1);
  const avgOpenToClick = timeMetrics.filter(t => t.openToClick !== null).reduce((s, t) => s + t.openToClick!, 0) / Math.max(timeMetrics.filter(t => t.openToClick !== null).length, 1);

  const formatMinutes = (m: number) => {
    if (m < 60) return `${Math.round(m)}m`;
    if (m < 1440) return `${Math.round(m / 60)}h`;
    return `${Math.round(m / 1440)}d`;
  };

  // Company leaderboard
  const companyLeaderboard = companies
    .filter(c => c.engagement_score > 0)
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 10);

  // IP visitors: group by company, non-ABM only
  const organicVisitors = ipVisitors.filter(v => !v.contact_name);
  const abmVisitors = ipVisitors.filter(v => v.contact_name);
  const organicByCompany: Record<string, { count: number; lastVisit: string; pages: string[] }> = {};
  organicVisitors.forEach(v => {
    if (!v.company) return;
    if (!organicByCompany[v.company]) organicByCompany[v.company] = { count: 0, lastVisit: v.visited_at, pages: [] };
    organicByCompany[v.company].count++;
    if (v.page && !organicByCompany[v.company].pages.includes(v.page)) organicByCompany[v.company].pages.push(v.page);
    if (v.visited_at > organicByCompany[v.company].lastVisit) organicByCompany[v.company].lastVisit = v.visited_at;
  });

  // Ghosted leads for auto re-engagement
  const ghostedLeads = leads.filter(l => {
    const daysSince = (Date.now() - new Date(l.pipeline_updated_at).getTime()) / 86400000;
    return ['clicked', 'visited', 'opened'].includes(l.pipeline_stage) && daysSince > 5;
  });

  // Send window analysis (based on open/click times)
  const openHours: number[] = [];
  leads.forEach(l => {
    if (l.first_opened_at) openHours.push(new Date(l.first_opened_at).getHours());
    if (l.first_clicked_at) openHours.push(new Date(l.first_clicked_at).getHours());
  });
  const hourCounts = Array(24).fill(0);
  openHours.forEach(h => hourCounts[h]++);
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  const bestWindow = openHours.length > 0 ? `${peakHour}:00 - ${(peakHour + 2) % 24}:00` : 'Not enough data';

  // Re-engage function
  const sendReengage = async (lead: any) => {
    setSendingReengage(lead.id);
    try {
      const email = lead.email;
      const company = lead.companies?.domain || '';
      const name = `${lead.first_name} ${lead.last_name}`;
      await fetch('/api/outreach/retarget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, contactName: name, template: 'follow_up' }),
      });
    } catch (e) { console.error(e); }
    setSendingReengage(null);
  };

  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 size={20} className="animate-spin text-[#8BA3B5]" /></div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-tabs */}
      <div className="flex gap-1.5 items-center justify-between flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {[
            { id: 'funnel', label: 'Funnel', icon: BarChart3 },
            { id: 'timing', label: 'Timing', icon: Clock },
            { id: 'companies', label: 'Accounts', icon: Building2 },
            { id: 'visitors', label: 'IP Visitors', icon: Globe },
            { id: 'automation', label: 'Automation', icon: Zap },
          ].map(t => (
            <button key={t.id} onClick={() => setSubTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer border-none transition flex items-center gap-1 ${subTab === t.id ? 'bg-[#023047] text-white' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
              <t.icon size={11} /> {t.label}
            </button>
          ))}
        </div>
        <button onClick={fetchData} className="p-1.5 rounded-lg bg-[#f1f5f9] cursor-pointer border-none hover:bg-[#e8edf2] transition">
          <RefreshCw size={11} className="text-[#64748b]" />
        </button>
      </div>

      {/* Funnel */}
      {subTab === 'funnel' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-3 flex items-center gap-1.5"><TrendingUp size={13} /> Conversion Funnel</h4>
            <div className="flex flex-col gap-1.5">
              {stageCounts.map((s, i) => (
                <div key={s.stage} className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8BA3B5] w-16 text-right capitalize">{s.stage}</span>
                  <div className="flex-1 h-6 bg-[#f4f7fa] rounded-md overflow-hidden relative">
                    <div className="h-full rounded-md transition-all duration-500" style={{
                      width: `${Math.max((s.count / maxCount) * 100, s.count > 0 ? 8 : 0)}%`,
                      background: `hsl(${200 - i * 20}, 70%, ${45 + i * 3}%)`,
                    }} />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#023047]">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
            {leads.filter(l => l.pipeline_stage === 'lost').length > 0 && (
              <p className="text-[10px] text-[#dc2626] mt-2">{leads.filter(l => l.pipeline_stage === 'lost').length} lost</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-3">Stage Conversion Rates</h4>
            <div className="flex flex-col gap-1">
              {stages.slice(0, -1).map((s, i) => {
                const from = stageCounts[i].count;
                const to = stageCounts.slice(i + 1).reduce((sum, sc) => sum + sc.count, 0);
                const rate = from > 0 ? Math.round((to / from) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-2 text-[10px]">
                    <span className="text-[#8BA3B5] w-16 text-right capitalize">{s}</span>
                    <ArrowRight size={10} className="text-[#8BA3B5]" />
                    <span className="text-[#8BA3B5] w-16 capitalize">{stages[i + 1]}</span>
                    <div className="flex-1 h-4 bg-[#f4f7fa] rounded-md overflow-hidden">
                      <div className="h-full bg-[#A7DADC] rounded-md" style={{ width: `${rate}%` }} />
                    </div>
                    <span className="font-bold text-[#023047] w-8 text-right">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Timing */}
      {subTab === 'timing' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-4 text-center">
              <p className="text-[10px] text-[#8BA3B5] uppercase font-semibold">Avg. Send → Open</p>
              <p className="text-xl font-extrabold text-[#023047] mt-1">{formatMinutes(avgContactToOpen)}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-4 text-center">
              <p className="text-[10px] text-[#8BA3B5] uppercase font-semibold">Avg. Open → Click</p>
              <p className="text-xl font-extrabold text-[#023047] mt-1">{formatMinutes(avgOpenToClick)}</p>
            </div>
          </div>

          {/* Best send window */}
          <div className="bg-gradient-to-r from-[#fdf2f8] to-[#fef7ff] rounded-xl border border-[#fce7f3] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-1 flex items-center gap-1.5"><Send size={13} className="text-[#EF476F]" /> Best Send Window</h4>
            <p className="text-lg font-extrabold text-[#023047]">{bestWindow}</p>
            <p className="text-[10px] text-[#4A6B7F]">Based on {openHours.length} open/click events. {openHours.length < 10 ? 'Need more data for accuracy.' : ''}</p>
          </div>

          {/* Hourly heatmap */}
          {openHours.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
              <h4 className="text-xs font-bold text-[#023047] mb-3">Engagement by Hour</h4>
              <div className="flex gap-0.5">
                {hourCounts.map((count, h) => {
                  const maxH = Math.max(...hourCounts, 1);
                  const intensity = count / maxH;
                  return (
                    <div key={h} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-sm" style={{
                        height: 32,
                        background: count > 0 ? `rgba(2, 48, 71, ${0.15 + intensity * 0.85})` : '#f4f7fa',
                      }} />
                      {h % 4 === 0 && <span className="text-[8px] text-[#8BA3B5]">{h}h</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-3 flex items-center gap-1.5"><Clock size={13} /> Time-to-Convert per Lead</h4>
            {timeMetrics.length === 0 ? (
              <p className="text-[11px] text-[#8BA3B5] text-center py-4">No conversion data yet. Send outreach to start tracking.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {timeMetrics.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] py-1 border-b border-[#f4f7fa] last:border-0">
                    <span className="font-semibold text-[#023047] w-24 truncate">{t.name}</span>
                    <span className="text-[#8BA3B5] w-20 truncate">{t.company}</span>
                    <div className="flex-1 flex gap-2">
                      {t.contactToOpen !== null && (
                        <span className="px-1.5 py-0.5 rounded bg-[#E8EDF2] text-[#4A6B7F]">→ Open: {formatMinutes(t.contactToOpen)}</span>
                      )}
                      {t.openToClick !== null && (
                        <span className="px-1.5 py-0.5 rounded bg-[#A7DADC33] text-[#023047]">→ Click: {formatMinutes(t.openToClick)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Company accounts */}
      {subTab === 'companies' && (
        <div className="flex flex-col gap-2">
          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-3 flex items-center gap-1.5"><Building2 size={13} /> Account Leaderboard</h4>
            {companyLeaderboard.length === 0 ? (
              <p className="text-[11px] text-[#8BA3B5] text-center py-4">Run AI scoring to see company rankings.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {companyLeaderboard.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3 py-2 border-b border-[#f4f7fa] last:border-0">
                    <span className={`text-xs font-extrabold w-5 text-right ${i < 3 ? 'text-[#EF476F]' : 'text-[#8BA3B5]'}`}>#{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-[#023047]">{c.display_name || c.name || c.domain}</p>
                      <p className="text-[9px] text-[#8BA3B5]">{c.industry || c.domain}{c.active_contacts > 0 ? ` — ${c.active_contacts} active` : ''}</p>
                    </div>
                    <div className={`text-sm font-extrabold ${c.engagement_score >= 60 ? 'text-[#16a34a]' : c.engagement_score >= 30 ? 'text-[#f59e0b]' : 'text-[#8BA3B5]'}`}>
                      {c.engagement_score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-2 flex items-center gap-1.5"><Zap size={13} /> Enrichment Coverage</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-extrabold text-[#023047]">{companies.length}</p>
                <p className="text-[9px] text-[#8BA3B5]">Total</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-[#16a34a]">{companies.filter(c => c.industry).length}</p>
                <p className="text-[9px] text-[#8BA3B5]">Enriched</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-[#f59e0b]">{companies.filter(c => !c.industry).length}</p>
                <p className="text-[9px] text-[#8BA3B5]">Pending</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IP Visitors */}
      {subTab === 'visitors' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-4 text-center">
              <p className="text-[10px] text-[#8BA3B5] uppercase font-semibold">ABM Visitors</p>
              <p className="text-xl font-extrabold text-[#023047]">{abmVisitors.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-4 text-center">
              <p className="text-[10px] text-[#8BA3B5] uppercase font-semibold">IP-Identified</p>
              <p className="text-xl font-extrabold text-[#06B6D4]">{Object.keys(organicByCompany).length}</p>
            </div>
          </div>

          {/* IP-identified companies */}
          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-3 flex items-center gap-1.5"><Globe size={13} className="text-[#06B6D4]" /> Companies Detected via IPInfo</h4>
            {Object.keys(organicByCompany).length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[11px] text-[#8BA3B5]">No IP-identified visitors yet.</p>
                <p className="text-[10px] text-[#8BA3B5] mt-1">IPInfo identifies companies when visitors browse from corporate networks. Add IPINFO_TOKEN to Vercel env vars to enable.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {Object.entries(organicByCompany)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([company, data]) => (
                    <div key={company} className="flex items-center gap-3 py-2 border-b border-[#f4f7fa] last:border-0">
                      <Globe size={14} className="text-[#06B6D4]" />
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-[#023047]">{company}</p>
                        <p className="text-[9px] text-[#8BA3B5]">{data.count} visit{data.count !== 1 ? 's' : ''} — pages: {data.pages.join(', ') || '/'}</p>
                      </div>
                      <span className="text-[9px] text-[#8BA3B5]">{new Date(data.lastVisit).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* ABM visit log */}
          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-3 flex items-center gap-1.5"><Send size={13} /> ABM Link Visits</h4>
            {abmVisitors.length === 0 ? (
              <p className="text-[11px] text-[#8BA3B5] text-center py-4">No ABM visits recorded yet.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {abmVisitors.slice(0, 20).map((v, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] py-1.5 border-b border-[#f4f7fa] last:border-0">
                    <span className="font-semibold text-[#023047] w-20 truncate">{v.contact_name}</span>
                    <span className="text-[#8BA3B5] w-24 truncate">{v.company}</span>
                    <span className="text-[#4A6B7F] flex-1 truncate">{v.page}</span>
                    <span className="text-[#8BA3B5]">{new Date(v.visited_at).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Automation */}
      {subTab === 'automation' && (
        <div className="flex flex-col gap-3">
          {/* Send window */}
          <div className="bg-gradient-to-r from-[#fdf2f8] to-[#fef7ff] rounded-xl border border-[#fce7f3] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-1 flex items-center gap-1.5"><Send size={13} className="text-[#EF476F]" /> Optimal Send Window</h4>
            <p className="text-lg font-extrabold text-[#023047]">{bestWindow}</p>
            <p className="text-[10px] text-[#4A6B7F]">Based on {openHours.length} engagement events. Schedule your outreach during this window for best results.</p>
          </div>

          {/* Ghosted leads — re-engage */}
          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-3 flex items-center gap-1.5"><AlertTriangle size={13} className="text-[#dc2626]" /> Ghosted Leads ({ghostedLeads.length})</h4>
            {ghostedLeads.length === 0 ? (
              <p className="text-[11px] text-[#8BA3B5] text-center py-4">No ghosted leads. All engaged leads are active.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {ghostedLeads.map(lead => {
                  const daysSince = Math.floor((Date.now() - new Date(lead.pipeline_updated_at).getTime()) / 86400000);
                  const company = lead.companies?.display_name || lead.companies?.name || '';
                  return (
                    <div key={lead.id} className="flex items-center gap-3 py-2 border-b border-[#f4f7fa] last:border-0">
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-[#023047]">{lead.first_name} {lead.last_name}</p>
                        <p className="text-[9px] text-[#8BA3B5]">{company} — was {lead.pipeline_stage}, silent {daysSince}d</p>
                      </div>
                      <button
                        onClick={() => sendReengage(lead)}
                        disabled={sendingReengage === lead.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EF476F] text-white text-[10px] font-semibold cursor-pointer border-none hover:bg-[#d93a5e] transition disabled:opacity-50"
                      >
                        {sendingReengage === lead.id ? <Loader2 size={10} className="animate-spin" /> : <Mail size={10} />}
                        Re-engage
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity log summary */}
          <div className="bg-white rounded-xl border border-[#E8EDF2] p-4">
            <h4 className="text-xs font-bold text-[#023047] mb-2 flex items-center gap-1.5"><Zap size={13} /> Automation Summary</h4>
            <div className="text-[11px] text-[#4A6B7F] space-y-1.5">
              <p>• <strong>IP Identification</strong>: {Object.keys(organicByCompany).length > 0 ? `${Object.keys(organicByCompany).length} companies detected` : 'Active (waiting for corporate visitors)'}</p>
              <p>• <strong>Ghosting Detection</strong>: {ghostedLeads.length > 0 ? `${ghostedLeads.length} leads need re-engagement` : 'No ghosted leads'}</p>
              <p>• <strong>Send Window</strong>: {bestWindow}</p>
              <p>• <strong>Activity Logging</strong>: Stage changes tracked to lead_activity table</p>
              <p>• <strong>ABM Tracking</strong>: {abmVisitors.length} tracked visits via personalized links</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
