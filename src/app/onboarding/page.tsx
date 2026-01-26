// src/app/onboarding/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

import Head from 'next/head';

import WelcomeBanner from '@/components/welcome-banner';
import WakingHours from '@/components/waking-hours';
import PreferenceNote from '@/components/preference-note';
import AvailabilityCard from '@/components/availability-card';
import Footer from '@/components/footer';

import { sampleAvailability } from '@/data/mock-data';

export default function Onboarding() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [preferenceNote, setPreferenceNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setError(null);

    // Optionally ensure user is signed in
    if (status !== 'authenticated') {
      setError('You must be signed in to complete onboarding.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || `Failed to complete onboarding (${res.status})`);
      }

      // Success — navigate to availability
      router.push('/availability');
    } catch (err: any) {
      console.error('Failed to complete onboarding:', err);
      setError(err?.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>whenRUfree — Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white selection:bg-purple-300/20 font-['Inter',sans-serif] relative overflow-x-hidden flex flex-col">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% -20%, rgba(107, 70, 193, 0.3), transparent)',
          }}
        />

        {/* Top Header: Welcome Banner + Sign Out (match availability page) */}
        <header className="relative z-30 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <WelcomeBanner className="text-gray-300" showTagline={false} />

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10 sm:px-3 sm:py-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </header>

        {/* Frame / centered content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 pt-8 pb-12 flex flex-col gap-8 flex-grow">
          <div className="w-full">
            {/* Keep the banner above the onboarding copy — WelcomeBanner already rendered in the header;
                if you want the banner repeated here, uncomment the line below. */}
            {/* <WelcomeBanner className="flex-col justify-center text-left text-gray-300" showTagline={false} /> */}
          </div>

          <div className="w-full">
            <h2
              className="font-bold text-white tracking-tight"
              style={{
                fontSize: 'clamp(1.1rem, 3.5vw, 1.8rem)',
                whiteSpace: 'nowrap',
              }}
            >
              Start by setting your availability — you can refine it later in settings
            </h2>
          </div>

          <section className="w-full">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Step 1. Set your typical waking hours
            </h3>
            <WakingHours />
          </section>

          <section className="w-full">
            <h3 className="text-lg font-semibold mb-1 text-white">
              Step 2. Express your preferences <span className="text-gray-400 font-normal">(optional)</span>
            </h3>
            <p className="text-gray-400 mb-3 text-sm">
              When someone asks if you’re free, you can customize your response with a preset phrase or your own note.
            </p>

            <PreferenceNote
              className="w-full"
              showPresets={true}
              onChange={(fullText: string) => setPreferenceNote(fullText)}
            />
          </section>

          <section className="w-full">
            <h3 className="text-lg font-semibold mb-1 text-white">Step 3. Share your availability</h3>
            <p className="text-gray-400 mb-3 text-sm">Availability preview — this is what others see after you share.</p>
            <p className="text-gray-300 mb-1 text-xs italic">Click a time slot to cycle through availability:</p>
            <p className="text-gray-300 mb-3 text-xs italic">Not selected → Available → Tentative → Not selected</p>

            <AvailabilityCard className="mt-3" preferenceNote={preferenceNote} dailyAvailability={sampleAvailability} />
          </section>

          <section className="w-full">
            <h3 className="text-lg font-semibold mb-1 text-white">Step 4. You’re all set!</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Now that you’ve set your waking hours and preferences, your availability is ready to share. You can always update these later in settings.
            </p>

            {error && (
              <div className="text-sm text-red-400 bg-white/5 p-2 rounded-md mb-3">
                {error}
              </div>
            )}

            <div className="flex justify-start sm:justify-start">
              <button
                onClick={handleStart}
                className="bg-brandPurpleButton hover:bg-purple-600 rounded py-3 px-6 font-semibold text-white transition disabled:opacity-60"
                aria-label="Start using whenRUfree"
                disabled={loading}
              >
                {loading ? 'Finishing setup…' : 'Start Using whenRUfree'}
              </button>
            </div>
          </section>

          <footer className="w-full pt-6 pb-8">
            <Footer />
          </footer>
        </div>
      </div>
    </>
  );
}