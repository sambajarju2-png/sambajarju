'use client';

import { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = Record<string, any>;

const COUNTRY_FLAGS: Record<string, string> = { NL: '🇳🇱', US: '🇺🇸', DE: '🇩🇪', SE: '🇸🇪', AT: '🇦🇹', FR: '🇫🇷', PL: '🇵🇱', GB: '🇬🇧', CH: '🇨🇭', RO: '🇷🇴', BE: '🇧🇪', ES: '🇪🇸', IT: '🇮🇹', CA: '🇨🇦', AU: '🇦🇺', IE: '🇮🇪', IN: '🇮🇳', BR: '🇧🇷', JP: '🇯🇵', KR: '🇰🇷', DK: '🇩🇰', FI: '🇫🇮', NO: '🇳🇴', PT: '🇵🇹', CZ: '🇨🇿', GR: '🇬🇷', HU: '🇭🇺', TR: '🇹🇷', ZA: '🇿🇦', MX: '🇲🇽', SG: '🇸🇬', HK: '🇭🇰', IL: '🇮🇱', AE: '🇦🇪', RU: '🇷🇺', UA: '🇺🇦', CN: '🇨🇳', GM: '🇬🇲' };

const DEVICE_ICONS: Record<string, string> = { Desktop: '🖥️', Mobile: '📱', Tablet: '📱', Other: '❓' };

export function AnalyticsDashboard() {
  const [data, setData] = useState<D | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'content' | 'acquisition' | 'behavior' | 'abm'>('overview');
  const [days, setDays] = useState(30);

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 12 }}>
      <div style={{ width: 20, height: 20, border: '3px solid #E2E8F0', borderTopColor: '#023047', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ color: '#8BA3B5', fontSize: 14, fontWeight: 500 }}>Loading analytics...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (data?.error) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <p style={{ color: '#EF476F', fontWeight: 600, fontSize: 15 }}>{data.error}</p>
      <p style={{ color: '#8BA3B5', fontSize: 13 }}>Add <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>POSTHOG_PERSONAL_API_KEY</code> to your Vercel environment variables.</p>
    </div>
  );

  if (!data) return null;
  const o = data.overview || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
        <MetricCard icon="👁️" value={o.totalPageviews} label="Weergaven" />
        <MetricCard icon="👥" value={o.uniqueVisitors} label="Bezoekers" />
        <MetricCard icon="⚡" value={o.totalSessions} label="Sessies" />
        <MetricCard icon="📄" value={o.pagesPerSession} label="Pagina's/sessie" />
        <MetricCard icon="🎯" value={data.abmVisitors?.length || 0} label="ABM visits" accent />
      </div>

      {/* Period selector + refresh */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {[7, 14, 30, 90].map(d => (
          <button key={d} onClick={() => setDays(d)} style={periodBtn(days === d)}>{d}d</button>
        ))}
        <button onClick={fetchData} style={{ ...periodBtn(false), marginLeft: 'auto' }}>🔄 Vernieuwen</button>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, gap: 2 }}>
        {([
          ['overview', '📊', 'Overzicht'],
          ['content', '📄', 'Content'],
          ['acquisition', '🔗', 'Acquisitie'],
          ['behavior', '🧭', 'Gedrag'],
          ['abm', '🎯', 'ABM'],
        ] as const).map(([id, icon, label]) => (
          <button key={id} onClick={() => setTab(id as typeof tab)} style={tabBtn(tab === id)}>
            {icon} {label}
          </button>
        ))}
      </div>

      {/* TAB: Overview */}
      {tab === 'overview' && (
        <>
          {/* Traffic chart */}
          {data.dailyPageviews?.length > 0 && (
            <Card title="Verkeer over tijd">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 160, padding: '0 4px' }}>
                  {data.dailyPageviews.map((row: [string, number, number], i: number) => {
                    const max = Math.max(...data.dailyPageviews.map((r: [string, number]) => r[1]));
                    const h = max > 0 ? (row[1] / max) * 100 : 0;
                    const date = new Date(row[0]).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 9, color: '#8BA3B5', fontWeight: 600 }}>{row[1]}</span>
                        <div title={`${date}: ${row[1]} views, ${row[2]} visitors`}
                          style={{ width: '100%', maxWidth: 32, background: 'linear-gradient(180deg, #023047, #0a5c80)', borderRadius: '4px 4px 0 0', height: `${Math.max(h, 4)}%`, minHeight: 3, transition: 'height 0.3s ease', cursor: 'pointer', opacity: 0.85 }}
                          onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '1'; }}
                          onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '0.85'; }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
                  <span style={dateLabel}>{fmtDate(data.dailyPageviews[0]?.[0])}</span>
                  <span style={dateLabel}>{fmtDate(data.dailyPageviews[data.dailyPageviews.length - 1]?.[0])}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Top pages + referrers side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            <Card title="Top pagina's">
              <BarList items={data.topPages?.slice(0, 10).map((r: [string, number, number]) => ({ label: r[0] || '/', value: r[1], sub: `${r[2]} uniek` }))} />
            </Card>
            <Card title="Referrers">
              <BarList items={data.referrers?.slice(0, 10).map((r: [string, number]) => ({ label: r[0] || 'Direct', value: r[1] }))} color="#0a5c80" />
            </Card>
          </div>

          {/* Countries + Devices */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            <Card title="Landen">
              <BarList items={data.countries?.slice(0, 10).map((r: [string, number]) => ({ label: `${COUNTRY_FLAGS[r[0]] || '🌍'} ${r[0]}`, value: r[1] }))} color="#A7DADC" />
            </Card>
            <Card title="Apparaten">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {data.devices?.map((r: [string, number], i: number) => {
                  const total = data.devices.reduce((s: number, d: [string, number]) => s + d[1], 0);
                  const pct = total > 0 ? ((r[1] / total) * 100).toFixed(0) : '0';
                  return (
                    <div key={i} style={{ flex: '1 1 100px', padding: 16, borderRadius: 12, background: '#f8fafc', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 28 }}>{DEVICE_ICONS[r[0]] || '❓'}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#023047', marginTop: 4 }}>{pct}%</div>
                      <div style={{ fontSize: 11, color: '#8BA3B5', fontWeight: 600 }}>{r[0]} ({r[1]})</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* TAB: Content */}
      {tab === 'content' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            <Card title="📥 Entry pagina's">
              <BarList items={data.entryPages?.slice(0, 12).map((r: [string, number]) => ({ label: r[0] || '/', value: r[1], sub: 'sessies' }))} color="#023047" />
            </Card>
            <Card title="📤 Exit pagina's">
              <BarList items={data.exitPages?.slice(0, 12).map((r: [string, number]) => ({ label: r[0] || '/', value: r[1], sub: 'sessies' }))} color="#EF476F" />
            </Card>
          </div>
          <Card title="📄 Alle pagina's">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={th}>#</th>
                  <th style={{ ...th, textAlign: 'left' }}>Pagina</th>
                  <th style={th}>Views</th>
                  <th style={th}>Uniek</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages?.map((r: [string, number, number], i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...td, color: '#8BA3B5', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{r[0] || '/'}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{r[1]}</td>
                    <td style={{ ...td, textAlign: 'center', color: '#8BA3B5' }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {/* TAB: Acquisition */}
      {tab === 'acquisition' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            <Card title="🔗 Referrers">
              <BarList items={data.referrers?.map((r: [string, number]) => ({ label: r[0] || 'Direct', value: r[1] }))} color="#023047" />
            </Card>
            <Card title="🌍 Landen">
              <BarList items={data.countries?.map((r: [string, number]) => ({ label: `${COUNTRY_FLAGS[r[0]] || '🌍'} ${r[0]}`, value: r[1] }))} color="#A7DADC" />
            </Card>
          </div>
          {data.utmCampaigns?.length > 0 && (
            <Card title="📢 UTM Campagnes">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ ...th, textAlign: 'left' }}>Source</th>
                    <th style={{ ...th, textAlign: 'left' }}>Medium</th>
                    <th style={{ ...th, textAlign: 'left' }}>Campaign</th>
                    <th style={th}>Sessies</th>
                  </tr>
                </thead>
                <tbody>
                  {data.utmCampaigns.map((r: [string, string, string, number], i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={td}>{r[0] || '—'}</td>
                      <td style={td}>{r[1] || '—'}</td>
                      <td style={td}>{r[2] || '—'}</td>
                      <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      {/* TAB: Behavior */}
      {tab === 'behavior' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            <Card title="🌐 Browsers">
              <BarList items={data.browsers?.map((r: [string, number]) => ({ label: r[0], value: r[1] }))} color="#0a5c80" />
            </Card>
            <Card title="💻 Operating Systems">
              <BarList items={data.os?.map((r: [string, number]) => ({ label: r[0], value: r[1] }))} color="#023047" />
            </Card>
          </div>
          {data.clickEvents?.length > 0 && (
            <Card title="🖱️ CTA & Click Events">
              <BarList items={data.clickEvents?.slice(0, 15).map((r: [string, number]) => ({ label: r[0], value: r[1] }))} color="#EF476F" />
            </Card>
          )}
          <Card title="👤 Recente sessies (7d)">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ ...th, textAlign: 'left' }}>Bezoeker</th>
                    <th style={th}>Paginas</th>
                    <th style={{ ...th, textAlign: 'left' }}>Locatie</th>
                    <th style={{ ...th, textAlign: 'left' }}>Device</th>
                    <th style={{ ...th, textAlign: 'left' }}>Laatst gezien</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSessions?.slice(0, 30).map((r: string[], i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={td}>
                        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#8BA3B5' }}>{r[0]?.slice(0, 12)}...</span>
                      </td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        <span style={{ background: '#023047', color: '#fff', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{r[3]}</span>
                      </td>
                      <td style={td}>{COUNTRY_FLAGS[r[7]] || ''} {r[8] || r[7] || '—'}</td>
                      <td style={td}>{r[5] || '—'} / {r[6] || '—'}</td>
                      <td style={{ ...td, color: '#8BA3B5' }}>{r[2] ? new Date(r[2]).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* TAB: ABM */}
      {tab === 'abm' && (
        <>
          <MetricCard icon="🎯" value={data.abmVisitors?.length || 0} label={`ABM bezoeken (${days}d)`} accent />
          {data.abmVisitors?.length > 0 ? (
            <Card title="🎯 ABM Bezoekers — Geïdentificeerde bedrijven">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ ...th, textAlign: 'left' }}>Bedrijf</th>
                      <th style={{ ...th, textAlign: 'left' }}>Contact</th>
                      <th style={{ ...th, textAlign: 'left' }}>Pagina</th>
                      <th style={{ ...th, textAlign: 'left' }}>Referrer</th>
                      <th style={{ ...th, textAlign: 'left' }}>Wanneer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.abmVisitors.map((r: [string, string, string, string, string], i: number) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={td}>
                          <span style={{ background: '#EF476F', color: '#fff', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                            {r[0]}
                          </span>
                        </td>
                        <td style={{ ...td, fontWeight: 500 }}>{r[1] || '—'}</td>
                        <td style={td}>{r[2] || '/'}</td>
                        <td style={{ ...td, fontSize: 11, color: '#8BA3B5' }}>{r[3] ? safeDomain(r[3]) : '(direct)'}</td>
                        <td style={{ ...td, color: '#8BA3B5', whiteSpace: 'nowrap' }}>
                          {r[4] ? new Date(r[4]).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card title="">
              <div style={{ textAlign: 'center', padding: 40, color: '#8BA3B5' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>Nog geen ABM bezoekers</p>
                <p style={{ fontSize: 13 }}>Wanneer prospects via je outreach-links je site bezoeken, verschijnen ze hier.</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* ---- Sub-components ---- */

function MetricCard({ icon, value, label, accent }: { icon: string; value: string | number; label: string; accent?: boolean }) {
  return (
    <div style={{
      padding: '16px 20px', borderRadius: 16, background: accent ? 'linear-gradient(135deg, #EF476F, #ff6b8a)' : '#fff',
      border: accent ? 'none' : '1px solid #E2E8F0', textAlign: 'center',
      boxShadow: accent ? '0 4px 20px rgba(239,71,111,0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 13, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: accent ? '#fff' : '#023047', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11, color: accent ? 'rgba(255,255,255,0.85)' : '#8BA3B5', fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      {title && <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: '#023047' }}>{title}</h3>}
      {children}
    </div>
  );
}

function BarList({ items, color = '#023047' }: { items: { label: string; value: number; sub?: string }[]; color?: string }) {
  if (!items?.length) return <p style={{ color: '#8BA3B5', fontSize: 13, textAlign: 'center', padding: 20 }}>Geen data</p>;
  const max = items[0]?.value || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative', height: 30, borderRadius: 6, background: '#f8fafc', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: '0 auto 0 0', width: `${(item.value / max) * 100}%`, background: color, borderRadius: 6, opacity: 0.12 }} />
            <div style={{ position: 'relative', padding: '0 10px', lineHeight: '30px', fontSize: 12, fontWeight: 500, color: '#023047', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.label}
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: 50 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#023047' }}>{item.value}</span>
            {item.sub && <span style={{ fontSize: 10, color: '#8BA3B5', marginLeft: 4 }}>{item.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- Styles ---- */

const th: React.CSSProperties = { padding: '8px 12px', fontWeight: 700, color: '#4A6B7F', fontSize: 11, textTransform: 'uppercase', textAlign: 'center', borderBottom: '2px solid #E2E8F0' };
const td: React.CSSProperties = { padding: '10px 12px', color: '#023047' };
const dateLabel: React.CSSProperties = { fontSize: 10, color: '#8BA3B5', fontWeight: 500 };

function periodBtn(active: boolean): React.CSSProperties {
  return { padding: '6px 14px', borderRadius: 8, border: active ? '2px solid #023047' : '1px solid #E2E8F0', background: active ? '#023047' : '#fff', color: active ? '#fff' : '#64748b', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' };
}

function tabBtn(active: boolean): React.CSSProperties {
  return { flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', background: active ? '#fff' : 'transparent', color: active ? '#023047' : '#8BA3B5', fontWeight: active ? 700 : 500, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', whiteSpace: 'nowrap' };
}

function fmtDate(d: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

function safeDomain(url: string) {
  try { return new URL(url).hostname; } catch { return url?.slice(0, 30) || ''; }
}
