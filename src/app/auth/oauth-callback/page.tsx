//app/auth/oauth-callback/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OAuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if ((session?.user as any)?.isNewUser) {
        router.replace('/onboarding');
      } else {
        router.replace('/availability');
      }
    }
  }, [status, session, router]);

  return <div>Loading...</div>;
}