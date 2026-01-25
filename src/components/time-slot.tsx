'use client';

import React, { useState } from 'react';

type TimeSlotProps = {
  label: string; // e.g. "Monday", "Weekdays (Mon–Fri)"
  start: string; // 12-hour format e.g. "6:30 AM"
  end: string;   // 12-hour format e.g. "10:30 PM"
  onChange: (start: string, end: string) => void;
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

export default function TimeSlot({ label, start, end, onChange }: TimeSlotProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editStart, setEditStart] = useState(to24Hour(start));
  const [editEnd, setEditEnd] = useState(to24Hour(end));

  const onSave = () => {
    onChange(to12Hour(editStart), to12Hour(editEnd));
    setIsEditing(false);
  };

  const onCancel = () => {
    setEditStart(to24Hour(start));
    setEditEnd(to24Hour(end));
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 rounded p-3 gap-3">
      <div className="text-gray-300 font-semibold w-44 whitespace-nowrap">{label}</div>

      {isEditing ? (
        <>
          <label className="sr-only" htmlFor={`start-${label}`}>
            {label} start time
          </label>
          <input
            id={`start-${label}`}
            type="time"
            value={editStart}
            onChange={(e) => setEditStart(e.target.value)}
            className="bg-transparent border border-purple-600 rounded px-2 py-1 text-white w-28 focus:outline-none"
          />

          <span className="text-gray-400 mx-2">–</span>

          <label className="sr-only" htmlFor={`end-${label}`}>
            {label} end time
          </label>
          <input
            id={`end-${label}`}
            type="time"
            value={editEnd}
            onChange={(e) => setEditEnd(e.target.value)}
            className="bg-transparent border border-purple-600 rounded px-2 py-1 text-white w-28 focus:outline-none"
          />

          <div className="flex items-center gap-2 ml-4">
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
        </>
      ) : (
        <>
          <div className="text-white w-28 text-center">{start || '—'}</div>
          <span className="text-gray-400 mx-2">–</span>
          <div className="text-white w-28 text-center">{end || '—'}</div>

          <div className="ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-purple-400 hover:underline"
              aria-label={`Edit ${label} time`}
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
}