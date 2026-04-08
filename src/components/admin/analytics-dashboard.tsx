'use client';

import { useEffect, useState, useCallback } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

const FLAG_EMOJI: Record<string, string> = {
  NL: '🇳🇱', US: '🇺🇸', DE: '🇩🇪', SE: '🇸🇪', AT: '🇦🇹', FR: '🇫🇷', PL: '🇵🇱', GB: '🇬🇧', CH: '🇨🇭', RO: '🇷🇴',
  BE: '🇧🇪', ES: '🇪🇸', IT: '🇮🇹', PT: '🇵🇹', CA: '🇨🇦', AU: '🇦🇺', BR: '🇧🇷', IN: '🇮🇳', JP: '🇯🇵', KR: '🇰🇷',
  CN: '🇨🇳', IE: '🇮🇪', DK: '🇩🇰', NO: '🇳🇴', FI: '🇫🇮', CZ: '🇨🇿', HU: '🇭🇺', GR: '🇬🇷', TR: '🇹🇷', RU: '🇷🇺',
};

const DEVICE_ICONS: Record<string, string> = { Desktop: '🖥️', Mobile: '📱', Tablet: '📋', Other: '❓' };
const DOW_LABELS = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDuration(s: number) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m < 60) return `${m}m ${sec}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

const card = (): React.CSSProperties => ({ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #E8EDF2', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' });
const metricValue: React.CSSProperties = { fontSize: 32, fontWeight: 800, color: '#023047', lineHeight: 1.1 };
const metricLabel: React.CSSProperties = { fontSize: 12, color: '#8BA3B5', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' };
const sectionH: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: '#023047', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 };
const barBg: React.CSSProperties = { height: 28, borderRadius: 6, background: '#f4f7fa', position: 'relative', overflow: 'hidden' };
const barFill = (pct: number, color = '#023047'): React.CSSProperties => ({ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: color, borderRadius: 6, opacity: 0.12 });
const barLabel: React.CSSProperties = { position: 'relative', padding: '0 10px', lineHeight: '28px', fontSize: 12, fontWeight: 500, color: '#023047', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const countBadge: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: '#023047', minWidth: 36, textAlign: 'right', flexShrink: 0 };
const thS: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', fontWeight: 600, color: '#4A6B7F', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #E8EDF2' };
const tdS: React.CSSProperties = { padding: '8px 10px', fontSize: 12, color: '#023047', borderBottom: '1px solid #f4f7fa' };
const pillS = (active: boolean): React.CSSProperties => ({
  padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  background: active ? '#023047' : '#f1f5f9', color: active ? '#fff' : '#64748b', fontWeight: 600, fontSize: 12,
});

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [activeSection, setActiveSection] = useState<'overview' | 'content' | 'acquisition' | 'abm' | 'sessions'>('overview');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      if (res.ok) setData(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [days]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60, color: '#8BA3B5' }}>
      <div style={{ fontSize: 32, marginBottom: 12, animation: 'pulse 1.5s infinite' }}>📊</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>Loading analytics...</div>
      <div style={{ fontSize: 12, marginTop: 4 }}>Querying PostHog ({days} days)</div>
    </div>
  );

  if (!data || data.error) return (
    <div style={{ textAlign: 'center', padding: 40, color: '#EF476F' }}>
      <p style={{ fontWeight: 600 }}>{data?.error || 'Failed to load analytics'}</p>
      <p style={{ fontSize: 12, color: '#8BA3B5', marginTop: 8 }}>Add <code>POSTHOG_PERSONAL_API_KEY</code> to Vercel env vars</p>
    </div>
  );

  const o = data.overview;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#023047', margin: 0 }}>📊 Analytics</h2>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setDays(d)} style={pillS(days === d)}>{d}d</button>
          ))}
          <button onClick={fetchData} style={{ ...pillS(false), marginLeft: 4 }}>🔄</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {[
          { v: o.totalPageviews, l: 'Pageviews', icon: '👁️' },
          { v: o.uniqueVisitors, l: 'Visitors', icon: '👤' },
          { v: o.totalSessions, l: 'Sessions', icon: '⚡' },
          { v: `${o.bounceRate}%`, l: 'Bounce Rate', icon: '↩️' },
          { v: o.pagesPerSession, l: 'Pages/Session', icon: '📄' },
          { v: formatDuration(o.avgDuration), l: 'Avg Duration', icon: '⏱️' },
        ].map((m, i) => (
          <div key={i} style={card()}>
            <div style={{ fontSize: 14, marginBottom: 2 }}>{m.icon}</div>
            <div style={metricValue}>{m.v}</div>
            <div style={metricLabel}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {([['overview', '📈 Overview'], ['content', '📄 Content'], ['acquisition', '🔗 Acquisition'], ['abm', '🎯 ABM'], ['sessions', '👤 Sessions']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveSection(key)} style={pillS(activeSection === key)}>{label}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeSection === 'overview' && (<>
        {data.dailyTraffic?.length > 0 && (
          <div style={card()}>
            <h3 style={sectionH}>Traffic over time</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 160, marginBottom: 4 }}>
              {data.dailyTraffic.map((row: any, i: number) => {
                const max = Math.max(...data.dailyTraffic.map((r: any) => r[1]));
                const pvH = max > 0 ? (row[1] / max) * 100 : 0;
                const uvH = max > 0 ? (row[2] / max) * 100 : 0;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', gap: 1, alignItems: 'flex-end', minWidth: 0 }} title={`${row[0]}: ${row[1]} views, ${row[2]} visitors`}>
                    <div style={{ flex: 1, height: `${Math.max(pvH, 3)}%`, background: '#023047', borderRadius: '2px 2px 0 0', opacity: 0.7 }} />
                    <div style={{ flex: 1, height: `${Math.max(uvH, 3)}%`, background: '#EF476F', borderRadius: '2px 2px 0 0', opacity: 0.5 }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9, color: '#8BA3B5' }}>{data.dailyTraffic[0]?.[0]?.slice(5)}</span>
              <span style={{ fontSize: 9, color: '#8BA3B5' }}>{data.dailyTraffic[data.dailyTraffic.length - 1]?.[0]?.slice(5)}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
              <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#023047', opacity: 0.7, display: 'inline-block' }}/> Pageviews</span>
              <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#EF476F', opacity: 0.5, display: 'inline-block' }}/> Visitors</span>
            </div>
          </div>
        )}

        {data.hourlyHeatmap?.length > 0 && (
          <div style={card()}>
            <h3 style={sectionH}>🕐 Activity Heatmap</h3>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(24, 1fr)', gap: 2, minWidth: 500 }}>
                <div/>
                {[...Array(24)].map((_, h) => <div key={h} style={{ fontSize: 8, textAlign: 'center', color: '#8BA3B5' }}>{h}</div>)}
                {[1,2,3,4,5,6,7].map(dow => {
                  const cells = [...Array(24)].map((_, h) => {
                    const match = data.hourlyHeatmap.find((r: any) => r[0] === dow && r[1] === h);
                    const val = match ? match[2] : 0;
                    const maxVal = Math.max(...data.hourlyHeatmap.map((r: any) => r[2]), 1);
                    const intensity = val / maxVal;
                    return <div key={`${dow}-${h}`} title={`${DOW_LABELS[dow]} ${h}:00 — ${val} views`} style={{ aspectRatio: '1', borderRadius: 3, minHeight: 14, background: intensity === 0 ? '#f4f7fa' : `rgba(2, 48, 71, ${0.1 + intensity * 0.8})` }}/>;
                  });
                  return [<div key={`l${dow}`} style={{ fontSize: 10, color: '#8BA3B5', paddingRight: 4, display: 'flex', alignItems: 'center' }}>{DOW_LABELS[dow]}</div>, ...cells];
                })}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          <div style={card()}>
            <h3 style={sectionH}>📱 Devices</h3>
            {data.devices?.map((r: any, i: number) => {
              const total = data.devices.reduce((s: number, d: any) => s + d[1], 0);
              const pct = total > 0 ? ((r[1] / total) * 100).toFixed(0) : '0';
              const colors = ['#023047', '#EF476F', '#A7DADC', '#8BA3B5'];
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{DEVICE_ICONS[r[0]] || '❓'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}><span style={{ fontSize: 12, fontWeight: 600 }}>{r[0]}</span><span style={{ fontSize: 11, color: '#8BA3B5' }}>{pct}% ({r[1]})</span></div>
                  <div style={{ height: 6, borderRadius: 3, background: '#f4f7fa' }}><div style={{ height: '100%', borderRadius: 3, background: colors[i % 4], width: `${pct}%` }}/></div>
                </div>
              </div>);
            })}
          </div>
          <div style={card()}>
            <h3 style={sectionH}>🌐 Browsers</h3>
            {data.browsers?.slice(0, 6).map((r: any, i: number) => {
              const max = data.browsers[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, ...barBg }}><div style={barFill((r[1] / max) * 100)}/><span style={barLabel}>{r[0]}</span></div>
                <span style={countBadge}>{r[1]}</span>
              </div>);
            })}
          </div>
          <div style={card()}>
            <h3 style={sectionH}>💻 Operating Systems</h3>
            {data.os?.slice(0, 6).map((r: any, i: number) => {
              const max = data.os[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, ...barBg }}><div style={barFill((r[1] / max) * 100, '#EF476F')}/><span style={barLabel}>{r[0]}</span></div>
                <span style={countBadge}>{r[1]}</span>
              </div>);
            })}
          </div>
        </div>
      </>)}

      {/* CONTENT */}
      {activeSection === 'content' && (<>
        <div style={card()}>
          <h3 style={sectionH}>🔝 Top Pages</h3>
          {data.topPages?.map((r: any, i: number) => {
            const max = data.topPages[0]?.[1] || 1;
            return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#8BA3B5', minWidth: 18, textAlign: 'right' }}>{i + 1}</span>
              <div style={{ flex: 1, ...barBg }}><div style={barFill((r[1] / max) * 100)}/><span style={barLabel}>{r[0] || '/'}</span></div>
              <span style={countBadge}>{r[1]}</span>
              <span style={{ fontSize: 10, color: '#8BA3B5', minWidth: 36 }}>{r[2]} u</span>
            </div>);
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <div style={card()}>
            <h3 style={sectionH}>🚪 Entry Pages</h3>
            {data.entryPages?.map((r: any, i: number) => {
              const max = data.entryPages[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, ...barBg }}><div style={barFill((r[1] / max) * 100, '#16a34a')}/><span style={barLabel}>{r[0] || '/'}</span></div>
                <span style={countBadge}>{r[1]}</span>
              </div>);
            })}
          </div>
          <div style={card()}>
            <h3 style={sectionH}>🚶 Exit Pages</h3>
            {data.exitPages?.map((r: any, i: number) => {
              const max = data.exitPages[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, ...barBg }}><div style={barFill((r[1] / max) * 100, '#EF476F')}/><span style={barLabel}>{r[0] || '/'}</span></div>
                <span style={countBadge}>{r[1]}</span>
              </div>);
            })}
          </div>
        </div>
        {data.pageFlows?.length > 0 && (
          <div style={card()}>
            <h3 style={sectionH}>🔀 Page Flows</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={thS}>From</th><th style={thS}></th><th style={thS}>To</th><th style={{ ...thS, textAlign: 'right' }}>Count</th></tr></thead>
              <tbody>{data.pageFlows.map((r: any, i: number) => (
                <tr key={i}><td style={tdS}>{r[0] || '/'}</td><td style={{ ...tdS, color: '#8BA3B5' }}>→</td><td style={tdS}>{r[1] || '/'}</td><td style={{ ...tdS, textAlign: 'right', fontWeight: 700 }}>{r[2]}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </>)}

      {/* ACQUISITION */}
      {activeSection === 'acquisition' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <div style={card()}>
            <h3 style={sectionH}>🔗 Referrers</h3>
            {data.referrers?.map((r: any, i: number) => {
              const max = data.referrers[0]?.[1] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, ...barBg }}><div style={barFill((r[1] / max) * 100)}/><span style={barLabel}>{r[0]}</span></div>
                <span style={countBadge}>{r[1]}</span>
              </div>);
            })}
          </div>
          <div style={card()}>
            <h3 style={sectionH}>🌍 Countries</h3>
            {data.countries?.map((r: any, i: number) => {
              const max = data.countries[0]?.[2] || 1;
              return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{FLAG_EMOJI[r[0]] || '🏳️'}</span>
                <div style={{ flex: 1, ...barBg }}><div style={barFill((r[2] / max) * 100, '#6366f1')}/><span style={barLabel}>{r[1] || r[0]}</span></div>
                <span style={countBadge}>{r[2]}</span>
              </div>);
            })}
          </div>
        </div>
        {data.utmSources?.length > 0 && (
          <div style={card()}>
            <h3 style={sectionH}>📢 UTM Campaigns</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={thS}>Source</th><th style={thS}>Medium</th><th style={thS}>Campaign</th><th style={{ ...thS, textAlign: 'right' }}>Visitors</th></tr></thead>
              <tbody>{data.utmSources.map((r: any, i: number) => (
                <tr key={i}><td style={tdS}><span style={{ background: '#023047', color: '#fff', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{r[0]}</span></td><td style={tdS}>{r[1] || '—'}</td><td style={tdS}>{r[2] || '—'}</td><td style={{ ...tdS, textAlign: 'right', fontWeight: 700 }}>{r[3]}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </>)}

      {/* ABM */}
      {activeSection === 'abm' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          <div style={card()}><div style={{ ...metricValue, color: '#EF476F' }}>{data.abmVisitors?.length || 0}</div><div style={metricLabel}>ABM Pageviews</div></div>
          <div style={card()}><div style={metricValue}>{new Set(data.abmVisitors?.map((r: any) => r[0])).size}</div><div style={metricLabel}>Companies</div></div>
          <div style={card()}><div style={metricValue}>{new Set(data.abmVisitors?.map((r: any) => r[1]).filter(Boolean)).size}</div><div style={metricLabel}>Contacts</div></div>
        </div>
        {data.abmVisitors?.length > 0 ? (
          <div style={card()}>
            <h3 style={sectionH}>🎯 ABM Visitor Activity</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><th style={thS}>Company</th><th style={thS}>Contact</th><th style={thS}>Page</th><th style={thS}>🌍</th><th style={thS}>📱</th><th style={thS}>When</th></tr></thead>
                <tbody>{data.abmVisitors.map((r: any, i: number) => (
                  <tr key={i}>
                    <td style={tdS}><span style={{ background: '#EF476F', color: '#fff', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{r[0]}</span></td>
                    <td style={{ ...tdS, fontWeight: 600 }}>{r[1] || '—'}</td>
                    <td style={tdS}>{r[2]?.replace('https://sambajarju.com', '') || '/'}</td>
                    <td style={tdS}>{FLAG_EMOJI[r[4]] || r[4] || '—'}</td>
                    <td style={tdS}>{DEVICE_ICONS[r[5]] || r[5] || '—'}</td>
                    <td style={{ ...tdS, color: '#8BA3B5', whiteSpace: 'nowrap' }}>{r[6] ? new Date(r[6]).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ ...card(), textAlign: 'center', padding: 40, color: '#8BA3B5' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
            <p style={{ fontWeight: 600, margin: '0 0 4px' }}>No ABM visits yet</p>
            <p style={{ fontSize: 12, margin: 0 }}>When outreach recipients visit your landing pages, they appear here</p>
          </div>
        )}
      </>)}

      {/* SESSIONS */}
      {activeSection === 'sessions' && (
        <div style={card()}>
          <h3 style={sectionH}>👤 Recent Sessions (7d)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={thS}>Visitor</th><th style={thS}>Pages</th><th style={thS}>Duration</th><th style={thS}>Entry</th><th style={thS}>Exit</th><th style={thS}>Referrer</th><th style={thS}>🌍</th><th style={thS}>📱</th><th style={thS}>Last seen</th></tr></thead>
              <tbody>{data.recentSessions?.map((r: any, i: number) => {
                const dur = r[2] && r[3] ? Math.round((new Date(r[3]).getTime() - new Date(r[2]).getTime()) / 1000) : 0;
                let ref = '(direct)';
                try { if (r[5]) ref = new URL(r[5]).hostname; } catch { ref = r[5]?.toString().slice(0, 20) || '(direct)'; }
                return (<tr key={i}>
                  <td style={tdS}><span style={{ fontFamily: 'monospace', fontSize: 10, background: '#f4f7fa', padding: '2px 6px', borderRadius: 4 }}>{r[0]?.slice(0, 12)}…</span></td>
                  <td style={{ ...tdS, fontWeight: 700, textAlign: 'center' }}>{r[4]}</td>
                  <td style={tdS}>{formatDuration(dur)}</td>
                  <td style={{ ...tdS, fontSize: 11 }}>{r[9] || '/'}</td>
                  <td style={{ ...tdS, fontSize: 11 }}>{r[10] || '/'}</td>
                  <td style={{ ...tdS, fontSize: 11 }}>{ref}</td>
                  <td style={tdS}>{FLAG_EMOJI[r[6]] || r[6] || '—'}</td>
                  <td style={tdS}>{DEVICE_ICONS[r[8]] || r[8] || '—'}</td>
                  <td style={{ ...tdS, color: '#8BA3B5', whiteSpace: 'nowrap', fontSize: 11 }}>{r[3] ? new Date(r[3]).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 10, color: '#8BA3B5', padding: '8px 0' }}>
        Powered by PostHog · Last {days} days · <button onClick={fetchData} style={{ background: 'none', border: 'none', color: '#023047', cursor: 'pointer', fontWeight: 600, fontSize: 10, fontFamily: 'inherit', textDecoration: 'underline' }}>Refresh</button>
      </div>
    </div>
  );
}
