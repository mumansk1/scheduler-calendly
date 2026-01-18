'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  ChevronLeft,
  ChevronRight,
  Crown,
  Calendar,
  LogOut,
  Lock,
} from 'lucide-react';

import { Lato, Inter, Roboto } from 'next/font/google';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

import PeoplePicker from '@/components/people-picker';
import UpgradeToProCard from '@/components/upgrade-to-pro-card';

// --- Types & Mock Data ---
type Slot = { time: string; free: boolean };
type Person = { id: string; name: string; country: string; schedule: Slot[][] };

const MAX_SELECTION = 3;

const PEOPLE: Person[] = [
  {
    id: 'alice',
    name: 'Alice Martinez (You)',
    country: '🇺🇸 USA (EST)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![9, 10, 14, 15].includes(h),
      }))
    ),
  },
  {
    id: 'bob',
    name: 'Bob Johnson',
    country: '🇮🇳 India (IST)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![10, 11, 15, 16].includes(h),
      }))
    ),
  },
  {
    id: 'carol',
    name: 'Carol Smith',
    country: '🇬🇧 UK (GMT)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![9, 13, 14].includes(h),
      }))
    ),
  },
  {
    id: 'david',
    name: 'David Wilson',
    country: '🇺🇸 USA (West) (PST)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![8, 9, 15].includes(h),
      }))
    ),
  },
  {
    id: 'emma',
    name: 'Emma Thompson',
    country: '🇦🇺 Australia (AEST)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![10, 11, 15, 16].includes(h),
      }))
    ),
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 13));
  const [selectedTz, setSelectedTz] = useState('EST');
  const [selectedIds, setSelectedIds] = useState<string[]>(['alice']);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [displayMode, setDisplayMode] = useState<'full' | 'free'>('full');

  const isPro = false;

  const handleViewChange = (v: 'day' | 'week' | 'month') => {
    setView(v);
  };

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  if (status === 'loading' || !session) return <div className="min-h-screen bg-black" />;

  const selectedPeople = PEOPLE.filter(p => selectedIds.includes(p.id));
  const dayIdx = currentDate.getDay();

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + direction);
    else if (view === 'week') newDate.setDate(newDate.getDate() + direction * 7);
    else newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatTimeSlot = (startTime: string) => {
    const [time, period] = startTime.split(' ');
    const [hours] = time.split(':').map(Number);
    const nextHour = (hours % 12) + 1;
    const nextPeriod = hours + 1 >= 12 && hours + 1 < 24 ? 'PM' : 'AM';
    return `${time} ${period} - ${nextHour === 0 ? 12 : nextHour}:00 ${nextPeriod}`;
  };

  const getMatches = () => {
    if (selectedPeople.length < 2) return [];
    const firstPersonSlots = selectedPeople[0].schedule[dayIdx];
    return firstPersonSlots
      .map((slot, idx) => {
        if (!slot.free) return null;
        const allFree = selectedPeople.every(p => p.schedule[dayIdx][idx]?.free);
        return allFree ? idx : null;
      })
      .filter((idx): idx is number => idx !== null);
  };

  const matches = getMatches();
  const shareLink = 'https://whenrufree.com/schedule/alice-m';

  return (
    <div className={`${lato.className} min-h-screen bg-black text-white selection:bg-purple-500/30`}>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none" />

      <header
        className={`${roboto.className} backdrop-blur-sm border-b border-purple-700 sticky top-0 z-50`}
        style={{ background: '#3b0764' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.35rem)' }}>
              whenRUfree
            </span>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                className="font-semibold text-purple-100 tracking-wider"
                style={{ fontSize: 'clamp(0.95rem, 1vw, 1rem)', textAlign: 'center' }}
              >
                Copy this link to share when you are free
              </span>
              <div
                className="bg-black border border-white/10 rounded px-3 py-1.5 font-mono text-xs text-purple-200 select-all"
                style={{
                  minWidth: '30rem',
                  maxWidth: '50vw',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {shareLink}
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(shareLink)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors mb-[1px]"
            >
              Copy
            </button>
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

      <nav className="bg-[#2d053f]/90 backdrop-blur-sm border-b border-purple-800 sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-300 py-3">
            <li>
              <a href="#" className="text-white border-b-2 border-purple-400 pb-1">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white pb-1 border-b-2 border-transparent hover:border-purple-400 transition">
                Availability
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white pb-1 border-b-2 border-transparent hover:border-purple-400 transition">
                Settings
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4 mb-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                Find Times That Work for Everyone
              </h2>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <PeoplePicker people={PEOPLE} selectedIds={selectedIds} setSelectedIds={setSelectedIds} maxSelection={MAX_SELECTION} />

            {/* FIXED CONTROLS ROW */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              {/* Date Selector - 60% width, centered content */}
              <div className="flex items-center bg-black border border-white/20 rounded-xl px-4 py-2 md:w-[60%] h-[52px]">
                <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-white/10 rounded-full transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-bold mx-4 flex-1 text-center text-lg">
                  {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button onClick={() => navigateDate(1)} className="p-2 hover:bg-white/10 rounded-full transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Other Controls - 40% width, flex-row to prevent collapsing */}
              <div className="flex items-center gap-3 md:w-[40%] h-[52px]">
                {/* View Selector */}
                <div className="flex bg-black border border-white/20 rounded-xl p-1 flex-[1.5] h-full items-center">
                  {(['day', 'week', 'month'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => handleViewChange(v)}
                      className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-bold text-xs transition-all h-full ${
                        view === v ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                      {(v === 'week' || v === 'month') && !isPro && <Lock className="w-3 h-3 text-gray-400/80" />}
                    </button>
                  ))}
                </div>

                {/* Timezone Selector */}
                <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-black border border-white/20 rounded-xl px-3 py-2 flex-1 h-full">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <select
                    value={selectedTz}
                    onChange={e => setSelectedTz(e.target.value)}
                    className="bg-transparent text-xs text-gray-300 font-medium focus:outline-none cursor-pointer w-full"
                  >
                    <option value="EST" className="bg-black">EST</option>
                    <option value="IST" className="bg-black">IST</option>
                    <option value="GMT" className="bg-black">GMT</option>
                    <option value="PST" className="bg-black">PST</option>
                    <option value="AEST" className="bg-black">AEST</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Centered Toggle Row */}
            <div className="flex justify-center mt-6">
              <div className="inline-flex bg-white/10 p-1 rounded-lg border border-white/20">
                <button
                  onClick={() => setDisplayMode('full')}
                  className={`px-6 py-2 rounded-md text-xs font-bold transition-all ${displayMode === 'full' ? 'bg-white/20 text-white' : 'text-gray-400'}`}
                >
                  Full Day
                </button>
                <button
                  onClick={() => setDisplayMode('free')}
                  className={`px-6 py-2 rounded-md text-xs font-bold transition-all ${displayMode === 'free' ? 'bg-white/20 text-white' : 'text-gray-400'}`}
                >
                  Free Only
                </button>
              </div>
            </div>

            {(view === 'week' || view === 'month') && !isPro && (
              <div className="flex justify-center mt-4">
                <UpgradeToProCard
                  text={`The ${view} view is a Pro feature. Upgrade to Pro to unlock it.`}
                  actionLabel="Upgrade"
                  onAction={() => {}}
                />
              </div>
            )}
          </div>

          <section className="relative z-10">
            {view === 'day' && (
              <div
                className={`grid grid-cols-1 gap-8 ${
                  selectedIds.length > 1 ? `md:grid-cols-2 lg:grid-cols-${selectedIds.length}` : ''
                }`}
              >
                {selectedPeople.map(person => (
                  <div key={person.id} className="space-y-4">
                    <div className="pb-2 border-b border-white/10">
                      <h3 className="font-bold text-lg">{person.name}</h3>
                    </div>
                    <div className="space-y-2">
                      {person.schedule[dayIdx].map((slot, i) => {
                        const isMatch = matches.includes(i);
                        return (
                          <div
                            key={i}
                            className={`group relative border rounded-xl p-4 transition-all border-l-4 ${
                              slot.free
                                ? 'bg-emerald-600/10 border-emerald-600/30 border-l-emerald-600'
                                : 'bg-white/5 border-white/5 border-l-gray-700 opacity-40'
                            }`}
                          >
                            {isMatch && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-md shadow-lg z-10 flex items-center gap-1">
                                MATCH
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm">{formatTimeSlot(slot.time)}</span>
                              <span className={`text-[10px] font-black uppercase ${slot.free ? 'text-emerald-400' : 'text-gray-500'}`}>
                                {slot.free ? 'Free' : 'Busy'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}