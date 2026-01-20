'use client';

import React from 'react';

export default function LandingPanel() {
  return (
    <div
      className="bg-white/5 backdrop-blur-md border border-white/10 text-white flex flex-col items-center justify-center rounded-2xl p-6 md:p-8"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <main className="text-center w-full flex flex-col items-center">
        {/* 1) Heading */}
        <h1 className="text-xl md:text-2xl font-extrabold text-white mb-3 leading-tight tracking-tight">
          Prioritize human connection,
          <br />
          <span className="text-purple-400">not calendar management.</span>
        </h1>

        {/* 2) Problem / short text */}
        <section className="mb-4 text-gray-300 text-sm leading-relaxed w-full">
          <p className="font-semibold text-white mb-2">Scheduling personal time could be exhausting.</p>
          <div className="flex justify-center w-full">
            <ul className="list-disc list-inside space-y-0.5 text-left text-[13px] inline-block">
              <li>Texts spiral.</li>
              <li>Context piles up.</li>
              <li>Everyone's overwhelmed.</li>
            </ul>
          </div>
        </section>

        {/* 3) Centered CTA Button */}
        <div className="mb-6 w-full flex justify-center">
          <button className="px-8 py-2.5 bg-purple-600 text-white font-bold rounded-full text-sm hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20">
            Share my availability
          </button>
        </div>

        {/* 4) Solution / features */}
        <section className="mb-2 w-full">
          <h2 className="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider">
            whenRUfree does the math—so you don’t have to.
          </h2>
          <div className="flex justify-center w-full">
            <ul className="text-left text-[13px] space-y-2 text-gray-200 inline-block">
              <li>🔗 Share availability with a link</li>
              <li>⏰ Find overlaps automatically</li>
              <li>💬 Set preferences easily</li>
              <li>🔒 Keep details private</li>
              <li>❌ No calendars. No guilt.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}