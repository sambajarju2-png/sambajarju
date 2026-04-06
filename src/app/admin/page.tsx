'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'sambajarju2@gmail.com';

interface Stats { companies: number; contacts: number; sent: number; opened: number; clicked: number; replied: number; pageViews: number; recentOutreach: Record<string, unknown>[]; inboxReplies: Record<string, unknown>[]; }

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');
  const [form, setForm] = useState({ companyDomain: '', contactFirstName: '', contactLastName: '', contactEmail: '', contactRole: '' });
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const fetchStats = useCallback(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  useEffect(() => { if (user?.email === ADMIN_EMAIL) fetchStats(); }, [user, fetchStats]);

  const signIn = () => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/admin` } });
  const signOut = () => { supabase.auth.signOut(); setUser(null); };

  const handleSend = async () => {
    if (!form.companyDomain || !form.contactEmail || !form.contactFirstName) return;
    setSending(true); setSendResult('');
    try {
      const res = await fetch('/api/outreach/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setSendResult('✅ Email verzonden!'); setForm({ companyDomain: '', contactFirstName: '', contactLastName: '', contactEmail: '', contactRole: '' }); fetchStats(); }
      else setSendResult(`❌ ${data.error || 'Fout bij verzenden'}`);
    } catch { setSendResult('❌ Netwerkfout'); }
    setSending(false);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#8BA3B5' }}>Loading...</p></div>;

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EF476F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>SJ</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Samba Admin</h1>
      <p style={{ color: '#8BA3B5', margin: 0 }}>Sign in to manage outreach</p>
      <button onClick={signIn} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Sign in with Google</button>
    </div>
  );

  if (user.email !== ADMIN_EMAIL) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Niet geautoriseerd</h1>
      <p style={{ color: '#8BA3B5' }}>{user.email}</p>
      <button onClick={signOut} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer' }}>Sign out</button>
    </div>
  );

  const s = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const };
  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: '#4A6B7F', marginBottom: 4, display: 'block' as const };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>ABM Dashboard</h1>
          <p style={{ color: '#8BA3B5', margin: '4px 0 0', fontSize: 13 }}>{user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/" style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', textDecoration: 'none', color: '#023047', fontSize: 13 }}>Portfolio</a>
          <a href="/studio" style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', textDecoration: 'none', color: '#023047', fontSize: 13 }}>Sanity</a>
          <button onClick={signOut} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: 13 }}>Uitloggen</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Bedrijven', value: stats?.companies ?? '—' },
          { label: 'Contacten', value: stats?.contacts ?? '—' },
          { label: 'Verzonden', value: stats?.sent ?? '—', color: '#EF476F' },
          { label: 'Geopend', value: stats?.opened ?? '—', color: '#3FCF8E' },
          { label: 'Geklikt', value: stats?.clicked ?? '—', color: '#06B6D4' },
          { label: 'Replied', value: stats?.replied ?? '—', color: '#8B5CF6' },
          { label: 'Pagina views', value: stats?.pageViews ?? '—' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: 11, color: '#8BA3B5', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: color || '#023047' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Send outreach form */}
      <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>📧 Nieuwe outreach versturen</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={labelStyle}>Bedrijf domein *</label><input style={inputStyle} placeholder="nike.com" value={form.companyDomain} onChange={e => s('companyDomain', e.target.value)} /></div>
          <div><label style={labelStyle}>Email *</label><input style={inputStyle} placeholder="peter@nike.com" value={form.contactEmail} onChange={e => s('contactEmail', e.target.value)} /></div>
          <div><label style={labelStyle}>Voornaam *</label><input style={inputStyle} placeholder="Peter" value={form.contactFirstName} onChange={e => s('contactFirstName', e.target.value)} /></div>
          <div><label style={labelStyle}>Achternaam</label><input style={inputStyle} placeholder="de Vries" value={form.contactLastName} onChange={e => s('contactLastName', e.target.value)} /></div>
          <div><label style={labelStyle}>Functie</label><input style={inputStyle} placeholder="Marketing Manager" value={form.contactRole} onChange={e => s('contactRole', e.target.value)} /></div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={handleSend} disabled={sending || !form.companyDomain || !form.contactEmail || !form.contactFirstName} style={{ width: '100%', padding: '10px 20px', borderRadius: 8, border: 'none', background: sending ? '#8BA3B5' : '#EF476F', color: '#fff', fontWeight: 600, fontSize: 14, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {sending ? 'Verzenden...' : 'Verstuur outreach'}
            </button>
          </div>
        </div>
        {sendResult && <p style={{ marginTop: 12, fontSize: 14 }}>{sendResult}</p>}
        <p style={{ marginTop: 12, fontSize: 12, color: '#8BA3B5' }}>
          Dit verstuurt een branded email met Color Thief kleuren en een link naar de persoonlijke landingspagina.
          <br />Preview: <a href={form.companyDomain ? `/landing?company=${form.companyDomain}&contactname=${form.contactFirstName}` : '#'} target="_blank" rel="noopener" style={{ color: '#EF476F' }}>Landing page</a>
          {' · '}
          <a href={form.companyDomain ? `/api/cv/generate?company=${form.companyDomain}&contactname=${form.contactFirstName}` : '#'} target="_blank" rel="noopener" style={{ color: '#EF476F' }}>Branded CV (PDF)</a>
        </p>
      </div>

      {/* Recent outreach */}
      {stats?.recentOutreach && stats.recentOutreach.length > 0 && (
        <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Recente outreach</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#4A6B7F', fontSize: 11, textTransform: 'uppercase' }}>Subject</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#4A6B7F', fontSize: 11, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#4A6B7F', fontSize: 11, textTransform: 'uppercase' }}>Verzonden</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOutreach.map((log: Record<string, unknown>, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 12px', color: '#023047' }}>{String(log.subject || '—')}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: log.status === 'opened' ? '#dcfce7' : log.status === 'clicked' ? '#dbeafe' : log.status === 'sent' ? '#fef9c3' : '#fee2e2', color: log.status === 'opened' ? '#166534' : log.status === 'clicked' ? '#1e40af' : log.status === 'sent' ? '#854d0e' : '#991b1b' }}>
                        {String(log.status || 'sent')}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#8BA3B5' }}>{log.sent_at ? new Date(String(log.sent_at)).toLocaleDateString('nl-NL') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inbox — received replies */}
      {stats?.inboxReplies && stats.inboxReplies.length > 0 && (
        <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', marginTop: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>📬 Inbox (ontvangen replies)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stats.inboxReplies.map((msg: Record<string, unknown>, i: number) => (
              <div key={i} style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#023047' }}>{String(msg.from_email || '')}</span>
                  <span style={{ fontSize: 11, color: '#8BA3B5' }}>{msg.received_at ? new Date(String(msg.received_at)).toLocaleString('nl-NL') : ''}</span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#4A6B7F', margin: '0 0 6px' }}>{String(msg.subject || '(geen onderwerp)')}</p>
                <p style={{ fontSize: 13, color: '#555', margin: 0, whiteSpace: 'pre-wrap', maxHeight: 120, overflow: 'hidden' }}>{String(msg.body_plain || '').slice(0, 500)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
