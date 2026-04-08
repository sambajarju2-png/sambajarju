'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const subjects = [
  'Freelance opdracht',
  'Samenwerking',
  'Vraag over mijn werk',
  'ABM / Marketing Automation',
  'Anders',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: subjects[0], message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Vul alle verplichte velden in.'); return; }
    setSending(true); setError('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) setSent(true);
      else setError(data.error || 'Er ging iets mis.');
    } catch { setError('Netwerkfout — probeer het opnieuw.'); }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div className="text-center max-w-md" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#EF476F1a' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#EF476F' }} />
          </div>
          <h2 className="text-3xl font-black mb-3" style={{ color: '#023047' }}>Bericht verstuurd!</h2>
          <p className="text-lg mb-8" style={{ color: '#6b7280' }}>Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white" style={{ backgroundColor: '#023047' }}>
            <ArrowLeft className="w-4 h-4" /> Terug naar home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #023047 0%, #034067 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> Terug naar home
            </Link>
          </motion.div>
          <motion.h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Neem <span style={{ color: '#EF476F' }}>contact</span> op
          </motion.h1>
          <motion.p className="text-lg max-w-2xl" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            Vraag, feedback, of wil je samenwerken? Ik hoor graag van je.
          </motion.p>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-16" style={{ backgroundColor: '#f8fafb' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div className="lg:col-span-2 rounded-2xl p-8" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#023047' }}>Naam *</label>
                  <input
                    type="text"
                    placeholder="Je naam"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                    style={{ borderColor: '#e5e7eb', color: '#023047', background: '#f9fafb' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#023047' }}>Email *</label>
                  <input
                    type="email"
                    placeholder="je@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                    style={{ borderColor: '#e5e7eb', color: '#023047', background: '#f9fafb' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#023047' }}>Onderwerp</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 cursor-pointer"
                    style={{ borderColor: '#e5e7eb', color: '#023047', background: '#f9fafb' }}
                  >
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#023047' }}>Bericht *</label>
                  <textarea
                    placeholder="Waar kan ik je mee helpen?"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 resize-y"
                    style={{ borderColor: '#e5e7eb', color: '#023047', background: '#f9fafb' }}
                  />
                </div>

                {error && <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  style={{ backgroundColor: '#EF476F' }}
                >
                  {sending ? 'Verzenden...' : 'Verstuur bericht'} <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <h3 className="font-bold text-lg mb-6" style={{ color: '#023047' }}>Bereik mij</h3>
                <div className="space-y-5">
                  {[
                    { icon: <Mail className="w-5 h-5" />, label: 'samba@sambajarju.nl', sub: 'Email', href: 'mailto:samba@sambajarju.nl' },
                    { icon: <Phone className="w-5 h-5" />, label: '+31 6 87975656', sub: 'Telefoon', href: 'tel:+31687975656' },
                    { icon: <MapPin className="w-5 h-5" />, label: 'Rotterdam, Nederland', sub: 'Locatie' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EF476F1a', color: '#EF476F' }}>
                        {item.icon}
                      </div>
                      <div>
                        {item.href ? (
                          <a href={item.href} className="font-medium text-sm hover:underline" style={{ color: '#023047' }}>{item.label}</a>
                        ) : (
                          <p className="font-medium text-sm" style={{ color: '#023047' }}>{item.label}</p>
                        )}
                        <p className="text-xs" style={{ color: '#6b7280' }}>{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#023047' }}>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#ffffff' }}>Snelle reactie</h3>
                <p className="text-sm" style={{ color: '#A7DADC' }}>Ik reageer meestal binnen 24 uur op werkdagen.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
