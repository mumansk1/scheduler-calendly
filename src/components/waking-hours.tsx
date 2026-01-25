'use client';

import React, { useState } from 'react';
import TimeSlot from '@/components/time-slot';

const WEEK_DAYS_FULL = [
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
  { short: 'Sun', full: 'Sunday' },
];

export default function WakingHours() {
  const OPTIONS = ['Entire Week', 'Weekdays & Weekend'] as const;
  type Option = typeof OPTIONS[number];

  const [option, setOption] = useState<Option>('Entire Week');

  // Entire Week: one time slot per day
  const [entireWeekTimes, setEntireWeekTimes] = useState(
    WEEK_DAYS_FULL.map((d) => ({
      day: d.full,
      start: '6:30 AM',
      end: '10:30 PM',
    }))
  );

  // Weekdays & Weekend grouped times
  const [weekdaysTime, setWeekdaysTime] = useState({ start: '6:30 AM', end: '10:30 PM' });
  const [weekendTime, setWeekendTime] = useState({ start: '8:00 AM', end: '11:00 PM' });

  // Mobile expand/collapse state: collapsed by default on mobile
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);
  const [weekdaysExpanded, setWeekdaysExpanded] = useState(false);
  const [weekendExpanded, setWeekendExpanded] = useState(false);

  // Handlers for TimeSlot changes
  const handleEntireWeekChange = (index: number, start: string, end: string) => {
    setEntireWeekTimes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], start, end };
      return next;
    });
  };

  const daySummary = (i: number) => `${entireWeekTimes[i].start} — ${entireWeekTimes[i].end}`;

  return (
    <section className="mb-8 bg-[#1f1724] rounded-xl p-4 max-w-full">
      {/* Tabs */}
      <div className="flex gap-3 mb-4 flex-wrap justify-center">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setOption(opt)}
            className={`px-4 py-2 rounded-md text-sm font-medium min-w-[120px] text-center ${
              option === opt ? 'bg-brandPurpleButton text-white' : 'bg-gray-800 text-gray-300'
            }`}
            aria-pressed={option === opt}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* ENTIRE WEEK */}
        {option === 'Entire Week' && (
          <>
            {/* On small screens: compact accordion list */}
            <ul className="sm:hidden divide-y divide-white/5 rounded-md overflow-hidden">
              {entireWeekTimes.map(({ day, start, end }, i) => {
                const expanded = expandedDayIndex === i;
                return (
                  <li key={day} className="bg-[#171520]">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-3 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      aria-expanded={expanded}
                      aria-controls={`day-panel-${i}`}
                      onClick={() => setExpandedDayIndex((prev) => (prev === i ? null : i))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 text-sm font-semibold text-gray-200">{WEEK_DAYS_FULL[i].short}</div>
                        <div className="text-sm text-gray-300 truncate">{day}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-400">{`${start} — ${end}`}</div>
                        <svg
                          className={`w-4 h-4 text-gray-400 transform transition-transform ${expanded ? 'rotate-180' : 'rotate-0'}`}
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M6 8l4 4 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>

                    <div
                      id={`day-panel-${i}`}
                      className={`px-4 pb-4 ${expanded ? 'block' : 'hidden'}`}
                      aria-hidden={!expanded}
                    >
                      <div className="mt-2">
                        <TimeSlot
                          label={day}
                          start={start}
                          end={end}
                          onChange={(s, e) => handleEntireWeekChange(i, s, e)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* On larger screens: show all TimeSlots in a grid */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {entireWeekTimes.map(({ day, start, end }, i) => (
                <TimeSlot
                  key={day}
                  label={day}
                  start={start}
                  end={end}
                  onChange={(s, e) => handleEntireWeekChange(i, s, e)}
                  className="w-full"
                />
              ))}
            </div>
          </>
        )}

        {/* WEEKDAYS & WEEKEND */}
        {option === 'Weekdays & Weekend' && (
          <div className="space-y-4">
            {/* Weekdays panel */}
            <div className="bg-[#171520] rounded-md overflow-hidden">
              {/* Header - collapsible on mobile */}
              <button
                type="button"
                onClick={() => setWeekdaysExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 sm:py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-expanded={weekdaysExpanded}
                aria-controls="weekdays-panel"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-200">Weekdays (Mon–Fri)</div>
                  <div className="text-xs text-gray-400 hidden sm:block">{`${weekdaysTime.start} — ${weekdaysTime.end}`}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400 sm:hidden">{`${weekdaysTime.start} — ${weekdaysTime.end}`}</div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transform transition-transform ${weekdaysExpanded ? 'rotate-180' : 'rotate-0'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M6 8l4 4 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              <div
                id="weekdays-panel"
                className={`px-4 pb-4 ${weekdaysExpanded ? 'block' : 'hidden'} sm:block`}
                aria-hidden={!weekdaysExpanded && typeof window !== 'undefined' ? false : undefined}
              >
                <div className="mt-2">
                  <TimeSlot
                    label="Weekdays (Mon–Fri)"
                    start={weekdaysTime.start}
                    end={weekdaysTime.end}
                    onChange={(s, e) => setWeekdaysTime({ start: s, end: e })}
                    className="w-full max-w-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Weekend panel */}
            <div className="bg-[#171520] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setWeekendExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 sm:py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-expanded={weekendExpanded}
                aria-controls="weekend-panel"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-200">Weekend (Sat–Sun)</div>
                  <div className="text-xs text-gray-400 hidden sm:block">{`${weekendTime.start} — ${weekendTime.end}`}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400 sm:hidden">{`${weekendTime.start} — ${weekendTime.end}`}</div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transform transition-transform ${weekendExpanded ? 'rotate-180' : 'rotate-0'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M6 8l4 4 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              <div id="weekend-panel" className={`px-4 pb-4 ${weekendExpanded ? 'block' : 'hidden'} sm:block`}>
                <div className="mt-2">
                  <TimeSlot
                    label="Weekend (Sat–Sun)"
                    start={weekendTime.start}
                    end={weekendTime.end}
                    onChange={(s, e) => setWeekendTime({ start: s, end: e })}
                    className="w-full max-w-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}