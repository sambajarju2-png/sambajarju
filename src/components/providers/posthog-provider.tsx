'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const POSTHOG_KEY = 'phc_x8sNcf24eKaaM5o7XrhtiAHVhXnPoDhxtnxb3fYXNyfN';
const POSTHOG_HOST = 'https://eu.i.posthog.com';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false, // we handle manually
        capture_pageleave: true,
        autocapture: true,
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !posthog) return;

    const url = window.location.origin + pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Identify ABM visitors from URL params
    const company = searchParams?.get('company');
    const contactname = searchParams?.get('contactname');
    
    if (company) {
      const distinctId = `${company}_${contactname || 'unknown'}`;
      posthog.identify(distinctId, {
        company,
        contact_name: contactname || undefined,
        source: 'abm_link',
      });

      // Also store in Supabase for retargeting
      fetch('/api/track/abm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          contact_name: contactname || null,
          page: pathname,
          referrer: document.referrer || null,
          session_id: posthog.get_session_id?.() || null,
        }),
      }).catch(() => {});
    } else {
      // Try IP-based company identification for organic visitors (once per session)
      const identified = window.sessionStorage?.getItem('_ip_identified');
      if (!identified) {
        fetch('/api/identify').then(r => r.json()).then(data => {
          if (data.company && data.isLikelyBusiness) {
            posthog.capture('ip_company_identified', {
              ip_company: data.company,
              ip_domain: data.domain,
              ip_asn: data.asn,
            });
            // Store in Supabase
            fetch('/api/track/abm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                company: data.domain || data.company,
                contact_name: null,
                page: pathname,
                referrer: document.referrer || null,
                session_id: posthog.get_session_id?.() || null,
              }),
            }).catch(() => {});
          }
          window.sessionStorage?.setItem('_ip_identified', '1');
        }).catch(() => {});
      }
    }

    posthog.capture('$pageview', {
      $current_url: url,
      company: company || undefined,
      contact_name: contactname || undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
