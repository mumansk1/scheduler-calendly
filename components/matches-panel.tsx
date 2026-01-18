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

  // Find slots where ALL selected people are free
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
    <div className="mt-6 overflow-auto">
      <h3 className="text-lg font-bold mb-4 text-center text-purple-300">
        There {matchingSlots.length === 1 ? 'is' : 'are'} {matchingSlots.length} match
        {matchingSlots.length === 1 ? '' : 'es'} when all of you are available
      </h3>

      <div className="min-w-[400px]">
        {/* Rows: One big pill per matching slot spanning all columns */}
        <div className="space-y-4">
          {matchingSlots.map(idx => {
            const timeRange = formatTimeRange(allSlots[idx].time);
            const isSelected = selectedSlotIdx === idx;
            return (
              <div key={idx} className="flex justify-center">
                <button
                  onClick={() => setSelectedSlotIdx(idx)}
                  className={`w-full max-w-[600px] px-6 py-3 rounded-full text-lg font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500
                    ${isSelected ? 'bg-emerald-500 text-white shadow-lg' : 'bg-emerald-500/80 text-white hover:bg-emerald-600'}
                  `}
                  aria-pressed={isSelected}
                  aria-label={`Match available at ${timeRange}`}
                >
                  {timeRange}
                </button>
              </div>
            );
          })}
        </div>

        {/* Confirm button */}
        {selectedSlotIdx !== null && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleConfirm}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Confirm Match: {formatTimeRange(allSlots[selectedSlotIdx].time)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}