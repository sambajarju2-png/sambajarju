'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import AnalyticsDashboard from '@/components/admin/analytics-dashboard';
import OutreachTab from '@/components/admin/outreach-tab';
import InboxTab from '@/components/admin/inbox-tab';
import type { User } from '@supabase/supabase-js';
import {
  Building2, Users, Send, MailOpen, MousePointerClick, MessageSquareReply, Eye,
  Inbox, BarChart3, LogOut, ExternalLink, LayoutDashboard
} from 'lucide-react';

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
  const [tab, setTab] = useState<'outreach' | 'inbox' | 'analytics'>('outreach');
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

  const sendReplyToContact = async (sub: ContactSubmission, message: string) => {
    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: sub.id, toEmail: sub.email, toName: sub.name, subject: `Re: ${sub.subject}`, message }),
      });
      const data = await res.json();
      if (data.success) { setContactSubs(prev => prev.map(c => c.id === sub.id ? { ...c, read: true } : c)); }
      else alert(data.error || 'Fout bij verzenden');
    } catch { alert('Netwerkfout'); }
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-[#8BA3B5] text-sm">Loading...</p></div>;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#023047] flex items-center justify-center text-white font-bold text-lg">SJ</div>
      <h1 className="text-2xl font-bold">Samba Admin</h1>
      <button onClick={signIn} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#E2E8F0] bg-white text-sm font-semibold cursor-pointer hover:bg-[#f8fafc] transition">Sign in with Google</button>
    </div>
  );

  if (user.email !== ADMIN_EMAIL) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold">Niet geautoriseerd</h1>
      <button onClick={signOut} className="px-5 py-2.5 rounded-lg border border-[#E2E8F0] bg-white cursor-pointer hover:bg-[#f8fafc] transition">Sign out</button>
    </div>
  );


  const statItems = [
    { label: 'Bedrijven', value: stats?.companies ?? '—', icon: Building2 },
    { label: 'Contacten', value: stats?.contacts ?? '—', icon: Users },
    { label: 'Verzonden', value: stats?.sent ?? '—', icon: Send, color: 'text-[#EF476F]' },
    { label: 'Geopend', value: stats?.opened ?? '—', icon: MailOpen, color: 'text-[#3FCF8E]' },
    { label: 'Geklikt', value: stats?.clicked ?? '—', icon: MousePointerClick, color: 'text-[#06B6D4]' },
    { label: 'Replied', value: stats?.replied ?? '—', icon: MessageSquareReply, color: 'text-[#8B5CF6]' },
    { label: 'Views', value: stats?.pageViews ?? '—', icon: Eye },
  ];

  const tabItems = [
    { id: 'outreach' as const, label: 'Outreach', icon: Send, action: () => setTab('outreach') },
    { id: 'inbox' as const, label: `Inbox (${contactSubs.filter(c => !c.read).length})`, icon: Inbox, action: () => { setTab('inbox'); fetchContacts(); } },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3, action: () => setTab('analytics') },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#023047] flex items-center justify-center">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">ABM Dashboard</h1>
            <p className="text-xs text-[#8BA3B5]">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="/" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium hover:bg-[#f8fafc] transition no-underline text-[#023047]">
            <ExternalLink size={12} /> Portfolio
          </a>
          <a href="/studio" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium hover:bg-[#f8fafc] transition no-underline text-[#023047]">
            <ExternalLink size={12} /> Sanity
          </a>
          <button onClick={signOut} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium hover:bg-[#f8fafc] transition cursor-pointer">
            <LogOut size={12} /> Uit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5 mb-7">
        {statItems.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-3.5 rounded-xl bg-white border border-[#E8EDF2]">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={13} className="text-[#8BA3B5]" />
              <span className="text-[10px] text-[#8BA3B5] uppercase tracking-wide font-semibold">{label}</span>
            </div>
            <p className={`text-xl font-extrabold m-0 ${color || 'text-[#023047]'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {tabItems.map(({ id, label, icon: Icon, action }) => (
          <button
            key={id}
            onClick={action}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer border-none ${
              tab === id ? 'bg-[#023047] text-white' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e8edf2]'
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {tab === 'outreach' && (
        <OutreachTab
          form={form}
          setForm={setForm}
          sending={sending}
          sendResult={sendResult}
          handleSend={handleSend}
          csvRows={csvRows}
          bulkStatus={bulkStatus}
          bulkSending={bulkSending}
          handleCsvUpload={handleCsvUpload}
          handleBulk={handleBulk}
          recentOutreach={(stats?.recentOutreach || []) as Record<string, unknown>[]}
        />
      )}

      {tab === 'inbox' && (
        <InboxTab
          contactSubs={contactSubs}
          inboxReplies={(stats?.inboxReplies || []) as Record<string, unknown>[]}
          markRead={markRead}
          deleteContact={deleteContact}
          sendReply={sendReplyToContact}
        />
      )}

      {tab === 'analytics' && <AnalyticsDashboard />}
    </div>
  );
}
