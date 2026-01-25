'use client';

import React, { useEffect, useState } from 'react';

type TimeSlotProps = {
  label: string; // e.g. "Monday", "Weekdays (Mon–Fri)"
  start: string; // 12-hour format e.g. "6:30 AM"
  end: string; // 12-hour format e.g. "10:30 PM"
  onChange: (start: string, end: string) => void;
  className?: string; // optional container className
};

function to24Hour(time12h: string): string {
  if (!time12h) return '';
  const m = time12h.match(/^\s*(\d{1,2}):(\d{2})\s*([AaPp][Mm])\s*$/);
  if (!m) return '';
  let hh = parseInt(m[1], 10);
  const mm = m[2];
  const ampm = m[3].toUpperCase();
  if (ampm === 'AM' && hh === 12) hh = 0;
  if (ampm === 'PM' && hh !== 12) hh += 12;
  return `${String(hh).padStart(2, '0')}:${mm}`;
}

function to12Hour(time24: string): string {
  if (!time24) return '';
  const m = time24.match(/^\s*(\d{1,2}):(\d{2})\s*$/);
  if (!m) return '';
  let hh = parseInt(m[1], 10);
  const mm = m[2];
  const ampm = hh >= 12 ? 'PM' : 'AM';
  if (hh === 0) hh = 12;
  else if (hh > 12) hh -= 12;
  return `${hh}:${mm} ${ampm}`;
}

export default function TimeSlot({
  label,
  start,
  end,
  onChange,
  className = '',
}: TimeSlotProps) {
  // Convert incoming 12-hour props to 24-hour for native <input type="time">
  const [isEditing, setIsEditing] = useState(false);
  const [editStart, setEditStart] = useState(to24Hour(start));
  const [editEnd, setEditEnd] = useState(to24Hour(end));

  // Keep internal edit values in sync if parent props change
  useEffect(() => {
    setEditStart(to24Hour(start));
  }, [start]);

  useEffect(() => {
    setEditEnd(to24Hour(end));
  }, [end]);

  const onSave = () => {
    // Convert back to 12-hour for parent callback
    onChange(to12Hour(editStart), to12Hour(editEnd));
    setIsEditing(false);
  };

  const onCancel = () => {
    setEditStart(to24Hour(start));
    setEditEnd(to24Hour(end));
    setIsEditing(false);
  };

  // Safe id (no spaces)
  const safeId = (prefix: string) =>
    `${prefix}-${label.replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-]/g, '')}`;

  return (
    <div
      className={`bg-gray-800 rounded p-3 gap-3 ${className} flex flex-col sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="text-gray-300 font-semibold w-full sm:w-44 whitespace-nowrap mb-2 sm:mb-0">
        {label}
      </div>

      {isEditing ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-full">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="sr-only" htmlFor={safeId('start')}>
              {label} start time
            </label>
            <input
              id={safeId('start')}
              type="time"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
              className="bg-transparent border border-purple-600 rounded px-2 py-1 text-white w-full sm:w-28 focus:outline-none"
            />

            <span className="text-gray-400 mx-2 hidden sm:inline">–</span>

            <label className="sr-only" htmlFor={safeId('end')}>
              {label} end time
            </label>
            <input
              id={safeId('end')}
              type="time"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
              className="bg-transparent border border-purple-600 rounded px-2 py-1 text-white w-full sm:w-28 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 justify-end mt-3 sm:mt-0">
            <button
              onClick={onSave}
              className="text-sm px-3 py-1 rounded-md bg-purple-700 text-white"
              aria-label={`Save ${label} time`}
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="text-sm px-3 py-1 rounded-md bg-gray-700 text-gray-200"
              aria-label={`Cancel edit ${label}`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-3">
            <div className="text-white w-28 text-center">{start || '—'}</div>
            <span className="text-gray-400 mx-1">–</span>
            <div className="text-white w-28 text-center">{end || '—'}</div>
          </div>

          <div className="ml-0 sm:ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-purple-400 hover:underline"
              aria-label={`Edit ${label} time`}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}