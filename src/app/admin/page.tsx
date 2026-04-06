'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'sambajarju2@gmail.com';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8BA3B5' }}>Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Samba Admin</h1>
        <p style={{ color: '#8BA3B5' }}>Sign in to manage your outreach</p>
        <button
          onClick={signIn}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 8,
            border: '1px solid #E2E8F0', background: '#fff',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  // Wrong account
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Not Authorized</h1>
        <p style={{ color: '#8BA3B5' }}>Signed in as {user.email}</p>
        <button onClick={signOut} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: 14 }}>
          Sign out
        </button>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Samba ABM Dashboard</h1>
          <p style={{ color: '#8BA3B5', margin: '4px 0 0', fontSize: 14 }}>{user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/" style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', textDecoration: 'none', color: '#023047', fontSize: 13 }}>Portfolio</a>
          <a href="/studio" style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', textDecoration: 'none', color: '#023047', fontSize: 13 }}>Sanity</a>
          <button onClick={signOut} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: 13 }}>Sign out</button>
        </div>
      </div>

      {/* Stats cards — will be wired to real data */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Companies', value: '—', color: '#023047' },
          { label: 'Contacts', value: '—', color: '#023047' },
          { label: 'Emails Sent', value: '—', color: '#EF476F' },
          { label: 'Opened', value: '—', color: '#A7DADC' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: 20, borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: 12, color: '#8BA3B5', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div style={{ padding: 40, borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0', textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>Outreach coming soon</p>
        <p style={{ color: '#8BA3B5', fontSize: 14, margin: 0 }}>Add a company, generate a branded CV, and send your first outreach email.</p>
      </div>
    </div>
  );
}
