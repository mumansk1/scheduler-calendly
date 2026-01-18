'use client';

import React from 'react';

export type Person = {
  id: string;
  firstName: string;
  lastName?: string;
  countryCode?: string;
  countryName?: string;
  timezoneAbbr?: string;
};

type PeoplePickerProps = {
  people: Person[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  showFlags?: boolean;
};

const countryCodeToFlagEmoji = (code?: string) => {
  if (!code) return '';
  return code
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
};

export default function PeoplePicker({
  people,
  selectedIds,
  onToggle,
  showFlags = true,
}: PeoplePickerProps) {
  return (
    <div
      role="list"
      aria-label="Select participants"
      /* 
         Removed the heavy outer border and background.
         Using flex-wrap so it naturally stacks on mobile.
         Added gap-4 for professional breathing room between pills.
      */
      className="flex flex-wrap items-center justify-center gap-3 md:gap-4 w-full py-2"
    >
      {people.map((person, i) => {
        const isSelected = selectedIds.includes(person.id);
        const isOwner = i === 0;
        const firstInitial = person.lastName ? person.lastName[0] : '';
        const displayName = `${person.firstName}${firstInitial ? ' ' + firstInitial + '.' : ''}${isOwner ? ' (You)' : ''}`;

        return (
          <button
            key={person.id}
            role="listitem"
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(person.id)}
            /* 
               Professional Pill Design:
               - Individual rounded-full shapes.
               - Subtle border when not selected.
               - High-quality gradient and glow when selected.
            */
            className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-200 border-2 shadow-sm active:scale-95 ${
              isSelected
                ? 'bg-gradient-to-r from-purple-600 to-emerald-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <span className="font-bold text-sm whitespace-nowrap">
              {displayName}
            </span>

            <div className="flex items-center gap-2 whitespace-nowrap border-l border-white/10 pl-2">
              {showFlags && person.countryCode && (
                <span
                  aria-label={person.countryName}
                  role="img"
                  className="text-base select-none"
                >
                  {countryCodeToFlagEmoji(person.countryCode)}
                </span>
              )}

              {person.timezoneAbbr && (
                <span className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                  {person.timezoneAbbr}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}