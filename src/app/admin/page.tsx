'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';
import type { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'sambajarju2@gmail.com';

interface Stats { companies: number; contacts: number; sent: number; opened: number; clicked: number; replied: number; pageViews: number; recentOutreach: Record<string, unknown>[]; inboxReplies: Record<string, unknown>[]; }

interface CsvRow { companyDomain: string; firstName: string; lastName: string; email: string; role: string; language: 'nl' | 'en'; }

interface ContactSubmission { id: string; name: string; email: string; subject: string; message: string; read: boolean; created_at: string; }

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');
  const [form, setForm] = useState({ companyDomain: '', contactFirstName: '', contactLastName: '', contactEmail: '', contactRole: '', language: 'nl' as 'nl' | 'en' });
  const [tab, setTab] = useState<'single' | 'bulk' | 'contact' | 'analytics'>('single');
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkSending, setBulkSending] = useState(false);
  const [contactSubs, setContactSubs] = useState<ContactSubmission[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const fetchStats = useCallback(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  useEffect(() => { if (user?.email === ADMIN_EMAIL) { fetchStats(); fetchContacts(); } }, [user, fetchStats]);

  const fetchContacts = useCallback(async () => {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setContactSubs(data as ContactSubmission[]);
  }, [supabase]);

  const markRead = async (id: string) => {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    setContactSubs(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
  };

  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [replySending, setReplySending] = useState(false);

  const sendReply = async (sub: ContactSubmission) => {
    if (!replyMsg.trim()) return;
    setReplySending(true);
    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: sub.id, toEmail: sub.email, toName: sub.name, subject: `Re: ${sub.subject}`, message: replyMsg }),
      });
      const data = await res.json();
      if (data.success) { setReplyTo(null); setReplyMsg(''); setContactSubs(prev => prev.map(c => c.id === sub.id ? { ...c, read: true } : c)); }
      else alert(data.error || 'Fout bij verzenden');
    } catch { alert('Netwerkfout'); }
    setReplySending(false);
  };

  const deleteContact = async (id: string) => {
    await supabase.from('contact_submissions').delete().eq('id', id);
    setContactSubs(prev => prev.filter(c => c.id !== id));
  };

  const signIn = () => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/admin` } });
  const signOut = () => { supabase.auth.signOut(); setUser(null); };

  const handleSend = async () => {
    if (!form.companyDomain || !form.contactEmail || !form.contactFirstName) return;
    setSending(true); setSendResult('');
    try {
      const res = await fetch('/api/outreach/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setSendResult('✅ Email verzonden!'); setForm({ companyDomain: '', contactFirstName: '', contactLastName: '', contactEmail: '', contactRole: '', language: 'nl' }); fetchStats(); }
      else setSendResult(`❌ ${data.error || 'Fout bij verzenden'}`);
    } catch { setSendResult('❌ Netwerkfout'); }
    setSending(false);
  };

  const parseCsv = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;
    const headers = lines[0].toLowerCase().split(/[,;\t]/).map(h => h.trim().replace(/"/g, ''));
    const rows: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(/[,;\t]/).map(c => c.trim().replace(/"/g, ''));
      const get = (names: string[]) => {
        const idx = headers.findIndex(h => names.some(n => h.includes(n)));
        return idx >= 0 ? cols[idx] || '' : '';
      };
      const row: CsvRow = {
        companyDomain: get(['domain', 'company', 'bedrijf', 'website']),
        firstName: get(['first', 'voornaam', 'firstname']),
        lastName: get(['last', 'achternaam', 'lastname']),
        email: get(['email', 'mail']),
        role: get(['role', 'functie', 'title', 'job']),
        language: get(['lang', 'language', 'taal']).toLowerCase().startsWith('en') ? 'en' : 'nl',
      };
      if (row.email && row.firstName) rows.push(row);
    }
    setCsvRows(rows);
    setBulkStatus(`${rows.length} contacten gevonden`);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => parseCsv(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleBulk = async (action: 'import' | 'send') => {
    if (csvRows.length === 0) return;
    setBulkSending(true); setBulkStatus(action === 'send' ? 'Emails versturen...' : 'Importeren...');
    try {
      const res = await fetch('/api/outreach/bulk', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts: csvRows.map(r => ({ ...r })), action }),
      });
      const data = await res.json();
      setBulkStatus(`✅ ${data.imported || 0} geïmporteerd, ${data.sent || 0} verzonden, ${data.errors || 0} fouten`);
      if (action === 'send') fetchStats();
    } catch { setBulkStatus('❌ Fout'); }
    setBulkSending(false);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#8BA3B5' }}>Loading...</p></div>;

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EF476F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>SJ</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Samba Admin</h1>
      <button onClick={signIn} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign in with Google</button>
    </div>
  );

  if (user.email !== ADMIN_EMAIL) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Niet geautoriseerd</h1>
      <button onClick={signOut} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer' }}>Sign out</button>
    </div>
  );

  const s = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const };
  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: '#4A6B7F', marginBottom: 4, display: 'block' as const };
  const pillBtn = (active: boolean) => ({ padding: '8px 16px', borderRadius: 99, border: 'none', background: active ? '#023047' : '#f1f5f9', color: active ? '#fff' : '#64748b', fontWeight: 600 as const, fontSize: 13, cursor: 'pointer' as const, fontFamily: 'inherit' });

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 28 }}>
        {[
          { label: 'Bedrijven', value: stats?.companies ?? '—' },
          { label: 'Contacten', value: stats?.contacts ?? '—' },
          { label: 'Verzonden', value: stats?.sent ?? '—', color: '#EF476F' },
          { label: 'Geopend', value: stats?.opened ?? '—', color: '#3FCF8E' },
          { label: 'Geklikt', value: stats?.clicked ?? '—', color: '#06B6D4' },
          { label: 'Replied', value: stats?.replied ?? '—', color: '#8B5CF6' },
          { label: 'Views', value: stats?.pageViews ?? '—' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: 14, borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: 10, color: '#8BA3B5', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: color || '#023047' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('single')} style={pillBtn(tab === 'single')}>📧 Enkel</button>
        <button onClick={() => setTab('bulk')} style={pillBtn(tab === 'bulk')}>📋 Bulk (CSV)</button>
        <button onClick={() => { setTab('contact'); fetchContacts(); }} style={pillBtn(tab === 'contact')}>
          📩 Contact ({contactSubs.filter(c => !c.read).length})
        </button>
        <button onClick={() => setTab('analytics')} style={pillBtn(tab === 'analytics')}>📊 Analytics</button>
      </div>

      {/* SINGLE SEND */}
      {tab === 'single' && (
        <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Nieuwe outreach versturen</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>Bedrijf domein *</label><input style={inputStyle} placeholder="nike.com" value={form.companyDomain} onChange={e => s('companyDomain', e.target.value)} /></div>
            <div><label style={labelStyle}>Email *</label><input style={inputStyle} placeholder="peter@nike.com" value={form.contactEmail} onChange={e => s('contactEmail', e.target.value)} /></div>
            <div><label style={labelStyle}>Voornaam *</label><input style={inputStyle} placeholder="Peter" value={form.contactFirstName} onChange={e => s('contactFirstName', e.target.value)} /></div>
            <div><label style={labelStyle}>Achternaam</label><input style={inputStyle} placeholder="de Vries" value={form.contactLastName} onChange={e => s('contactLastName', e.target.value)} /></div>
            <div><label style={labelStyle}>Functie</label><input style={inputStyle} placeholder="Marketing Manager" value={form.contactRole} onChange={e => s('contactRole', e.target.value)} /></div>
            <div>
              <label style={labelStyle}>Taal</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => s('language', 'nl')} style={{ ...pillBtn(form.language === 'nl'), flex: 1, padding: '10px 0' }}>🇳🇱 NL</button>
                <button onClick={() => s('language', 'en')} style={{ ...pillBtn(form.language === 'en'), flex: 1, padding: '10px 0' }}>🇬🇧 EN</button>
              </div>
            </div>
          </div>
          <button onClick={handleSend} disabled={sending || !form.companyDomain || !form.contactEmail || !form.contactFirstName} style={{ width: '100%', padding: '12px 20px', borderRadius: 10, border: 'none', background: sending ? '#8BA3B5' : '#EF476F', color: '#fff', fontWeight: 600, fontSize: 14, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 12 }}>
            {sending ? 'Verzenden...' : 'Verstuur outreach'}
          </button>
          {sendResult && <p style={{ marginTop: 12, fontSize: 14 }}>{sendResult}</p>}
          <p style={{ marginTop: 10, fontSize: 12, color: '#8BA3B5' }}>
            Preview: <a href={form.companyDomain ? `/${form.language === 'en' ? 'en/' : ''}landing?company=${form.companyDomain}&contactname=${form.contactFirstName}` : '#'} target="_blank" rel="noopener" style={{ color: '#EF476F' }}>Landing</a>
            {' · '}
            <a href={form.companyDomain ? `/api/cv/generate?company=${form.companyDomain}&contactname=${form.contactFirstName}&lang=${form.language}` : '#'} target="_blank" rel="noopener" style={{ color: '#EF476F' }}>CV (PDF)</a>
          </p>
        </div>
      )}

      {/* BULK CSV */}
      {tab === 'bulk' && (
        <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Bulk import via CSV</h2>
          <p style={{ fontSize: 13, color: '#8BA3B5', margin: '0 0 16px' }}>
            Kolommen: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>domain, firstname, lastname, email, role, language</code>
            <br/>Language = <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>nl</code> of <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>en</code> (bepaalt taal email + CV + landing page)
          </p>

          <input type="file" accept=".csv,.tsv,.txt" onChange={handleCsvUpload} style={{ marginBottom: 12 }} />

          {csvRows.length > 0 && (
            <>
              <div style={{ overflowX: 'auto', maxHeight: 250, marginBottom: 12, border: '1px solid #E2E8F0', borderRadius: 10 }}>
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                      {['Domain', 'Naam', 'Email', 'Functie', 'Taal'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#4A6B7F', fontSize: 11, borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '6px 10px' }}>{row.companyDomain}</td>
                        <td style={{ padding: '6px 10px' }}>{row.firstName} {row.lastName}</td>
                        <td style={{ padding: '6px 10px', color: '#EF476F' }}>{row.email}</td>
                        <td style={{ padding: '6px 10px', color: '#8BA3B5' }}>{row.role}</td>
                        <td style={{ padding: '6px 10px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: row.language === 'en' ? '#dbeafe' : '#fef3c7', color: row.language === 'en' ? '#1e40af' : '#854d0e' }}>
                            {row.language === 'en' ? '🇬🇧 EN' : '🇳🇱 NL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleBulk('import')} disabled={bulkSending} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Alleen importeren ({csvRows.length})
                </button>
                <button onClick={() => handleBulk('send')} disabled={bulkSending} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: bulkSending ? '#8BA3B5' : '#EF476F', color: '#fff', fontWeight: 600, fontSize: 14, cursor: bulkSending ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {bulkSending ? 'Bezig...' : `Import + Verstuur (${csvRows.length})`}
                </button>
              </div>
            </>
          )}
          {bulkStatus && <p style={{ marginTop: 12, fontSize: 14 }}>{bulkStatus}</p>}
        </div>
      )}

      {/* Recent outreach */}

      {/* CONTACT SUBMISSIONS */}
      {tab === 'contact' && (
        <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Contactformulier berichten</h2>
          {contactSubs.length === 0 ? (
            <p style={{ color: '#8BA3B5', fontSize: 14 }}>Nog geen berichten ontvangen.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contactSubs.map((sub) => (
                <div key={sub.id} style={{ padding: 16, borderRadius: 12, background: sub.read ? '#f8fafc' : '#fefce8', border: `1px solid ${sub.read ? '#E2E8F0' : '#fde047'}`, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#023047' }}>{sub.name}</span>
                      <span style={{ fontSize: 13, color: '#8BA3B5', marginLeft: 8 }}>&lt;{sub.email}&gt;</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#8BA3B5' }}>{new Date(sub.created_at).toLocaleString('nl-NL')}</span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#4A6B7F', margin: '0 0 6px' }}>{sub.subject}</p>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0, whiteSpace: 'pre-wrap' }}>{sub.message}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    <button onClick={() => { setReplyTo(replyTo === sub.id ? null : sub.id); setReplyMsg(''); }} style={{ padding: '6px 12px', borderRadius: 8, background: replyTo === sub.id ? '#023047' : '#EF476F', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 'none' }}>
                      {replyTo === sub.id ? 'Annuleren' : 'Beantwoorden'}
                    </button>
                    {!sub.read && (
                      <button onClick={() => markRead(sub.id)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Markeer gelezen</button>
                    )}
                    <button onClick={() => { if (confirm('Weet je het zeker?')) deleteContact(sub.id); }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#dc2626' }}>Verwijderen</button>
                  </div>
                  {replyTo === sub.id && (
                    <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <textarea
                        value={replyMsg}
                        onChange={(e) => setReplyMsg(e.target.value)}
                        placeholder={`Typ je antwoord aan ${sub.name}...`}
                        rows={4}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                      />
                      <button
                        onClick={() => sendReply(sub)}
                        disabled={replySending || !replyMsg.trim()}
                        style={{ marginTop: 8, padding: '8px 16px', borderRadius: 8, border: 'none', background: replySending ? '#8BA3B5' : '#EF476F', color: '#fff', fontSize: 13, fontWeight: 600, cursor: replySending ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                      >
                        {replySending ? 'Verzenden...' : '📨 Verstuur via Mailgun'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent outreach */}
      {tab !== 'analytics' && stats?.recentOutreach && stats.recentOutreach.length > 0 && (
        <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0', marginBottom: 16 }}>
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

      {/* ANALYTICS */}
      {tab === 'analytics' && <AnalyticsDashboard />}

      {/* Inbox */}
      {tab !== 'analytics' && stats?.inboxReplies && stats.inboxReplies.length > 0 && (
        <div style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>📬 Inbox</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stats.inboxReplies.map((msg: Record<string, unknown>, i: number) => (
              <div key={i} style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#023047' }}>{String(msg.from_email || '')}</span>
                  <span style={{ fontSize: 11, color: '#8BA3B5' }}>{msg.received_at ? new Date(String(msg.received_at)).toLocaleString('nl-NL') : ''}</span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#4A6B7F', margin: '0 0 6px' }}>{String(msg.subject || '')}</p>
                <p style={{ fontSize: 13, color: '#555', margin: 0, whiteSpace: 'pre-wrap', maxHeight: 120, overflow: 'hidden' }}>{String(msg.body_plain || '').slice(0, 500)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
