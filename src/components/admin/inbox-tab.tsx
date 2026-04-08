'use client';

import { useState } from 'react';
import { Mail, Clock, Reply, Trash2, CheckCircle, X, Send, Loader2, ChevronRight } from 'lucide-react';

interface ContactSubmission { id: string; name: string; email: string; subject: string; message: string; read: boolean; created_at: string; }

interface InboxTabProps {
  contactSubs: ContactSubmission[];
  inboxReplies: Record<string, unknown>[];
  markRead: (id: string) => void;
  deleteContact: (id: string) => void;
  sendReply: (sub: ContactSubmission, msg: string) => Promise<void>;
}

type InboxItem = {
  type: 'contact' | 'reply';
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  raw: ContactSubmission | Record<string, unknown>;
};

export default function InboxTab({ contactSubs, inboxReplies, markRead, deleteContact, sendReply }: InboxTabProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [replying, setReplying] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  // Merge contact subs + inbox replies into one unified list
  const items: InboxItem[] = [
    ...contactSubs.map(c => ({
      type: 'contact' as const,
      id: c.id,
      from: c.name,
      email: c.email,
      subject: c.subject,
      preview: c.message.slice(0, 120),
      date: c.created_at,
      read: c.read,
      raw: c,
    })),
    ...inboxReplies.map((r, i) => ({
      type: 'reply' as const,
      id: `reply-${i}`,
      from: String(r.from_email || ''),
      email: String(r.from_email || ''),
      subject: String(r.subject || '(no subject)'),
      preview: String(r.body_plain || '').slice(0, 120),
      date: String(r.received_at || ''),
      read: true,
      raw: r,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const selected = items.find(i => i.id === selectedId);
  const unreadCount = items.filter(i => !i.read).length;

  const handleReply = async () => {
    if (!selected || selected.type !== 'contact' || !replyMsg.trim()) return;
    setReplying(true);
    await sendReply(selected.raw as ContactSubmission, replyMsg);
    setReplyMsg('');
    setShowReplyBox(false);
    setReplying(false);
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString('nl-NL', { weekday: 'short' });
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF2] overflow-hidden" style={{ minHeight: 400 }}>
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#E8EDF2] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail size={15} className="text-[#8BA3B5]" />
          <h3 className="text-sm font-bold text-[#023047]">Inbox</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#EF476F] text-white text-[10px] font-bold">{unreadCount}</span>
          )}
        </div>
        <span className="text-[10px] text-[#8BA3B5]">{items.length} berichten</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#8BA3B5]">
          <Mail size={28} className="mb-2" />
          <p className="text-sm font-semibold">Inbox is leeg</p>
          <p className="text-xs mt-1">Berichten verschijnen hier</p>
        </div>
      ) : !selected ? (
        /* Message list */
        <div className="divide-y divide-[#f4f7fa]">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                setShowReplyBox(false);
                setReplyMsg('');
                if (!item.read && item.type === 'contact') markRead(item.id);
              }}
              className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition cursor-pointer border-none ${
                !item.read ? 'bg-[#fefce8]' : 'bg-white hover:bg-[#fafbfc]'
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                !item.read ? 'bg-[#EF476F] text-white' : 'bg-[#f1f5f9] text-[#4A6B7F]'
              }`}>
                {item.from.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs truncate ${!item.read ? 'font-bold text-[#023047]' : 'font-medium text-[#023047]'}`}>{item.from}</span>
                  <span className="text-[10px] text-[#8BA3B5] flex-shrink-0 flex items-center gap-1">
                    <Clock size={10} /> {formatDate(item.date)}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 truncate ${!item.read ? 'font-semibold text-[#023047]' : 'text-[#4A6B7F]'}`}>{item.subject}</p>
                <p className="text-[11px] text-[#8BA3B5] mt-0.5 truncate">{item.preview}</p>
              </div>

              <ChevronRight size={14} className="text-[#8BA3B5] flex-shrink-0 mt-2" />
            </button>
          ))}
        </div>
      ) : (
        /* Message detail */
        <div>
          {/* Back bar */}
          <button
            onClick={() => { setSelectedId(null); setShowReplyBox(false); }}
            className="w-full text-left px-5 py-2.5 border-b border-[#f4f7fa] text-xs text-[#8BA3B5] hover:bg-[#fafbfc] transition cursor-pointer bg-white border-none flex items-center gap-1"
          >
            <X size={12} /> Terug naar inbox
          </button>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-[#023047] mb-1">{selected.subject}</h2>
                <div className="flex items-center gap-2 text-xs text-[#8BA3B5]">
                  <span className="font-semibold text-[#023047]">{selected.from}</span>
                  <span>&lt;{selected.email}&gt;</span>
                </div>
              </div>
              <span className="text-[10px] text-[#8BA3B5] flex-shrink-0">
                {selected.date ? new Date(selected.date).toLocaleString('nl-NL') : ''}
              </span>
            </div>

            {/* Body */}
            <div className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap mb-6 bg-[#fafbfc] rounded-xl p-4 border border-[#f4f7fa]">
              {selected.type === 'contact'
                ? (selected.raw as ContactSubmission).message
                : String((selected.raw as Record<string, unknown>).body_plain || '')}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              {selected.type === 'contact' && (
                <>
                  <button
                    onClick={() => setShowReplyBox(!showReplyBox)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#023047] text-white text-xs font-semibold cursor-pointer border-none hover:bg-[#034a6e] transition"
                  >
                    <Reply size={13} /> {showReplyBox ? 'Annuleren' : 'Beantwoorden'}
                  </button>
                  <button
                    onClick={() => { if (confirm('Weet je het zeker?')) { deleteContact(selected.id); setSelectedId(null); } }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-semibold cursor-pointer hover:bg-red-50 transition"
                  >
                    <Trash2 size={13} /> Verwijderen
                  </button>
                </>
              )}
            </div>

            {/* Reply box */}
            {showReplyBox && selected.type === 'contact' && (
              <div className="mt-4 p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
                <textarea
                  value={replyMsg}
                  onChange={e => setReplyMsg(e.target.value)}
                  placeholder={`Typ je antwoord aan ${selected.from}...`}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#d1d5db] text-sm outline-none resize-y"
                />
                <button
                  onClick={handleReply}
                  disabled={replying || !replyMsg.trim()}
                  className={`mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border-none text-white text-xs font-semibold cursor-pointer transition ${
                    replying ? 'bg-[#8BA3B5] cursor-not-allowed' : 'bg-[#EF476F] hover:bg-[#d93a5e]'
                  }`}
                >
                  {replying ? <><Loader2 size={13} className="animate-spin" /> Verzenden...</> : <><Send size={13} /> Verstuur</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
