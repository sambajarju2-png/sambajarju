'use client';

import { useState } from 'react';
import { Send, Upload, User, Globe, FileText, ExternalLink, Loader2 } from 'lucide-react';

interface CsvRow { companyDomain: string; firstName: string; lastName: string; email: string; role: string; language: 'nl' | 'en'; }

interface OutreachTabProps {
  form: { companyDomain: string; contactFirstName: string; contactLastName: string; contactEmail: string; contactRole: string; language: 'nl' | 'en'; };
  setForm: (fn: (f: OutreachTabProps['form']) => OutreachTabProps['form']) => void;
  sending: boolean;
  sendResult: string;
  handleSend: () => void;
  csvRows: CsvRow[];
  bulkStatus: string;
  bulkSending: boolean;
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBulk: (mode: 'import' | 'send') => void;
  recentOutreach: Record<string, unknown>[];
}

const statusColor: Record<string, { bg: string; text: string }> = {
  sent: { bg: 'bg-amber-50', text: 'text-amber-700' },
  opened: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  clicked: { bg: 'bg-blue-50', text: 'text-blue-700' },
  replied: { bg: 'bg-purple-50', text: 'text-purple-700' },
};

export default function OutreachTab({
  form, setForm, sending, sendResult, handleSend,
  csvRows, bulkStatus, bulkSending, handleCsvUpload, handleBulk,
  recentOutreach,
}: OutreachTabProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const s = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-tabs */}
      <div className="bg-white rounded-2xl border border-[#E8EDF2] overflow-hidden">
        <div className="flex border-b border-[#E8EDF2]">
          {[
            { id: 'single' as const, label: 'Single send', icon: User },
            { id: 'bulk' as const, label: 'Bulk CSV', icon: Upload },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition cursor-pointer border-none ${
                mode === id
                  ? 'bg-[#023047] text-white'
                  : 'bg-white text-[#64748b] hover:bg-[#f8fafc]'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* SINGLE */}
          {mode === 'single' && (
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4A6B7F] mb-1 block">Bedrijf domein *</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm outline-none focus:border-[#023047] transition" placeholder="nike.com" value={form.companyDomain} onChange={e => s('companyDomain', e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4A6B7F] mb-1 block">Email *</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm outline-none focus:border-[#023047] transition" placeholder="peter@nike.com" value={form.contactEmail} onChange={e => s('contactEmail', e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4A6B7F] mb-1 block">Voornaam *</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm outline-none focus:border-[#023047] transition" placeholder="Peter" value={form.contactFirstName} onChange={e => s('contactFirstName', e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4A6B7F] mb-1 block">Achternaam</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm outline-none focus:border-[#023047] transition" placeholder="de Vries" value={form.contactLastName} onChange={e => s('contactLastName', e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4A6B7F] mb-1 block">Functie</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm outline-none focus:border-[#023047] transition" placeholder="Marketing Manager" value={form.contactRole} onChange={e => s('contactRole', e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4A6B7F] mb-1 block">Taal</label>
                  <div className="flex gap-1.5">
                    {(['nl', 'en'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => s('language', lang)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer border-none ${
                          form.language === lang ? 'bg-[#023047] text-white' : 'bg-[#f1f5f9] text-[#64748b]'
                        }`}
                      >
                        <Globe size={12} className="inline mr-1" />{lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={sending || !form.companyDomain || !form.contactEmail || !form.contactFirstName}
                className={`w-full mt-4 py-3 rounded-lg border-none text-white text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
                  sending ? 'bg-[#8BA3B5] cursor-not-allowed' : 'bg-[#EF476F] hover:bg-[#d93a5e]'
                }`}
              >
                {sending ? <><Loader2 size={14} className="animate-spin" /> Verzenden...</> : <><Send size={14} /> Verstuur outreach</>}
              </button>

              {sendResult && <p className="mt-3 text-sm">{sendResult}</p>}

              {form.companyDomain && (
                <div className="flex gap-3 mt-3 text-xs text-[#8BA3B5]">
                  <a href={`/${form.language === 'en' ? 'en/' : ''}landing?company=${form.companyDomain}&contactname=${form.contactFirstName}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[#EF476F] no-underline hover:underline">
                    <ExternalLink size={11} /> Landing preview
                  </a>
                  <a href={`/api/cv/generate?company=${form.companyDomain}&contactname=${form.contactFirstName}&lang=${form.language}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[#EF476F] no-underline hover:underline">
                    <FileText size={11} /> CV preview
                  </a>
                </div>
              )}
            </div>
          )}

          {/* BULK */}
          {mode === 'bulk' && (
            <div>
              <p className="text-xs text-[#8BA3B5] mb-3">
                Kolommen: <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[11px]">domain, firstname, lastname, email, role, language</code>
              </p>

              <label className="flex items-center justify-center gap-2 py-8 border-2 border-dashed border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#023047] hover:bg-[#f8fafc] transition text-sm text-[#8BA3B5]">
                <Upload size={16} />
                {csvRows.length > 0 ? `${csvRows.length} rijen geladen` : 'Selecteer CSV bestand'}
                <input type="file" accept=".csv,.tsv,.txt" onChange={handleCsvUpload} className="hidden" />
              </label>

              {csvRows.length > 0 && (
                <>
                  <div className="mt-3 overflow-auto max-h-[220px] border border-[#E2E8F0] rounded-xl">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#f8fafc] sticky top-0">
                          {['Domain', 'Naam', 'Email', 'Functie', 'Taal'].map(h => (
                            <th key={h} className="text-left p-2 font-semibold text-[#4A6B7F] text-[10px] uppercase border-b border-[#E2E8F0]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvRows.map((row, i) => (
                          <tr key={i} className="border-b border-[#f5f5f5]">
                            <td className="p-2">{row.companyDomain}</td>
                            <td className="p-2">{row.firstName} {row.lastName}</td>
                            <td className="p-2 text-[#EF476F]">{row.email}</td>
                            <td className="p-2 text-[#8BA3B5]">{row.role}</td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.language === 'en' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                {row.language.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleBulk('import')} disabled={bulkSending} className="flex-1 py-3 rounded-lg border border-[#E2E8F0] bg-white text-sm font-semibold cursor-pointer hover:bg-[#f8fafc] transition">
                      Alleen importeren ({csvRows.length})
                    </button>
                    <button onClick={() => handleBulk('send')} disabled={bulkSending} className={`flex-1 py-3 rounded-lg border-none text-white text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${bulkSending ? 'bg-[#8BA3B5] cursor-not-allowed' : 'bg-[#EF476F] hover:bg-[#d93a5e]'}`}>
                      {bulkSending ? <><Loader2 size={14} className="animate-spin" /> Bezig...</> : <><Send size={14} /> Importeren + versturen</>}
                    </button>
                  </div>
                </>
              )}
              {bulkStatus && <p className="mt-3 text-sm">{bulkStatus}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Recent outreach log */}
      {recentOutreach.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8EDF2] overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-bold text-[#023047] flex items-center gap-2"><Send size={14} className="text-[#8BA3B5]" /> Recente outreach</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-t border-b border-[#E8EDF2] bg-[#fafbfc]">
                  <th className="text-left px-5 py-2 font-semibold text-[#4A6B7F] text-[10px] uppercase tracking-wide">Contact</th>
                  <th className="text-left px-3 py-2 font-semibold text-[#4A6B7F] text-[10px] uppercase tracking-wide">Subject</th>
                  <th className="text-left px-3 py-2 font-semibold text-[#4A6B7F] text-[10px] uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-2 font-semibold text-[#4A6B7F] text-[10px] uppercase tracking-wide">Datum</th>
                </tr>
              </thead>
              <tbody>
                {recentOutreach.map((log, i) => {
                  const st = String(log.status || 'sent');
                  const colors = statusColor[st] || statusColor.sent;
                  const contact = log.contacts as Record<string, unknown> | null;
                  const company = log.companies as Record<string, unknown> | null;
                  return (
                    <tr key={i} className="border-b border-[#f4f7fa] hover:bg-[#fafbfc] transition">
                      <td className="px-5 py-2.5">
                        <div className="flex flex-col">
                          <span className="text-[#023047] font-semibold">{contact ? `${contact.first_name} ${contact.last_name}` : '—'}</span>
                          <span className="text-[10px] text-[#8BA3B5]">{company ? String(company.domain || company.name) : ''}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[#4A6B7F]">{String(log.subject || '—')}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors.bg} ${colors.text}`}>{st}</span>
                      </td>
                      <td className="px-3 py-2.5 text-[#8BA3B5]">{log.sent_at ? new Date(String(log.sent_at)).toLocaleDateString('nl-NL') : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
