'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck,
  ChevronDown,
  Globe,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Crown,
  Calendar,
  Clock,
  Settings,
  LogOut,
  Users
} from 'lucide-react';

// --- Types & Mock Data ---
type Slot = { time: string; free: boolean };
type Person = { id: string; name: string; country: string; schedule: Slot[][] };

const MAX_SELECTION = 3;

const PEOPLE: Person[] = [
  { id: 'alice', name: 'Alice Martinez', country: '🇺🇸 USA (EST)', schedule: Array(7).fill(null).map(() => Array.from({length: 24}, (_, h) => ({ time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`, free: ![9, 10, 14, 15].includes(h) }))) },
  { id: 'bob', name: 'Bob Johnson', country: '🇮🇳 India (IST)', schedule: Array(7).fill(null).map(() => Array.from({length: 24}, (_, h) => ({ time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`, free: ![10, 11, 15, 16].includes(h) }))) },
  { id: 'carol', name: 'Carol Smith', country: '🇬🇧 UK (GMT)', schedule: Array(7).fill(null).map(() => Array.from({length: 24}, (_, h) => ({ time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`, free: ![9, 13, 14].includes(h) }))) },
  { id: 'david', name: 'David Wilson', country: '🇺🇸 USA (West) (PST)', schedule: Array(7).fill(null).map(() => Array.from({length: 24}, (_, h) => ({ time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`, free: ![8, 9, 15].includes(h) }))) },
  { id: 'emma', name: 'Emma Thompson', country: '🇦🇺 Australia (AEST)', schedule: Array(7).fill(null).map(() => Array.from({length: 24}, (_, h) => ({ time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`, free: ![10, 11, 15, 16].includes(h) }))) },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 13));
  const [selectedTz, setSelectedTz] = useState('EST');
  const [selectedIds, setSelectedIds] = useState<string[]>(['alice']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [displayMode, setDisplayMode] = useState<'full' | 'free'>('full');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === 'loading' || !session) return <div className="min-h-screen bg-black" />;

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + direction);
    else if (view === 'week') newDate.setDate(newDate.getDate() + (direction * 7));
    else newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectedPeople = PEOPLE.filter(p => selectedIds.includes(p.id));
  const dayIdx = currentDate.getDay();

  const formatTimeSlot = (startTime: string) => {
    const [time, period] = startTime.split(' ');
    const [hours] = time.split(':').map(Number);
    const nextHour = (hours % 12) + 1;
    const nextPeriod = (hours + 1) >= 12 && (hours + 1) < 24 ? 'PM' : 'AM';
    return `${time} ${period} - ${nextHour === 0 ? 12 : nextHour}:00 ${nextPeriod}`;
  };

  // Helper to find matches (free slots common to all selected people)
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-transparent border-r border-white/10 z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-xl tracking-tight">whenRUfree</span>
          </div>
          <nav className="space-y-1">
            <NavItem icon={<Calendar />} label="Dashboard" active />
            <NavItem icon={<Clock />} label="Availability" />
            <NavItem icon={<Users />} label="Meetings" badge="3" />
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition"><LogOut className="w-4 h-4" />Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 relative min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header / Selectors Area */}
          <div className="space-y-6 mb-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">Find Shared Availability</h2>
              <p className="text-gray-400 text-sm">Compare schedules and find the perfect slot.</p>
            </div>

            {/* Stretched Selectors */}
            <div className="grid grid-cols-1 gap-4">
              {/* People Dropdown */}
              <div className="relative w-full" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-black border border-white/20 rounded-xl px-5 py-4 font-bold hover:border-white/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="text-purple-400 w-5 h-5" />
                    <span>{selectedIds.length === 0 ? 'Select people' : selectedPeople.map(p => {
                      const names = p.name.split(' ');
                      const firstName = names[0];
                      const lastInitial = names.length > 1 ? names[1][0] + '.' : '';
                      return `${firstName} ${lastInitial}`;
                    }).join(' & ')}</span>
                  </div>
                  <ChevronDown className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-black border border-white/20 rounded-xl shadow-2xl p-2">
                    {PEOPLE.map(person => (
                      <label key={person.id} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors ${selectedIds.length >= MAX_SELECTION && !selectedIds.includes(person.id) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(person.id)} 
                          onChange={() => {
                            if (selectedIds.includes(person.id)) {
                              setSelectedIds(prev => prev.filter(i => i !== person.id));
                            } else if (selectedIds.length < MAX_SELECTION) {
                              setSelectedIds(prev => [...prev, person.id]);
                            }
                          }} 
                          disabled={selectedIds.length >= MAX_SELECTION && !selectedIds.includes(person.id)}
                          className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500" 
                        />
                        <span className="font-semibold flex-1">{person.name}</span>
                        <span className="text-xs text-gray-400">{person.country}</span>
                      </label>
                    ))}
                    {selectedIds.length >= MAX_SELECTION && (
                      <div className="mt-2 p-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-red-500 font-semibold">
                          <Crown className="w-4 h-4" />
                          Maximum 3 people can be selected. Upgrade to Pro to add more.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Date, View & Timezone Controls in one row */}
              <div className="flex flex-col md:flex-row items-stretch gap-4 w-full">
                <div className="flex items-center bg-black border border-white/20 rounded-xl px-4 py-2 flex-[2]">
                  <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="font-bold text-lg mx-4 whitespace-nowrap flex-1 text-center">{currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button onClick={() => navigateDate(1)} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronRight className="w-5 h-5" /></button>
                </div>

                <div className="flex bg-black border border-white/20 rounded-xl p-1 flex-[1.5]">
                  {(['day', 'week', 'month'] as const).map((v) => (
                    <button key={v} onClick={() => setView(v)} className={`flex-1 px-2 py-2 rounded-lg font-bold text-xs transition-all ${view === v ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-black border border-white/20 rounded-xl px-3 py-2 whitespace-nowrap flex-1">
                  <Globe className="w-4 h-4" />
                  <select
                    value={selectedTz}
                    onChange={(e) => setSelectedTz(e.target.value)}
                    className="bg-transparent text-xs text-gray-300 font-medium focus:outline-none cursor-pointer hover:text-purple-400 transition-colors w-full h-full"
                  >
                    <option value="EST" className="bg-black">EST (New York)</option>
                    <option value="IST" className="bg-black">IST (Mumbai)</option>
                    <option value="GMT" className="bg-black">GMT (London)</option>
                    <option value="PST" className="bg-black">PST (Los Angeles)</option>
                    <option value="AEST" className="bg-black">AEST (Sydney)</option>
                  </select>
                </div>
              </div>

              {/* Mode Toggle - smaller and closer */}
              <div className="flex justify-end items-center gap-3 mt-2">
                <div className="inline-flex bg-white/10 p-1 rounded-lg border border-white/20">
                  <button onClick={() => setDisplayMode('full')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${displayMode === 'full' ? 'bg-white/20 text-white' : 'text-gray-400'}`}>Full Day</button>
                  <button onClick={() => setDisplayMode('free')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${displayMode === 'free' ? 'bg-white/20 text-white' : 'text-gray-400'}`}>Free Only</button>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Grid */}
          <section className="relative z-10">
            {view === 'day' ? (
              <div className={`grid grid-cols-1 gap-6 ${selectedIds.length > 1 ? 'md:grid-cols-2 lg:grid-cols-' + selectedIds.length : ''}`}>
                {selectedPeople.map(person => (
                  <div key={person.id} className="space-y-4">
                    <div className="pb-2 border-b border-white/10">
                      <h3 className="font-bold text-lg">{person.name}</h3>
                      <p className="text-xs text-gray-400 font-medium">{person.country} • {selectedTz}</p>
                    </div>

                    {displayMode === 'full' ? (
                      <div className="space-y-2">
                        {person.schedule[dayIdx].map((slot, i) => {
                          const isMatch = matches.includes(i);
                          return (
                            <div key={i} className={`group relative border rounded-xl p-4 transition-all border-l-4 ${slot.free ? 'bg-emerald-600/10 border-emerald-600/30 border-l-emerald-600' : 'bg-white/5 border-white/5 border-l-gray-700 opacity-40'}`}>
                              {isMatch && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-md shadow-lg z-10 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> MATCH
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm">{formatTimeSlot(slot.time)}</span>
                                <span className={`text-[10px] font-black uppercase ${slot.free ? 'text-emerald-400' : 'text-gray-500'}`}>{slot.free ? 'Free' : 'Busy'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({length: 25}).map((_, i) => {
                          const freeSlots = person.schedule[dayIdx].filter(s => s.free);
                          const slot = freeSlots[i];
                          const isMatch = slot && matches.includes(person.schedule[dayIdx].indexOf(slot));
                          return (
                            <div key={i} className={`aspect-square rounded-lg border flex items-center justify-center p-1 text-center transition-all ${slot ? 'bg-emerald-600/20 border-emerald-600/40' : 'bg-white/5 border-white/5 opacity-20'}`}>
                              {isMatch && (
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg z-10 flex items-center gap-1">
                                  <CheckCircle2 className="w-2 h-2" />
                                </div>
                              )}
                              {slot && <span className="text-[9px] font-bold leading-tight">{slot.time.replace(':00', '')}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                <Crown className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-gray-400 text-sm mb-6">Unlock {view} views and unlimited comparisons.</p>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold hover:bg-purple-700 transition">Upgrade Now</button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string; }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <span className="w-5 h-5">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">{badge}</span>}
    </button>
  );
}