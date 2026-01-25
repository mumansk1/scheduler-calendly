// app/auth/oauth-callback/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function OAuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated') {
      router.replace('/auth/signin');
      return;
    }

    const isNew = (session?.user as any)?.isNewUser;
    if (typeof isNew === 'boolean') {
      if (isNew) {
        router.replace('/onboarding');
      } else {
        router.replace('/availability');
      }
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/profile/check', { cache: 'no-store' });
        if (!res.ok) {
          router.replace('/availability');
          return;
        }
        const json = await res.json();
        if (!json.exists || json.onboarding_completed === false) {
          router.replace('/onboarding');
        } else {
          router.replace('/availability');
        }
      } catch {
        router.replace('/availability');
      }
    })();
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0c0e] text-white">
      <div className="text-center p-6 bg-[#111214] rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Signing you in…</h2>
        <p className="text-sm text-gray-400">Please wait while we finish signing you in.</p>
      </div>
    </div>
  );
}