'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Eye, Users, Zap, CornerDownLeft, FileText, Clock,
  BarChart3, Layers, Link2, Target, UserCircle,
  RefreshCw, Monitor, Smartphone, Tablet, Globe,
  ArrowRight, Send, CheckCircle, AlertCircle, Loader2,
  TrendingUp, MousePointerClick, LogIn, LogOut, Shuffle, Megaphone
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

const FLAGS: Record<string, string> = {
  NL: '🇳🇱', US: '🇺🇸', DE: '🇩🇪', SE: '🇸🇪', AT: '🇦🇹', FR: '🇫🇷', PL: '🇵🇱', GB: '🇬🇧', CH: '🇨🇭', RO: '🇷🇴',
  BE: '🇧🇪', ES: '🇪🇸', IT: '🇮🇹', PT: '🇵🇹', CA: '🇨🇦', AU: '🇦🇺', BR: '🇧🇷', IN: '🇮🇳', JP: '🇯🇵', KR: '🇰🇷',
  CN: '🇨🇳', IE: '🇮🇪', DK: '🇩🇰', NO: '🇳🇴', FI: '🇫🇮', CZ: '🇨🇿', HU: '🇭🇺', GR: '🇬🇷', TR: '🇹🇷', RU: '🇷🇺',
};

const DOW = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function fmtDur(s: number) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ${s % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

function DeviceIcon({ type, size = 14 }: { type: string; size?: number }) {
  if (type === 'Mobile') return <Smartphone size={size} />;
  if (type === 'Tablet') return <Tablet size={size} />;
  return <Monitor size={size} />;
}

// Skeleton
function Skeleton({ h = 20, w = '100%' }: { h?: number; w?: string | number }) {
  return <div style={{ height: h, width: w, borderRadius: 8, background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />;
}

// Styles
const C: React.CSSProperties = { padding: 20, borderRadius: 14, background: '#fff', border: '1px solid #E8EDF2' };
const MV: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: '#023047', lineHeight: 1.1 };
const ML: React.CSSProperties = { fontSize: 11, color: '#8BA3B5', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' };
const SH: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: '#023047', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 };
const BB: React.CSSProperties = { height: 26, borderRadius: 6, background: '#f4f7fa', position: 'relative', overflow: 'hidden' };
const BF = (pct: number, c = '#023047'): React.CSSProperties => ({ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: c, borderRadius: 6, opacity: 0.12 });
const BL: React.CSSProperties = { position: 'relative', padding: '0 10px', lineHeight: '26px', fontSize: 12, fontWeight: 500, color: '#023047', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const CB: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: '#023047', minWidth: 32, textAlign: 'right' };
const TH: React.CSSProperties = { textAlign: 'left', padding: '7px 10px', fontWeight: 600, color: '#4A6B7F', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E8EDF2' };
const TD: React.CSSProperties = { padding: '7px 10px', fontSize: 12, color: '#023047', borderBottom: '1px solid #f4f7fa' };
const P = (a: boolean): React.CSSProperties => ({
  padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5,
  background: a ? '#023047' : '#f1f5f9', color: a ? '#fff' : '#64748b', fontWeight: 600, fontSize: 12, transition: 'all 0.15s',
});

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [section, setSection] = useState<'overview' | 'content' | 'acquisition' | 'abm' | 'sessions'>('overview');
  const [retargeting, setRetargeting] = useState<Record<string, 'sending' | 'sent' | 'error'>>({});
  const [abmSupabase, setAbmSupabase] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [phRes, abmRes] = await Promise.all([
        fetch(`/api/analytics?days=${days}`),
        fetch('/api/analytics/abm-visits'),
      ]);
      if (phRes.ok) setData(await phRes.json());
      if (abmRes.ok) { const j = await abmRes.json(); setAbmSupabase(j.visits || []); }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [days]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRetarget = async (visit: any) => {
    const key = visit.id || `${visit.company}_${visit.contact_name}`;
    setRetargeting(p => ({ ...p, [key]: 'sending' }));
    try {
      const res = await fetch('/api/outreach/retarget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId: visit.id,
          email: visit.contact_email,
          company: visit.company,
          contactName: visit.contact_name,
          template: 'follow_up',
        }),
      });
      setRetargeting(p => ({ ...p, [key]: res.ok ? 'sent' : 'error' }));
    } catch { setRetargeting(p => ({ ...p, [key]: 'error' })); }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {[...Array(6)].map((_, i) => <div key={i} style={C}><Skeleton h={32} w={80} /><div style={{ marginTop: 8 }}><Skeleton h={12} w={60} /></div></div>)}
      </div>
      <div style={C}><Skeleton h={160} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><div style={C}><Skeleton h={120} /></div><div style={C}><Skeleton h={120} /></div></div>
    </div>
  );

  if (!data || data.error) return (
    <div style={{ ...C, textAlign: 'center', padding: 40 }}>
      <AlertCircle size={32} color="#EF476F" style={{ margin: '0 auto 12px' }} />
      <p style={{ fontWeight: 600, color: '#EF476F' }}>{data?.error || 'Failed to load analytics'}</p>
      <p style={{ fontSize: 12, color: '#8BA3B5', marginTop: 4 }}>Add <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>POSTHOG_PERSONAL_API_KEY</code> to Vercel</p>
    </div>
  );

  const o = data.overview;

  const kpis = [
    { v: o.totalPageviews, l: 'Pageviews', icon: Eye, color: '#023047' },
    { v: o.uniqueVisitors, l: 'Visitors', icon: Users, color: '#023047' },
    { v: o.totalSessions, l: 'Sessions', icon: Zap, color: '#023047' },
    { v: `${o.bounceRate}%`, l: 'Bounce Rate', icon: CornerDownLeft, color: o.bounceRate > 70 ? '#EF476F' : '#023047' },
    { v: o.pagesPerSession, l: 'Pages/Session', icon: FileText, color: '#023047' },
    { v: fmtDur(o.avgDuration), l: 'Avg Duration', icon: Clock, color: '#023047' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={20} color="#023047" />
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#023047', margin: 0 }}>Analytics</h2>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[7, 14, 30].map(d => <button key={d} onClick={() => setDays(d)} style={P(days === d)}>{d}d</button>)}
          <button onClick={fetchData} style={{ ...P(false), marginLeft: 4 }}><RefreshCw size={12} /></button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {kpis.map((m, i) => (
          <div key={i} style={C}>
            <m.icon size={16} color="#8BA3B5" style={{ marginBottom: 4 }} />
            <div style={{ ...MV, color: m.color }}>{m.v}</div>
            <div style={ML}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {([
          ['overview', TrendingUp, 'Overview'],
          ['content', Layers, 'Content'],
          ['acquisition', Link2, 'Acquisition'],
          ['abm', Target, 'ABM'],
          ['sessions', UserCircle, 'Sessions'],
        ] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setSection(key)} style={P(section === key)}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {section === 'overview' && (<>
        {data.dailyTraffic?.length > 0 && (
          <div style={C}>
            <h3 style={SH}><TrendingUp size={15} /> Traffic</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 150 }}>
              {data.dailyTraffic.map((r: any, i: number) => {
                const max = Math.max(...data.dailyTraffic.map((d: any) => d[1]), 1);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', gap: 1, alignItems: 'flex-end', minWidth: 0 }} title={`${r[0]}: ${r[1]} views, ${r[2]} visitors`}>
                    <div style={{ flex: 1, height: `${Math.max((r[1] / max) * 100, 3)}%`, background: '#023047', borderRadius: '2px 2px 0 0', opacity: 0.65, transition: 'height 0.3s' }} />
                    <div style={{ flex: 1, height: `${Math.max((r[2] / max) * 100, 3)}%`, background: '#EF476F', borderRadius: '2px 2px 0 0', opacity: 0.45, transition: 'height 0.3s' }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 9, color: '#8BA3B5' }}>{data.dailyTraffic[0]?.[0]?.slice(5)}</span>
              <span style={{ fontSize: 9, color: '#8BA3B5' }}>{data.dailyTraffic[data.dailyTraffic.length - 1]?.[0]?.slice(5)}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'center' }}>
              <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#023047', opacity: 0.65, display: 'inline-block' }} /> Pageviews</span>
              <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#EF476F', opacity: 0.45, display: 'inline-block' }} /> Visitors</span>
            </div>
          </div>
        )}

        {data.hourlyHeatmap?.length > 0 && (
          <div style={C}>
            <h3 style={SH}><Clock size={15} /> Activity Heatmap</h3>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(24, 1fr)', gap: 2, minWidth: 480 }}>
                <div />
                {[...Array(24)].map((_, h) => <div key={h} style={{ fontSize: 8, textAlign: 'center', color: '#8BA3B5' }}>{h}</div>)}
                {[1,2,3,4,5,6,7].map(dow => {
                  const cells = [...Array(24)].map((_, h) => {
                    const m = data.hourlyHeatmap.find((r: any) => r[0] === dow && r[1] === h);
                    const v = m ? m[2] : 0;
                    const mx = Math.max(...data.hourlyHeatmap.map((r: any) => r[2]), 1);
                    return <div key={`${dow}-${h}`} title={`${DOW[dow]} ${h}:00 — ${v}`} style={{ aspectRatio: '1', borderRadius: 3, minHeight: 12, background: v === 0 ? '#f4f7fa' : `rgba(2,48,71,${0.08 + (v / mx) * 0.82})`, transition: 'background 0.2s' }} />;
                  });
                  return [<div key={`l${dow}`} style={{ fontSize: 9, color: '#8BA3B5', display: 'flex', alignItems: 'center', paddingRight: 3 }}>{DOW[dow]}</div>, ...cells];
                })}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          <div style={C}>
            <h3 style={SH}><Smartphone size={15} /> Devices</h3>
            {data.devices?.map((r: any, i: number) => {
              const tot = data.devices.reduce((s: number, d: any) => s + d[1], 0) || 1;
              const pct = ((r[1] / tot) * 100).toFixed(0);
              const cols = ['#023047', '#EF476F', '#A7DADC'];
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <DeviceIcon type={r[0]} size={18} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><span style={{ fontSize: 12, fontWeight: 600 }}>{r[0]}</span><span style={{ fontSize: 11, color: '#8BA3B5' }}>{pct}%</span></div>
                  <div style={{ height: 5, borderRadius: 3, background: '#f4f7fa' }}><div style={{ height: '100%', borderRadius: 3, background: cols[i % 3], width: `${pct}%`, transition: 'width 0.4s' }} /></div>
                </div>
              </div>);
            })}
          </div>
          <div style={C}>
            <h3 style={SH}><Globe size={15} /> Browsers</h3>
            {data.browsers?.slice(0, 6).map((r: any, i: number) => {
              const mx = data.browsers[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ flex: 1, ...BB }}><div style={BF((r[1] / mx) * 100)} /><span style={BL}>{r[0]}</span></div>
                <span style={CB}>{r[1]}</span>
              </div>);
            })}
          </div>
          <div style={C}>
            <h3 style={SH}><Monitor size={15} /> OS</h3>
            {data.os?.slice(0, 6).map((r: any, i: number) => {
              const mx = data.os[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ flex: 1, ...BB }}><div style={BF((r[1] / mx) * 100, '#EF476F')} /><span style={BL}>{r[0]}</span></div>
                <span style={CB}>{r[1]}</span>
              </div>);
            })}
          </div>
        </div>
      </>)}

      {/* CONTENT */}
      {section === 'content' && (<>
        <div style={C}>
          <h3 style={SH}><MousePointerClick size={15} /> Top Pages</h3>
          {data.topPages?.map((r: any, i: number) => {
            const mx = data.topPages[0]?.[1] || 1;
            return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: '#8BA3B5', minWidth: 16, textAlign: 'right' }}>{i + 1}</span>
              <div style={{ flex: 1, ...BB }}><div style={BF((r[1] / mx) * 100)} /><span style={BL}>{r[0] || '/'}</span></div>
              <span style={CB}>{r[1]}</span>
              <span style={{ fontSize: 10, color: '#8BA3B5', minWidth: 30 }}>{r[2]}u</span>
            </div>);
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          <div style={C}>
            <h3 style={SH}><LogIn size={15} /> Entry Pages</h3>
            {data.entryPages?.map((r: any, i: number) => {
              const mx = data.entryPages[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ flex: 1, ...BB }}><div style={BF((r[1] / mx) * 100, '#16a34a')} /><span style={BL}>{r[0] || '/'}</span></div>
                <span style={CB}>{r[1]}</span>
              </div>);
            })}
          </div>
          <div style={C}>
            <h3 style={SH}><LogOut size={15} /> Exit Pages</h3>
            {data.exitPages?.map((r: any, i: number) => {
              const mx = data.exitPages[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ flex: 1, ...BB }}><div style={BF((r[1] / mx) * 100, '#EF476F')} /><span style={BL}>{r[0] || '/'}</span></div>
                <span style={CB}>{r[1]}</span>
              </div>);
            })}
          </div>
        </div>
        {data.pageFlows?.length > 0 && (
          <div style={C}>
            <h3 style={SH}><Shuffle size={15} /> Page Flows</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={TH}>From</th><th style={TH}></th><th style={TH}>To</th><th style={{ ...TH, textAlign: 'right' }}>Count</th></tr></thead>
              <tbody>{data.pageFlows.map((r: any, i: number) => (
                <tr key={i}><td style={TD}>{r[0] || '/'}</td><td style={TD}><ArrowRight size={12} color="#8BA3B5" /></td><td style={TD}>{r[1] || '/'}</td><td style={{ ...TD, textAlign: 'right', fontWeight: 700 }}>{r[2]}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </>)}

      {/* ACQUISITION */}
      {section === 'acquisition' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          <div style={C}>
            <h3 style={SH}><Link2 size={15} /> Referrers</h3>
            {data.referrers?.map((r: any, i: number) => {
              const mx = data.referrers[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ flex: 1, ...BB }}><div style={BF((r[1] / mx) * 100)} /><span style={BL}>{r[0]}</span></div>
                <span style={CB}>{r[1]}</span>
              </div>);
            })}
          </div>
          <div style={C}>
            <h3 style={SH}><Globe size={15} /> Countries</h3>
            {data.countries?.map((r: any, i: number) => {
              const mx = data.countries[0]?.[2] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 14 }}>{FLAGS[r[0]] || '—'}</span>
                <div style={{ flex: 1, ...BB }}><div style={BF((r[2] / mx) * 100, '#6366f1')} /><span style={BL}>{r[1] || r[0]}</span></div>
                <span style={CB}>{r[2]}</span>
              </div>);
            })}
          </div>
        </div>
        {data.utmSources?.length > 0 && (
          <div style={C}>
            <h3 style={SH}><Megaphone size={15} /> UTM Campaigns</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={TH}>Source</th><th style={TH}>Medium</th><th style={TH}>Campaign</th><th style={{ ...TH, textAlign: 'right' }}>Visitors</th></tr></thead>
              <tbody>{data.utmSources.map((r: any, i: number) => (
                <tr key={i}><td style={TD}><span style={{ background: '#023047', color: '#fff', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{r[0]}</span></td><td style={TD}>{r[1] || '—'}</td><td style={TD}>{r[2] || '—'}</td><td style={{ ...TD, textAlign: 'right', fontWeight: 700 }}>{r[3]}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </>)}

      {/* ABM */}
      {section === 'abm' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          <div style={C}><Target size={16} color="#8BA3B5" /><div style={{ ...MV, color: '#EF476F', marginTop: 4 }}>{data.abmVisitors?.length || 0}</div><div style={ML}>ABM Pageviews</div></div>
          <div style={C}><Users size={16} color="#8BA3B5" /><div style={{ ...MV, marginTop: 4 }}>{new Set(data.abmVisitors?.map((r: any) => r[0])).size}</div><div style={ML}>Companies</div></div>
          <div style={C}><UserCircle size={16} color="#8BA3B5" /><div style={{ ...MV, marginTop: 4 }}>{new Set(data.abmVisitors?.map((r: any) => r[1]).filter(Boolean)).size}</div><div style={ML}>Contacts</div></div>
          <div style={C}><Send size={16} color="#8BA3B5" /><div style={{ ...MV, marginTop: 4 }}>{abmSupabase.filter(v => v.retarget_status === 'sent').length}</div><div style={ML}>Retargeted</div></div>
        </div>

        {/* Supabase ABM visits with retarget */}
        {abmSupabase.length > 0 ? (
          <div style={C}>
            <h3 style={SH}><Target size={15} /> ABM Visitors — Retarget</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><th style={TH}>Company</th><th style={TH}>Contact</th><th style={TH}>Page</th><th style={TH}>When</th><th style={TH}>Action</th></tr></thead>
                <tbody>{abmSupabase.map((v: any) => {
                  const key = v.id;
                  const status = retargeting[key] || v.retarget_status;
                  return (
                    <tr key={v.id}>
                      <td style={TD}><span style={{ background: '#EF476F', color: '#fff', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{v.company}</span></td>
                      <td style={{ ...TD, fontWeight: 600 }}>{v.contact_name || '—'}</td>
                      <td style={{ ...TD, fontSize: 11 }}>{v.page || '/'}</td>
                      <td style={{ ...TD, color: '#8BA3B5', fontSize: 11, whiteSpace: 'nowrap' }}>{v.visited_at ? new Date(v.visited_at).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</td>
                      <td style={TD}>
                        {status === 'sent' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#16a34a', fontSize: 11, fontWeight: 600 }}><CheckCircle size={13} /> Sent</span>
                        ) : status === 'sending' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#8BA3B5', fontSize: 11 }}><Loader2 size={13} className="animate-spin" /> Sending...</span>
                        ) : status === 'error' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#EF476F', fontSize: 11 }}><AlertCircle size={13} /> Failed</span>
                        ) : v.contact_email ? (
                          <button onClick={() => handleRetarget(v)} style={{ ...P(false), fontSize: 11, padding: '4px 10px', background: '#023047', color: '#fff' }}><Send size={11} /> Retarget</button>
                        ) : (
                          <span style={{ fontSize: 10, color: '#8BA3B5' }}>No email</span>
                        )}
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        ) : data.abmVisitors?.length > 0 ? (
          <div style={C}>
            <h3 style={SH}><Target size={15} /> ABM Activity (PostHog)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><th style={TH}>Company</th><th style={TH}>Contact</th><th style={TH}>Page</th><th style={TH}>When</th></tr></thead>
                <tbody>{data.abmVisitors.map((r: any, i: number) => (
                  <tr key={i}>
                    <td style={TD}><span style={{ background: '#EF476F', color: '#fff', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{r[0]}</span></td>
                    <td style={{ ...TD, fontWeight: 600 }}>{r[1] || '—'}</td>
                    <td style={TD}>{r[2]?.replace('https://sambajarju.com', '') || '/'}</td>
                    <td style={{ ...TD, color: '#8BA3B5', fontSize: 11, whiteSpace: 'nowrap' }}>{r[6] ? new Date(r[6]).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ ...C, textAlign: 'center', padding: 40, color: '#8BA3B5' }}>
            <Target size={32} style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: 600, margin: '0 0 4px' }}>No ABM visits yet</p>
            <p style={{ fontSize: 12, margin: 0 }}>When outreach recipients visit your site, they appear here with retarget options</p>
          </div>
        )}
      </>)}

      {/* SESSIONS */}
      {section === 'sessions' && (
        <div style={C}>
          <h3 style={SH}><UserCircle size={15} /> Recent Sessions (7d)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={TH}>Visitor</th><th style={TH}>Pages</th><th style={TH}>Duration</th><th style={TH}>Entry</th><th style={TH}>Exit</th><th style={TH}>Referrer</th><th style={TH}>Country</th><th style={TH}>Device</th><th style={TH}>Last seen</th></tr></thead>
              <tbody>{data.recentSessions?.map((r: any, i: number) => {
                const dur = r[2] && r[3] ? Math.round((new Date(r[3]).getTime() - new Date(r[2]).getTime()) / 1000) : 0;
                let ref = '(direct)';
                try { if (r[5]) ref = new URL(r[5]).hostname; } catch { ref = r[5]?.toString().slice(0, 20) || '(direct)'; }
                return (<tr key={i}>
                  <td style={TD}><span style={{ fontFamily: 'monospace', fontSize: 10, background: '#f4f7fa', padding: '2px 6px', borderRadius: 4 }}>{r[0]?.slice(0, 12)}</span></td>
                  <td style={{ ...TD, fontWeight: 700, textAlign: 'center' }}>{r[4]}</td>
                  <td style={TD}>{fmtDur(dur)}</td>
                  <td style={{ ...TD, fontSize: 11 }}>{r[9] || '/'}</td>
                  <td style={{ ...TD, fontSize: 11 }}>{r[10] || '/'}</td>
                  <td style={{ ...TD, fontSize: 11 }}>{ref}</td>
                  <td style={TD}>{FLAGS[r[6]] || r[6] || '—'}</td>
                  <td style={TD}><DeviceIcon type={r[8]} /></td>
                  <td style={{ ...TD, color: '#8BA3B5', whiteSpace: 'nowrap', fontSize: 11 }}>{r[3] ? new Date(r[3]).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 10, color: '#8BA3B5', padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <span>PostHog</span><span>·</span><span>Last {days} days</span><span>·</span>
        <button onClick={fetchData} style={{ background: 'none', border: 'none', color: '#023047', cursor: 'pointer', fontWeight: 600, fontSize: 10, fontFamily: 'inherit', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 3 }}><RefreshCw size={9} /> Refresh</button>
      </div>
    </div>
  );
}
