'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { Crown } from 'lucide-react';
import UpgradeToProCard from './upgrade-to-pro-card';

export type Person = {
  id: string;
  name: string;
  country: string;
};

type PeoplePickerProps = {
  people: Person[];
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  maxSelection: number;
  onUpgrade?: () => void;
};

export default function PeoplePicker({
  people,
  selectedIds,
  setSelectedIds,
  maxSelection,
  onUpgrade,
}: PeoplePickerProps) {
  const visiblePeople = people.slice(0, 3);
  const isMaxReached = selectedIds.length >= maxSelection;

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    } else if (!isMaxReached) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  return (
    <div>
      {/* Use wrapping so pills don't get squashed on small screens */}
      <div className="flex flex-wrap gap-3 md:gap-4">
        {visiblePeople.map((person) => {
          const isSelected = selectedIds.includes(person.id);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <label
              key={person.id}
              className={`cursor-pointer rounded-lg px-4 py-3 border transition-colors duration-150 ease-out select-none
                w-full sm:flex-1 min-w-[140px] flex items-center gap-3
                ${isSelected
                  ? 'bg-purple-800 border-purple-800 text-white focus-within:ring-2 focus-within:ring-purple-600'
                  : 'bg-black border-white/10 text-gray-300'}
                ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700/40 hover:border-purple-600'}
              `}
              tabIndex={isDisabled ? -1 : 0}
              onKeyDown={(e) => {
                if (isDisabled) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSelection(person.id);
                }
              }}
              aria-disabled={isDisabled}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggleSelection(person.id)}
                className="w-4 h-4 rounded border-gray-600 text-purple-400 focus:ring-purple-500 flex-shrink-0"
                aria-checked={isSelected}
                aria-label={`Select ${person.name}`}
              />
              <div className="flex flex-col leading-tight min-w-0 overflow-hidden">
                <span className="font-semibold truncate text-sm md:text-base">{person.name}</span>
                <span className="text-xs md:text-[12px] text-gray-400 truncate">{person.country}</span>
              </div>
            </label>
          );
        })}
      </div>

      {isMaxReached && (
        <div className="text-center mt-6">
          <UpgradeToProCard
            text={`You have reached the maximum of ${maxSelection} people. Upgrade to Pro for unlimited comparisons.`}
            actionLabel="Upgrade Now"
            onAction={onUpgrade ?? (() => {})}
            icon={<Crown className="w-5 h-5 text-yellow-400" />}
          />
        </div>
      )}
    </div>
  );
}