'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  ChevronLeft,
  ChevronRight,
  Calendar,
  LogOut,
  Lock,
} from 'lucide-react';

import { PEOPLE, MAX_SELECTION } from '@/data/mock-data';
import PeoplePicker from '@/components/people-picker';
import MatchesPanel from '@/components/matches-panel';
import UpgradeToProCard from '@/components/upgrade-to-pro-card';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTz, setSelectedTz] = useState('EST');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [displayMode, setDisplayMode] = useState<'full' | 'free'>('full');

  const isPro = false;
  const shareLink = 'https://whenrufree.com/schedule/alice-m';
  const dayIdx = currentDate.getDay();

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

  const handleConfirm = (timeRange: string) => {
    alert(`Match Confirmed: ${timeRange}`);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none" />

      {/* HEADER WITH SHARE LINK */}
      <header className="backdrop-blur-sm border-b border-purple-700 sticky top-0 z-50 bg-[#3b0764]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">whenRUfree</span>
          </div>

          <div className="hidden md:flex flex-col items-center gap-1">
            <span className="font-semibold text-purple-100 text-sm">Copy this link to share when you are free</span>
            <div className="flex items-center gap-2">
              <div className="bg-black border border-white/10 rounded px-3 py-1.5 font-mono text-xs text-purple-200 w-[300px] truncate">
                {shareLink}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-purple-200 hover:text-white transition text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* NAVIGATION BAR */}
      <nav className="bg-[#2d053f]/90 backdrop-blur-sm border-b border-purple-800 sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-300 py-3">
            <li><a href="#" className="text-white border-b-2 border-purple-400 pb-1">Dashboard</a></li>
            <li><a href="#" className="hover:text-white transition">Availability</a></li>
            <li><a href="#" className="hover:text-white transition">Settings</a></li>
          </ul>
        </div>
      </nav>

      <main className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
        {/* TITLE SECTION */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Find Time That Work for Everyone</h2>
        </div>

        {/* DATE & VIEW CONTROLS */}
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

        {/* UPGRADE CARD - directly under the date/view controls */}
        {!isPro && (view === 'week' || view === 'month') && (
          <div className="w-full max-w-5xl mx-auto">
            <UpgradeToProCard
              text="Upgrade to Pro for unlimited comparisons and calendar views."
              actionLabel="Upgrade Now"
              onAction={() => console.log('Upgrade clicked')}
            />
          </div>
        )}

        {/* PEOPLE PICKER - FIXED POSITION */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-400 tracking-widest mb-4">Select whom to include to see times that work for Everyone</h3>
          <PeoplePicker 
            people={PEOPLE} 
            selectedIds={selectedIds} 
            setSelectedIds={setSelectedIds} 
            maxSelection={MAX_SELECTION} 
          />
        </div>

        {/* MATCHES PANEL */}
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