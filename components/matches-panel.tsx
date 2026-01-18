'use client';

import React, { useState } from 'react';
import type { Person } from '@/data/mock-data';

type MatchesPanelProps = {
  people: Person[];
  selectedIds: string[];
  dayIndex: number;
  onConfirm?: (timeRange: string) => void;
};

export default function MatchesPanel({ people, selectedIds, dayIndex, onConfirm }: MatchesPanelProps) {
  const selectedPeople = people.filter(p => selectedIds.includes(p.id));
  const allSlots = selectedPeople[0]?.schedule[dayIndex] || [];

  const formatTimeRange = (startTime: string) => {
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const nextHour24 = (hours % 12) + 1;
    const nextPeriod = hours + 1 >= 12 && hours + 1 < 24 ? 'PM' : 'AM';

    const formatHour = (h: number) => {
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${minutes.toString().padStart(2, '0')}`;
    };

    const startFormatted = `${formatHour(hours)} ${period.toLowerCase()}.`;
    const endFormatted = `${formatHour(nextHour24)} ${nextPeriod.toLowerCase()}.`;

    return `${startFormatted} - ${endFormatted}`;
  };

  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null);

  const matchingSlots = allSlots
    .map((slot, idx) => {
      const allFree = selectedPeople.every(p => p.schedule[dayIndex][idx]?.free);
      return allFree ? idx : null;
    })
    .filter((idx): idx is number => idx !== null);

  if (matchingSlots.length === 0) {
    return (
      <div className="rounded-md bg-white/5 border border-white/6 p-6 text-center text-gray-300 mt-6">
        <div className="text-xl font-semibold mb-2">No matches found</div>
        <div className="text-sm">There are no time slots today where all selected people are free.</div>
      </div>
    );
  }

  const handleConfirm = () => {
    if (selectedSlotIdx === null) return;
    const timeRange = formatTimeRange(allSlots[selectedSlotIdx].time);
    onConfirm?.(timeRange);
  };

  return (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-bold mb-6 text-center text-purple-300 px-4">
        There {matchingSlots.length === 1 ? 'is' : 'are'} {matchingSlots.length} match
        {matchingSlots.length === 1 ? '' : 'es'} when all of you are available
      </h3>

      <div className="space-y-3 max-w-2xl mx-auto px-2">
        {matchingSlots.map(idx => {
          const timeRange = formatTimeRange(allSlots[idx].time);
          const isSelected = selectedSlotIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedSlotIdx(idx)}
              className={`w-full px-4 py-4 rounded-2xl text-base md:text-lg font-bold transition-all border-2 flex items-center justify-center
                ${isSelected 
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-[1.02]' 
                  : 'bg-white/5 border-white/10 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5'}
              `}
              aria-pressed={isSelected}
            >
              {timeRange}
            </button>
          );
        })}
      </div>

      {selectedSlotIdx !== null && (
        <div className="mt-8 flex justify-center px-4">
          <button
            onClick={handleConfirm}
            className="w-full max-w-md bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-purple-900/40 active:scale-95"
          >
            Confirm Match: {formatTimeRange(allSlots[selectedSlotIdx].time)}
          </button>
        </div>
      )}
    </div>
  );
}