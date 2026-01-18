'use client';

import React from 'react';

type Person = {
  id: string;
  firstName: string;
  lastName?: string;
  countryCode?: string; // ISO 3166-1 alpha-2, e.g. 'US', 'IN', 'GB'
  countryName?: string;
  timezoneAbbr?: string; // e.g. 'EST', 'IST', 'GMT'
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

/**
 * Presentational PeoplePicker component — controlled via props.
 * Use this in the Dashboard like:
 * <PeoplePicker people={formattedPeople} selectedIds={selectedIds} onToggle={handleToggle} showFlags />
 */
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
      className="flex select-none rounded-lg border border-slate-700 bg-black/80 text-white"
      style={{ height: 56, minWidth: 320 }}
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
            className={`flex items-center justify-center flex-1 px-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isSelected
                ? 'bg-gradient-to-r from-purple-700 to-emerald-600 border border-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                : 'hover:bg-white/10 border border-transparent'
            }`}
            style={{
              borderLeft: i === 0 ? undefined : '1px solid #334155',
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="font-semibold text-sm truncate max-w-[140px] text-center">
                {displayName}
              </span>

              <div className="flex items-center gap-2 whitespace-nowrap">
                {showFlags && person.countryCode && (
                  <span
                    aria-label={person.countryName}
                    role="img"
                    className="text-lg select-none"
                  >
                    {countryCodeToFlagEmoji(person.countryCode)}
                  </span>
                )}

                {(person.countryName || person.timezoneAbbr) && (
                  <span className={`text-xs ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {showFlags && person.countryName ? `${person.countryName} ` : ''}
                    {person.timezoneAbbr ? `(${person.timezoneAbbr})` : ''}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}