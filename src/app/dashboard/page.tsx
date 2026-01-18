'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Crown, Globe, ChevronLeft, ChevronRight, Calendar, LogOut, Lock } from 'lucide-react';

import { MAX_SELECTION } from '@/config/defaults';
import { PEOPLE } from '@/data/mock-data';

import PeoplePicker from '@/components/people-picker';
import MatchesPanel from '@/components/matches-panel';
import UpgradeToProCard from '@/components/upgrade-to-pro-card';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTz, setSelectedTz] = useState('EST');
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

  const isPro = false;
  const shareLink = 'https://whenrufree.com/schedule/alice-m';
  const dayIdx = currentDate.getDay();

  // Transform and limit to first 3 people for the picker UI
  const formattedPeople = PEOPLE.slice(0, 3).map(p => {
    return {
      id: p.id,
      firstName: p.firstName ?? '',
      // Get first character of last name if available, otherwise empty string
      lastName: p.lastName?.[0] ?? '',
      timezoneAbbr: p.timezoneAbbr ?? '',
      // Fallback to empty string instead of undefined
      countryCode: p.countryCode ?? '',
      countryName: p.countryName ?? ''
    };
  });

  // Ensure the first person (owner) is selected by default
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => (formattedPeople.length > 0 ? [formattedPeople[0].id] : [])
  );

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  if (status === 'loading' || !session) return <div className="min-h-screen bg-black" />;

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + direction);
    else if (view === 'week') newDate.setDate(newDate.getDate() + direction * 7);
    else newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleToggle = (id: string) => {
  setSelectedIds((prev) => {
    // If the id is already selected
    if (prev.includes(id)) {
      // Prevent removing if it's the last selected person
      if (prev.length === 1) {
        return prev; // Do nothing, keep last person selected
      }
      // Otherwise remove the id
      return prev.filter((x) => x !== id);
    }
    // If id is not selected, add it
    return [...prev, id];
  });
  };

  const handleConfirm = (timeRange: string) => {
    alert(`Match Confirmed: ${timeRange}`);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none" />

      <header className="backdrop-blur-sm border-b border-purple-700 bg-[#3b0764]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">whenRUfree</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-purple-200 hover:text-white transition text-sm font-medium bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg border border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>

          <div className="flex flex-col items-center md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-full md:w-auto">
            <span className="font-semibold text-purple-100 text-xs md:text-sm mb-1 text-center">
              Copy this link to share when you are free
            </span>
            <div className="flex items-center gap-2 w-full max-w-[400px] md:w-auto">
              <div className="bg-black border border-white/10 rounded px-3 py-2 font-mono text-[10px] md:text-xs text-purple-200 flex-1 truncate">
                {shareLink}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-4 py-2 rounded text-xs font-bold transition-all shadow-lg shadow-purple-900/20"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-[#2d053f]/90 backdrop-blur-sm border-b border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-300 py-3">
            <li><a href="#" className="text-white border-b-2 border-purple-400 pb-1">Dashboard</a></li>
            <li><a href="#" className="hover:text-white transition">Availability</a></li>
            <li><a href="#" className="hover:text-white transition">Settings</a></li>
          </ul>
        </div>
      </nav>

      <main className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Find Time That Works for Everyone</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <div className="flex items-center bg-black border border-white/20 rounded-xl px-4 py-2 md:w-[60%] h-[52px]">
            <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-white/10 rounded-full transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold mx-4 flex-1 text-center text-lg">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button onClick={() => navigateDate(1)} className="p-2 hover:bg-white/10 rounded-full transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 md:w-[40%] h-[52px]">
            <div className="flex bg-black border border-white/20 rounded-xl p-1 flex-[1.5] h-full items-center">
              {(['day', 'week', 'month'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-bold text-xs transition-all h-full ${
                    view === v ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                  {(v === 'week' || v === 'month') && !isPro && <Lock className="w-3 h-3 text-gray-400/80" />}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-black border border-white/20 rounded-xl px-3 py-2 flex-1 h-full">
              <Globe className="w-4 h-4 flex-shrink-0" />
              <select
                value={selectedTz}
                onChange={e => setSelectedTz(e.target.value)}
                className="bg-transparent text-xs text-gray-300 font-medium focus:outline-none cursor-pointer w-full"
              >
                <option value="EST" className="bg-black">EST</option>
                <option value="PST" className="bg-black">PST</option>
                <option value="GMT" className="bg-black">GMT</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restore Upgrade Card (view-based) */}
        {!isPro && (view === 'week' || view === 'month') && (
          <div className="w-full max-w-5xl mx-auto">
            <UpgradeToProCard
              text="Upgrade to Pro for unlimited comparisons and calendar views."
              actionLabel="Upgrade Now"
              onAction={() => console.log('Upgrade clicked')}
              icon={<Crown className="w-5 h-5 text-yellow-400" />}
            />
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-400 tracking-widest mb-4">Select whom to include to see times that work for Everyone</h3>

          {/* People picker */}
          <PeoplePicker
            people={formattedPeople}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            showFlags
          />

          {/* Show inline upgrade prompt when selection cap reached and user is not Pro */}
          {!isPro && selectedIds.length >= MAX_SELECTION && (
            <div className="mt-4">
              <UpgradeToProCard
                text={`Compare more than ${MAX_SELECTION} people — upgrade to Pro.`}
                actionLabel="Upgrade to Pro"
                onAction={() => console.log('Upgrade clicked from picker')}
                icon={<Crown className="w-4 h-4 text-yellow-400" />}
              />
            </div>
          )}
        </div>

        {/* Matches panel — MatchesPanel will fetch & display matches when selectedIds has entries */}
        <div className="min-h-[200px]">
          <MatchesPanel
            people={PEOPLE}
            selectedIds={selectedIds}
            dayIndex={dayIdx}
            onConfirm={handleConfirm}
          />
        </div>
      </main>
    </div>
  );
}