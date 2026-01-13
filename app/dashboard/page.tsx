'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Bolt, 
  CalendarCheck, 
  ChevronDown, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  CheckCircle2,
  Sparkles,
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

const MAX_SELECTION = 4;
const TZ_OFFSETS: Record<string, number> = { 'EST': 0, 'IST': 10.5, 'GMT': 5, 'PST': -3, 'AEST': 16 };

const PEOPLE: Person[] = [
  { id: 'alice', name: 'Alice (You)', country: '🇺🇸 USA', schedule: Array(7).fill([{time: "09:00 AM", free: true}, {time: "01:00 PM", free: true}]) },
  { id: 'bob', name: 'Bob', country: '🇮🇳 India', schedule: Array(7).fill([{time: "09:00 AM", free: true}, {time: "01:00 PM", free: false}]) },
  { id: 'carol', name: 'Carol', country: '🇬🇧 UK', schedule: Array(7).fill([{time: "09:00 AM", free: true}, {time: "01:00 PM", free: true}]) },
  { id: 'david', name: 'David', country: '🇺🇸 USA (West)', schedule: Array(7).fill([{time: "09:00 AM", free: true}, {time: "01:00 PM", free: false}]) },
  { id: 'emma', name: 'Emma', country: '🇦🇺 Australia', schedule: Array(7).fill([{time: "09:00 AM", free: false}, {time: "01:00 PM", free: true}]) },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 13));
  const [selectedTz, setSelectedTz] = useState('EST');
  const [selectedIds, setSelectedIds] = useState<string[]>(['alice', 'bob']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

  // Auth check
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  // --- Logic ---
  const convertTime = (timeStr: string, targetTz: string) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    hours += TZ_OFFSETS[targetTz];
    if (hours >= 24) hours -= 24;
    if (hours < 0) hours += 24;
    const newPeriod = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${newPeriod}`;
  };

  const togglePerson = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < MAX_SELECTION) return [...prev, id];
      return prev;
    });
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + direction);
    else if (view === 'week') newDate.setDate(newDate.getDate() + (direction * 7));
    else newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectedPeople = PEOPLE.filter(p => selectedIds.includes(p.id));
  const dayIdx = currentDate.getDay();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/10 backdrop-blur-xl bg-black/50 z-50">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">WhenAreYouFree</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavItem icon={<Calendar />} label="Dashboard" active />
            <NavItem icon={<Clock />} label="Availability" />
            <NavItem icon={<Users />} label="Meetings" badge="3" />
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </div>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-semibold">
              {session.user?.name?.[0] || session.user?.email?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 relative min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            
            {/* Header Section */}
            <section className="border-b border-white/10 p-8 pb-6">
              <div className="max-w-[700px] mx-auto">
                <h2 className="text-2xl font-extrabold mb-5 text-center">Find Shared Availability</h2>
                
                {/* People Selector - Centered */}
                <div className="relative mb-4 max-w-md mx-auto">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-center bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 font-bold hover:bg-white/15 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarCheck className="text-purple-400 w-5 h-5" /> 
                      <span>
                        {selectedIds.length === 0 ? 'Select people' : 
                         `${selectedPeople.map(p => p.name.split(' ')[0]).join(' & ')}`}
                      </span>
                    </span>
                    <ChevronDown className={`text-gray-400 transition-transform ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-20 mt-2 w-full bg-black/90 border border-white/20 rounded-2xl shadow-xl p-3 backdrop-blur-xl">
                      <div className="max-w-[280px] mx-auto">
                        {PEOPLE.map(person => {
                          const isSelected = selectedIds.includes(person.id);
                          const isMaxed = selectedIds.length >= MAX_SELECTION && !isSelected;
                          return (
                            <label 
                              key={person.id}
                              className={`group flex items-center gap-3 p-2.5 rounded-xl transition-colors
                                ${isMaxed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}`}
                            >
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                disabled={isMaxed}
                                onChange={() => togglePerson(person.id)}
                                className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 flex-shrink-0"
                              />
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="font-semibold text-sm">{person.name}</span>
                                <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{person.country}</span>
                              </div>
                              {isMaxed && <span className="text-xs text-amber-400 font-bold whitespace-nowrap">Max 4</span>}
                            </label>
                          );
                        })}
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10 px-3 py-2 text-xs text-gray-400 text-center font-medium">
                        {selectedIds.length}/{MAX_SELECTION} selected
                      </div>
                      
                      {/* Upsell Banner */}
                      {selectedIds.length >= MAX_SELECTION && (
                        <div className="mt-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-3 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Crown className="w-4 h-4" />
                            <span className="font-bold text-sm">Upgrade to Pro</span>
                          </div>
                          <p className="text-xs opacity-90 mb-2">Compare unlimited schedules, unlock week & month views</p>
                          <button className="w-full bg-white text-purple-600 font-bold text-xs py-2 rounded-lg hover:bg-gray-100 transition-all">
                            Upgrade Now →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* View Toggle & Date Nav */}
                <div className="flex flex-col items-center">
                  <div className="inline-flex bg-white/10 p-1 rounded-2xl mb-3 border border-white/10">
                    {(['day', 'week', 'month'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                          view === v ? 'bg-white/20 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-xl mb-2 border border-white/10">
                    <button onClick={() => navigateDate(-1)} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight min-w-[280px] text-center">
                      {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </h1>
                    <button onClick={() => navigateDate(1)} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Timezone Selector - Small & Unobtrusive */}
                  <div className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                    <Globe className="w-3.5 h-3.5" />
                    <select 
                      value={selectedTz}
                      onChange={(e) => setSelectedTz(e.target.value)}
                      className="bg-transparent text-xs text-gray-300 font-medium focus:outline-none cursor-pointer hover:text-purple-400 transition-colors"
                    >
                      <option value="EST" className="bg-black">EST (New York)</option>
                      <option value="IST" className="bg-black">IST (Mumbai)</option>
                      <option value="GMT" className="bg-black">GMT (London)</option>
                      <option value="PST" className="bg-black">PST (Los Angeles)</option>
                      <option value="AEST" className="bg-black">AEST (Sydney)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison Grid */}
            <section className="p-8 pt-4">
              {view === 'day' ? (
                <div className={`grid grid-cols-1 gap-6 ${
                  selectedIds.length === 1 ? '' : 
                  selectedIds.length === 2 ? 'md:grid-cols-2' : 
                  selectedIds.length === 3 ? 'md:grid-cols-3' : 
                  'md:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {selectedPeople.map(person => (
                    <div key={person.id} className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-bold text-sm">{person.name}</h3>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{person.country}</p>
                      </div>
                      {person.schedule[dayIdx].map((slot, i) => {
                        const isMatch = selectedPeople.length > 1 && selectedPeople.every(p => p.schedule[dayIdx][i].free);
                        return (
                          <div key={i} className="relative">
                            {isMatch && slot.free && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-md shadow-lg z-10 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> MATCH
                              </div>
                            )}
                            <div className={`border rounded-2xl p-4 transition-all border-l-[6px] ${
                              slot.free 
                                ? 'bg-emerald-500/10 border-emerald-500/30 border-l-emerald-500' 
                                : 'bg-white/5 border-white/10 border-l-gray-600 opacity-60'
                            }`}>
                              <span className={`font-bold text-sm ${slot.free ? 'text-white' : 'text-gray-500'}`}>
                                {convertTime(slot.time, selectedTz)}
                              </span>
                              <div className={`text-[10px] font-black uppercase mt-1 ${slot.free ? 'text-emerald-400' : 'text-gray-500'}`}>
                                {slot.free ? 'Free' : 'Busy'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl border-2 border-dashed border-purple-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 mx-auto">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black mb-2">Unlock {view.charAt(0).toUpperCase() + view.slice(1)} View</h3>
                    <p className="text-gray-400 mb-4 max-w-sm mx-auto">
                      Upgrade to Pro to compare schedules across entire {view === 'week' ? 'weeks' : 'months'} and find the perfect meeting time faster.
                    </p>
                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                      <Crown className="w-4 h-4" />
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              )}
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? 'bg-white/10 text-white'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold">
          {badge}
        </span>
      )}
    </button>
  );
}