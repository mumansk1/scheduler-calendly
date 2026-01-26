// src/components/calendar-navigator.tsx
'use client';
import React, { useState } from 'react';
type CalendarNavigatorProps = {
  className?: string;
};

// Helper function to format date as "Wednesday, January 3rd, 2026"
const formatDateWithOrdinal = (date: Date): string => {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const year = date.getFullYear();
  return `${dayOfWeek}, ${month} ${day}${getOrdinal(day)}, ${year}`;
};

export default function CalendarNavigator({ className = '' }: CalendarNavigatorProps) {
  const [calendarDate, setCalendarDate] = useState(new Date());

  const goPrevDay = () => setCalendarDate(prev => new Date(prev.getTime() - 24 * 60 * 60 * 1000));
  const goNextDay = () => setCalendarDate(prev => new Date(prev.getTime() + 24 * 60 * 60 * 1000));

  return (
    // keep vertical spacing tight (mt-0 mb-0) but make controls visually larger
    <div className={`max-w-7xl mx-auto px-6 mt-0 mb-0 flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-0 text-white font-bold text-xl select-none">
        <button
          onClick={goPrevDay}
          aria-label="Previous day"
          // wider button with reduced internal padding
          className="w-14 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-2xl p-1"
        >
          ‹
        </button>

        <div className="min-w-[320px] text-center">
          {formatDateWithOrdinal(calendarDate)}
        </div>

        <button
          onClick={goNextDay}
          aria-label="Next day"
          className="w-14 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-2xl p-1"
        >
          ›
        </button>
      </div>
    </div>
  );
}