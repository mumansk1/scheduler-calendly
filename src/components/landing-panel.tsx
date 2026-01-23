'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function LandingPanel() {
  const router = useRouter();
  const { data: session, status } = useSession(); // status: 'loading' | 'authenticated' | 'unauthenticated'

  const handleClick = () => {
    // If session is loading, you may choose to show a loader or prevent navigation.
    if (status === 'loading') return;

    if (session) {
      router.push('/availability');
    } else {
      router.push('/auth/signup');
    }
  };

  return (
    <div
      className="bg-white/5 backdrop-blur-md border border-white/10 text-white flex flex-col items-center justify-center rounded-2xl p-8 md:p-12 w-full"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <main className="text-center w-full flex flex-col items-center max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight tracking-tight">
          Prioritize human connection,
          <br />
          <span className="text-purple-300">not calendar management.</span>
        </h1>

        <section className="mb-8 text-gray-300 text-lg leading-relaxed w-full">
          <p className="font-bold text-white mb-4 text-xl">
            Scheduling personal time could be exhausting
          </p>
          <div className="flex justify-center w-full">
            <ul className="list-disc list-inside space-y-2 text-left text-base md:text-lg inline-block">
              <li>Texts spiral</li>
              <li>Context piles up</li>
              <li>Everyone's overwhelmed</li>
            </ul>
          </div>
        </section>

        <div className="mb-10 w-full flex justify-center">
          <button
            onClick={handleClick}
            disabled={status === 'loading'}
            className={`px-10 py-4 bg-brandPurpleButton hover:bg-purple-700 text-white font-black rounded-lg text-lg transition-all shadow-xl shadow-purple-500/20
              ${status === 'loading' ? 'opacity-60 cursor-wait' : 'hover:bg-purple-700 hover:scale-105'}`}
          >
            {status === 'loading' ? 'Checking…' : 'Share my availability'}
          </button>
        </div>

        <section className="w-full">
          <h2 className="text-base md:text-lg font-black text-purple-300 mb-4 tracking-[0.2em] ">
            whenRUfree does the math—so you don’t have to
          </h2>
          <div className="flex justify-center w-full">
            <ul className="text-left text-base md:text-lg space-y-4 text-gray-100 font-medium">
              <li className="flex items-center gap-3"><span>🔗</span> Share availability with a link</li>
              <li className="flex items-center gap-3"><span>⏰</span> Find overlaps automatically</li>
              <li className="flex items-center gap-3"><span>💬</span> Set preferences easily</li>
              <li className="flex items-center gap-3"><span>🔒</span> Keep details private</li>
              <li className="flex items-center gap-3"><span>❌</span> No calendars. No guilt.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}