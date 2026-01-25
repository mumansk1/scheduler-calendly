'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import WelcomeBanner from '@/components/welcome-banner';
import WakingHours from '@/components/waking-hours';
import PreferenceNote from '@/components/preference-note';
import AvailabilityCard from '@/components/availability-card';
import Footer from '@/components/footer';

export default function Onboarding() {
  // If you later want to sync PreferenceNote -> AvailabilityCard,
  // lift the note state here and pass an `onChange` to PreferenceNote.
  // For now we keep it simple and show how to pass a note into AvailabilityCard.
  const [preferenceNote, setPreferenceNote] = useState<string>('');

  return (
    <>
      <Head>
        <title>whenRUfree — Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white selection:bg-purple-300/20 font-['Inter',sans-serif] relative overflow-x-hidden flex flex-col">
        {/* subtle background glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% -20%, rgba(107, 70, 193, 0.3), transparent)',
          }}
        />

        {/* Main content wrapper */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 pt-8 pb-12 flex flex-col gap-8 flex-grow">
          {/* Welcome */}
          <div className="w-full">
            <WelcomeBanner
              className="flex-col justify-center text-left text-gray-300"
              showTagline={false}
            />
          </div>

          {/* Header */}
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

          {/* Step 1 */}
          <section className="w-full">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Step 1. Set your typical waking hours
            </h3>
            <WakingHours />
          </section>

          {/* Step 2 */}
          <section className="w-full">
            <h3 className="text-lg font-semibold mb-1 text-white">
              Step 2. Express your preferences <span className="text-gray-400 font-normal">(optional)</span>
            </h3>
            <p className="text-gray-400 mb-3 text-sm">
              When someone asks if you’re free, you can customize your response with a preset phrase or your own note.
            </p>

            {/* PreferenceNote shows preset pills and lets user type a manual note.
                If you want to lift the note up to the page, add an `onChange` prop
                to PreferenceNote that calls `setPreferenceNote(...)`. */}
            <PreferenceNote
              className="w-full"
              showPresets={true}
              // Example: you'd pass onChange={(note) => setPreferenceNote(note)}
            />
          </section>

          {/* Step 3 */}
          <section className="w-full">
            <h3 className="text-lg font-semibold mb-1 text-white">Step 3. Share your availability</h3>
            <p className="text-gray-400 mb-3 text-sm">Availability preview — this is what others see after you share.</p>
            <p className="text-gray-300 mb-1 text-xs italic">Click a time slot to cycle through availability:</p>
            <p className="text-gray-300 mb-3 text-xs italic">Not selected → Available → Tentative → Not selected</p>

            {/* AvailabilityCard will render with its internal initial state.
                Ensure your `availability-card` component's initial state sets one slot to 'Free'
                and another to 'Tentative' as desired. We pass preferenceNote (optional) here. */}
            <AvailabilityCard className="mt-3" preferenceNote={preferenceNote} />
          </section>

          {/* Footer */}
          <footer className="w-full pt-6 pb-8">
            <Footer />
          </footer>
        </div>
      </div>
    </>
  );
}