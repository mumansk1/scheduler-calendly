'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function LandingPanel() {
  const router = useRouter();
  const { data: session, status } = useSession(); // status: 'loading' | 'authenticated' | 'unauthenticated'

  return (
    <div
      className="bg-white/5 backdrop-blur-md border border-white/10 text-white flex flex-col items-center justify-center rounded-2xl p-8 md:p-12 w-full"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <main className="text-center w-full flex flex-col items-center max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight tracking-tight">
          Prioritize human connection,
          <br />
          <span className="text-purple-300">not calendar management</span>
        </h1>

        <section className="mb-8 text-gray-300 text-lg leading-relaxed w-full">
          <h2 className="text-base md:text-lg font-black text-grey mb-4 tracking-[0.2em] ">
            Scheduling personal time could be exhausting
          </h2>

          <h2
            className="font-extrabold text-white mb-6 text-4xl md:text-5xl leading-tight tracking-wide text-center"
            style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.7)' }}
          >
            whenRUfree is here to help
          </h2>

          <h2 className="text-base md:text-lg font-black text-gray-300 mb-4 tracking-[0.2em] ">
            we will do the calendar math — so you don’t have to
          </h2>
        </section>

        <ul className="text-left text-base md:text-lg space-y-6 text-gray-100 font-medium w-full max-w-md">
          <li className="flex items-center gap-3">
            <span className="text-xl" role="img" aria-label="Lock">
              🔒
            </span>
            Keep details private
          </li>
          <li className="flex items-center gap-3">
            <span className="text-xl" role="img" aria-label="Clock">
              ⏰
            </span>
            Find overlaps automatically
          </li>
          <li className="flex items-center gap-3">
            <span className="text-xl" role="img" aria-label="Chat bubble">
              💬
            </span>
            Set preferences easily
          </li>
          <li className="flex items-center gap-3">
            <span className="text-xl" role="img" aria-label="One click share">
              ⚡
            </span>
            Share availability with one click
          </li>
        </ul>
      </main>
    </div>
  );
}