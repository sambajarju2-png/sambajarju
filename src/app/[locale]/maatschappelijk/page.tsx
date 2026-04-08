'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Users, Globe, HandHeart } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  }),
};

const sections = [
  {
    title: 'Zorg voor ouderen',
    icon: <Heart className="w-6 h-6" />,
    content: [
      'Mijn maatschappelijke inzet begon op jonge leeftijd, toen ik werkte in een bejaardentehuis in Malden, een rustig dorpje naast Nijmegen. Het werk leek misschien eenvoudig: helpen bij het ontbijt, wat schoonmaken, een praatje maken. Maar voor de bewoners betekende dit alles. Wat begon als een bijbaan, groeide uit tot een ervaring die mijn hart raakte.',
      'Ik zag van dichtbij hoe belangrijk aandacht en waardering geven is. Hoe een kort gesprekje of een simpele glimlach het verschil kan maken in iemands dag, of zelfs in iemands week. Daar leerde ik: maatschappelijke betrokkenheid zit niet in grote gebaren, maar in oprechte aanwezigheid.',
    ],
  },
  {
    title: 'Mantelzorg',
    icon: <Users className="w-6 h-6" />,
    content: [
      'Na mijn tijd in het bejaardentehuis ben ik een jaar lang mantelzorger geweest voor ouderen die nog zelfstandig woonden, maar ondersteuning nodig hadden in het huishouden.',
      'Naast het schoonmaken of boodschappen doen, was mijn rol vooral die van een luisterend oor. Veel van deze ouderen hadden weinig sociaal contact. Sommigen hadden geen kinderen of familie meer om zich heen. In die gesprekken kwamen verhalen boven van gemis, herinneringen, levenslessen en ja, soms ook met tranen.',
      'Naast mijn werk met ouderen heb ik me ook ingezet als mantelzorger voor gezinnen waarin één of beide ouders verstandelijk beperkt waren. Deze gezinnen vallen vaak tussen wal en schip: ze redden zich grotendeels zelf, maar hebben soms nét dat beetje extra hulp nodig in het dagelijks leven.',
    ],
  },
  {
    title: 'Baraka4Gambia',
    icon: <Globe className="w-6 h-6" />,
    content: [
      'Inmiddels ben ik samen met mijn partner initiatiefnemer van Baraka4Gambia, een project dat zich inzet voor de meest kwetsbare mensen in Gambia.',
      'Wat begon met een paar dozen kleding is uitgegroeid tot een serieus hulpinitiatief. Afgelopen maand hebben we meer dan 70 dozen met kleding ingezameld en verstuurd naar kansarme gezinnen in verschillende regio\'s van Gambia. Maar we doen meer. Dankzij donaties konden we in maart 2025 achttien gezinnen voorzien van voedselpakketten, waarmee ze een maand lang genoeg te eten hadden. Geen zorgen, geen stress, alleen rust en waardigheid.',
      'Baraka4Gambia is voor mij een manier om mijn roots te eren én iets terug te doen.',
    ],
  },
];

const stats = [
  { value: '70+', label: 'Dozen kleding verstuurd', icon: <HandHeart className="w-5 h-5" /> },
  { value: '18', label: 'Gezinnen voorzien van voedselpakketten', icon: <Users className="w-5 h-5" /> },
  { value: '3+', label: 'Jaar maatschappelijk actief', icon: <Heart className="w-5 h-5" /> },
];

export default function MaatschappelijkPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #023047 0%, #034067 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #EF476F 0%, transparent 50%), radial-gradient(circle at 80% 50%, #A7DADC 0%, transparent 50%)' }} />
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: '#A7DADC' }}>
              <ArrowLeft className="w-4 h-4" /> Terug naar home
            </Link>
          </motion.div>

          <motion.p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#EF476F' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Meer dan marketing
          </motion.p>

          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            Is Samba Jarju{' '}
            <span style={{ color: '#EF476F' }}>maatschappelijk</span>{' '}
            betrokken?
          </motion.h1>

          <motion.p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: '#A7DADC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            Wie mij kent als marketeer, weet dat ik oog heb voor groei, strategie en commerciële kansen. Maar er is een andere, minstens zo belangrijke kant van mij die ik graag deel: mijn maatschappelijke betrokkenheid.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background-alt">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-8 text-center"
                className="bg-surface border border-border"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: '#EF476F1a', color: '#EF476F' }}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-black mb-2 text-foreground">{stat.value}</div>
                <div className="text-sm text-foreground-subtle">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-24">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EF476F1a', color: '#EF476F' }}>
                  {section.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  {section.title}
                </h2>
              </div>
              <div className="h-[2px] w-16 rounded-full mb-8" style={{ backgroundColor: '#EF476F' }} />
              <div className="space-y-6">
                {section.content.map((p, j) => (
                  <p key={j} className="text-lg leading-relaxed text-foreground-muted">{p}</p>
                ))}
              </div>

              {/* Show Gambia image after Baraka4Gambia section */}
              {section.title === 'Baraka4Gambia' && (
                <motion.div className="mt-10 rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Image src="/samba-gambia.jpg" alt="Baraka4Gambia donatie" width={800} height={600} className="w-full h-auto object-cover" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: '#023047' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#ffffff' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Wil je meer weten of bijdragen?
          </motion.h2>
          <motion.p className="text-lg mb-8" style={{ color: '#A7DADC' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Neem gerust contact op — ik vertel je er graag meer over.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-transform hover:scale-105" style={{ backgroundColor: '#EF476F' }}>
              Neem contact op <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
