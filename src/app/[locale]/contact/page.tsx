'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

const t: Record<string, Record<string, string>> = {
  nl: {
    back: 'Terug naar home', title_1: 'Neem', title_2: 'contact', title_3: 'op',
    subtitle: 'Vraag, feedback, of wil je samenwerken? Ik hoor graag van je.',
    name: 'Naam', email: 'Email', subject: 'Onderwerp', message: 'Bericht',
    name_ph: 'Je naam', email_ph: 'je@email.com', msg_ph: 'Waar kan ik je mee helpen?',
    send: 'Verstuur bericht', sending: 'Verzenden...', error: 'Vul alle verplichte velden in.',
    sent_title: 'Bericht verstuurd!', sent_msg: 'Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op.',
    reach: 'Bereik mij', phone: 'Telefoon', location: 'Locatie', fast: 'Snelle reactie',
    fast_desc: 'Ik reageer meestal binnen 24 uur op werkdagen.',
  },
  en: {
    back: 'Back to home', title_1: 'Get in', title_2: 'touch', title_3: '',
    subtitle: 'Question, feedback, or want to collaborate? I would love to hear from you.',
    name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
    name_ph: 'Your name', email_ph: 'you@email.com', msg_ph: 'How can I help you?',
    send: 'Send message', sending: 'Sending...', error: 'Please fill in all required fields.',
    sent_title: 'Message sent!', sent_msg: 'Thanks for your message. I will get back to you as soon as possible.',
    reach: 'Reach me', phone: 'Phone', location: 'Location', fast: 'Quick response',
    fast_desc: 'I usually respond within 24 hours on business days.',
  },
};

const subjectsMap: Record<string, string[]> = {
  nl: ['Freelance opdracht', 'Samenwerking', 'Vraag over mijn werk', 'ABM / Marketing Automation', 'Anders'],
  en: ['Freelance project', 'Collaboration', 'Question about my work', 'ABM / Marketing Automation', 'Other'],
};

export default function ContactPage() {
  const locale = useLocale();
  const l = t[locale] || t.nl;
  const subjects = subjectsMap[locale] || subjectsMap.nl;

  const [form, setForm] = useState({ name: '', email: '', subject: subjects[0], message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError(l.error); return; }
    setSending(true); setError('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) setSent(true);
      else setError(data.error || 'Something went wrong.');
    } catch { setError('Network error.'); }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div className="text-center max-w-md" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#EF476F1a' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#EF476F' }} />
          </div>
          <h2 className="text-3xl font-black mb-3 text-foreground">{l.sent_title}</h2>
          <p className="text-lg mb-8 text-foreground-muted">{l.sent_msg}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white" style={{ backgroundColor: '#023047' }}>
            <ArrowLeft className="w-4 h-4" /> {l.back}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #023047 0%, #034067 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> {l.back}
            </Link>
          </motion.div>
          <motion.h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {l.title_1} <span style={{ color: '#EF476F' }}>{l.title_2}</span> {l.title_3}
          </motion.h1>
          <motion.p className="text-lg max-w-2xl" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {l.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-background-alt">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2 rounded-2xl p-8 bg-surface border border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">{l.name} *</label>
                  <input type="text" placeholder={l.name_ph} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none transition-all focus:ring-2 bg-background text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">{l.email} *</label>
                  <input type="email" placeholder={l.email_ph} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none transition-all focus:ring-2 bg-background text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">{l.subject}</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none transition-all focus:ring-2 cursor-pointer bg-background text-foreground">
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">{l.message} *</label>
                  <textarea placeholder={l.msg_ph} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border text-sm outline-none transition-all focus:ring-2 resize-y bg-background text-foreground" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button onClick={handleSubmit} disabled={sending} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer" style={{ backgroundColor: '#EF476F' }}>
                  {sending ? l.sending : l.send} <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="rounded-2xl p-6 bg-surface border border-border">
                <h3 className="font-bold text-lg mb-6 text-foreground">{l.reach}</h3>
                <div className="space-y-5">
                  {[
                    { icon: <Mail className="w-5 h-5" />, label: 'samba@sambajarju.nl', sub: l.email, href: 'mailto:samba@sambajarju.nl' },
                    { icon: <Phone className="w-5 h-5" />, label: '+31 6 87975656', sub: l.phone, href: 'tel:+31687975656' },
                    { icon: <MapPin className="w-5 h-5" />, label: 'Rotterdam, Nederland', sub: l.location },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EF476F1a', color: '#EF476F' }}>{item.icon}</div>
                      <div>
                        {item.href ? <a href={item.href} className="font-medium text-sm hover:underline text-foreground">{item.label}</a> : <p className="font-medium text-sm text-foreground">{item.label}</p>}
                        <p className="text-xs text-foreground-subtle">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#023047' }}>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#ffffff' }}>{l.fast}</h3>
                <p className="text-sm" style={{ color: '#A7DADC' }}>{l.fast_desc}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
