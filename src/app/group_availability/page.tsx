'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import WelcomeBanner from '@/components/welcome-banner';
import TabNavigator from '@/components/tab-navigator';
import AvailabilityCard from '@/components/availability-card';

import { DEFAULT_DAY } from '@/config/defaults'

import { LogOut } from 'lucide-react';

export default function GroupAvailability() {
  const [preferenceNote, setPreferenceNote] = useState<string>('');
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
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg border border-white/10"
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
      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
          <section className="w-full">
           Under development
    
          </section>
        </div>
      </main>
    </div>
  );
}