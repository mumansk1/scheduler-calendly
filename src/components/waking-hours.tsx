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

  // Handlers for TimeSlot changes
  const handleEntireWeekChange = (index: number, start: string, end: string) => {
    setEntireWeekTimes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], start, end };
      return next;
    });
  };

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
        {option === 'Entire Week' &&
          entireWeekTimes.map(({ day, start, end }, i) => (
            <TimeSlot
              key={day}
              label={day}
              start={start}
              end={end}
              onChange={(s, e) => handleEntireWeekChange(i, s, e)}
              className="w-full max-w-md mx-auto"
            />
          ))}

        {option === 'Weekdays & Weekend' && (
          <>
            <TimeSlot
              label="Weekdays (Mon–Fri)"
              start={weekdaysTime.start}
              end={weekdaysTime.end}
              onChange={(s, e) => setWeekdaysTime({ start: s, end: e })}
              className="w-full max-w-md mx-auto"
            />
            <TimeSlot
              label="Weekend (Sat–Sun)"
              start={weekendTime.start}
              end={weekendTime.end}
              onChange={(s, e) => setWeekendTime({ start: s, end: e })}
              className="w-full max-w-md mx-auto"
            />
          </>
        )}
      </div>
    </section>
  );
}