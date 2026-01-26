// src/app/availability/page.tsx
'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import WelcomeBanner from '@/components/welcome-banner';
import TabNavigator from '@/components/tab-navigator';
import AvailabilityCard from '@/components/availability-card';

import { DEFAULT_DAY, DEFAULT_WAKING_HOURS } from '@/config/defaults';

import { LogOut } from 'lucide-react';

export default function Availability() {
  const [preferenceNote, setPreferenceNote] = useState<string>('');

  // If you want these editable in the future, you can lift into state:
  const wakingHours = { start: DEFAULT_WAKING_HOURS.start, end: DEFAULT_WAKING_HOURS.end };
  
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-300/20 font-['Inter',sans-serif] relative overflow-x-hidden">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% -20%, rgba(107, 70, 193, 0.3), transparent)',
        }}
      />

      {/* Top Header: Welcome Banner + Sign Out */}
      <header className="relative z-30 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <WelcomeBanner 
          className="text-gray-300" 
          showTagline={false} 
        />
        
        <button
  onClick={() => signOut({ callbackUrl: '/' })}
  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10 sm:px-3 sm:py-2"
>
  <LogOut className="w-4 h-4" />
  <span className="hidden sm:inline">Sign out</span>
</button>
      </header>

      {/* Tab Navigator: Now just the tabs, placed below the header */}
      <div className="relative z-20">
        <TabNavigator showSignOut={false} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-4">
        {/* Header moved up by reducing mt-12 to mt-4 */}
        <h3 className="text-white font-extrabold text-3xl tracking-wide text-center mb-8">
          Set Your Availability
        </h3>
        
        {/* Added mb-8 to the header above to give room between it and this main component */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 pt-2 pb-8 px-8">
          <section className="w-full">
            {/* Combined the instructional text and the state legend inline */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
              <div className="text-gray-300 text-[20px] leading-[28px]">
                Click on a time slot to cycle availability states
              </div>

              {/* Legend: FREE / TENTATIVE / UNAVAILABLE — styled like availability-card */}
              <div className="flex items-center gap-3">
  <span className="inline-flex items-center justify-center w-28 py-1 rounded select-none bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold uppercase">
    UNAVAILABLE
  </span>

  <span className="inline-flex items-center justify-center w-28 py-1 rounded select-none bg-green-700 hover:bg-green-600 text-white text-xs font-semibold uppercase">
    FREE
  </span>

  <span className="inline-flex items-center justify-center w-28 py-1 rounded select-none bg-yellow-700 hover:bg-yellow-600 text-white text-xs font-semibold uppercase">
    TENTATIVE
  </span>
</div>
            </div>

            <AvailabilityCard 
              className="mt-3" 
              preferenceNote={preferenceNote} 
              dailyAvailability={DEFAULT_DAY}
              wakingHours={wakingHours}
            />
          </section>
        </div>
      </main>
    </div>
  );
}