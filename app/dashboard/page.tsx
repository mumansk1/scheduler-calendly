'use client';

import React, { useState } from 'react';
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
  Crown
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

export default function ScheduleSync() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 13));
  const [selectedTz, setSelectedTz] = useState('EST');
  const [selectedIds, setSelectedIds] = useState<string[]>(['alice', 'bob']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

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
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Nav */}
        <nav className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Bolt className="text-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-indigo-600">ScheduleSync</span>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:shadow-sm transition-all">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="font-semibold text-sm text-slate-700">Alice</span>
          </button>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header Section */}
          <section className="bg-slate-50/50 border-b border-slate-100 p-8 pb-6">
            <div className="max-w-[700px] mx-auto">
              <h2 className="text-2xl font-extrabold mb-5 text-center">Find Shared Availability</h2>
              
              {/* People Selector - Centered */}
              <div className="relative mb-4 max-w-md mx-auto">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-center bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 font-bold hover:border-indigo-500 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <CalendarCheck className="text-indigo-600 w-5 h-5" /> 
                    <span>
                      {selectedIds.length === 0 ? 'Select people' : 
                       `${selectedPeople.map(p => p.name.split(' ')[0]).join(' & ')}`}
                    </span>
                  </span>
                  <ChevronDown className={`text-slate-400 transition-transform ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-3">
                    <div className="max-w-[280px] mx-auto">
                      {PEOPLE.map(person => {
                        const isSelected = selectedIds.includes(person.id);
                        const isMaxed = selectedIds.length >= MAX_SELECTION && !isSelected;
                        return (
                          <label 
                            key={person.id}
                            className={`group flex items-center gap-3 p-2.5 rounded-xl transition-colors
                              ${isMaxed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              disabled={isMaxed}
                              onChange={() => togglePerson(person.id)}
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                            />
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="font-semibold text-sm">{person.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{person.country}</span>
                            </div>
                            {isMaxed && <span className="text-xs text-amber-600 font-bold whitespace-nowrap">Max 4</span>}
                          </label>
                        );
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-2 text-xs text-slate-500 text-center font-medium">
                      {selectedIds.length}/{MAX_SELECTION} selected
                    </div>
                    
                    {/* Upsell Banner */}
                    {selectedIds.length >= MAX_SELECTION && (
                      <div className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-3 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <Crown className="w-4 h-4" />
                          <span className="font-bold text-sm">Upgrade to Pro</span>
                        </div>
                        <p className="text-xs opacity-90 mb-2">Compare unlimited schedules, unlock week & month views</p>
                        <button className="w-full bg-white text-indigo-600 font-bold text-xs py-2 rounded-lg hover:bg-indigo-50 transition-all">
                          Upgrade Now →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* View Toggle & Date Nav */}
              <div className="flex flex-col items-center">
                <div className="inline-flex bg-slate-100 p-1 rounded-2xl mb-3">
                  {(['day', 'week', 'month'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                        view === v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-xl mb-2">
                  <button onClick={() => navigateDate(-1)} className="w-10 h-10 rounded-full bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight min-w-[280px] text-center">
                    {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </h1>
                  <button onClick={() => navigateDate(1)} className="w-10 h-10 rounded-full bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Timezone Selector - Small & Unobtrusive */}
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <select 
                    value={selectedTz}
                    onChange={(e) => setSelectedTz(e.target.value)}
                    className="bg-transparent text-xs text-slate-600 font-medium focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <option value="EST">EST (New York)</option>
                    <option value="IST">IST (Mumbai)</option>
                    <option value="GMT">GMT (London)</option>
                    <option value="PST">PST (Los Angeles)</option>
                    <option value="AEST">AEST (Sydney)</option>
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
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{person.country}</p>
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
                              ? 'bg-emerald-50 border-emerald-300 border-l-emerald-500' 
                              : 'bg-slate-100 border-slate-200 border-l-slate-300 opacity-60'
                          }`}>
                            <span className={`font-bold text-sm ${slot.free ? 'text-slate-700' : 'text-slate-400'}`}>
                              {convertTime(slot.time, selectedTz)}
                            </span>
                            <div className={`text-[10px] font-black uppercase mt-1 ${slot.free ? 'text-emerald-600' : 'text-slate-400'}`}>
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
              <div className="text-center py-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-dashed border-indigo-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 mx-auto">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Unlock {view.charAt(0).toUpperCase() + view.slice(1)} View</h3>
                  <p className="text-slate-600 mb-4 max-w-sm mx-auto">
                    Upgrade to Pro to compare schedules across entire {view === 'week' ? 'weeks' : 'months'} and find the perfect meeting time faster.
                  </p>
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}