'use client';

import React from 'react';

export default function LandingPanel() {
  return (
    <div
      className="bg-white/5 backdrop-blur-md border border-white/10 text-white flex flex-col justify-center rounded-2xl p-6 md:p-8"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <main className="text-center">
        {/* 1) Heading */}
        <h1 className="text-xl md:text-2xl font-extrabold text-white mb-3 leading-tight tracking-tight">
          Prioritize human connection,
          <br />
          <span className="text-purple-400">not calendar management.</span>
        </h1>

        {/* 2) Problem / short text */}
        <section className="mb-4 text-gray-300 text-sm leading-relaxed">
          <p className="font-semibold text-white mb-2">Scheduling personal time could be exhausting.</p>
          <div className="flex justify-center">
            <ul className="list-disc list-inside space-y-0.5 max-w-md text-left text-[13px]">
              <li>Texts spiral.</li>
              <li>Context piles up.</li>
              <li>Everyone's overwhelmed.</li>
            </ul>
          </div>
        </section>

        {/* 3) Centered CTA (moved here as the third text block and centered) */}
        <div className="mb-4">
          <button className="mx-auto block px-6 py-2 bg-purple-600 text-white font-bold rounded-full text-sm">
            Share my availability
          </button>
        </div>

        {/* 4) Solution / features (kept below the CTA) */}
        <section className="mb-2">
          <h2 className="text-xs font-bold text-purple-300 mb-2">whenRUfree does the math—so you don’t have to.</h2>
          <ul className="max-w-xs mx-auto text-left text-[13px] space-y-1.5 text-gray-200">
            <li>🔗 Share availability with a link</li>
            <li>⏰ Find overlaps automatically</li>
            <li>💬 Set preferences easily</li>
            <li>🔒 Keep details private</li>
            <li>❌ No calendars. No guilt.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}