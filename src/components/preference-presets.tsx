// PreferencePresets.tsx
'use client';
import React from 'react';
import { Preset } from '@/config/defaults';

type PreferencePresetsProps = {
  presets: Preset[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export default function PreferencePresets({
  presets,
  selectedIds,
  onToggle,
}: PreferencePresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => {
        const isSelected = selectedIds.includes(preset.id);
        return (
          <div key={preset.id} className="relative group">
            <button
              onClick={() => onToggle(preset.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                isSelected
                  ? 'bg-purple-700 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-purple-400 hover:bg-gray-700'
              }`}
              type="button"
              aria-pressed={isSelected}
            >
              <span>{preset.icon}</span>
              <span>{preset.tag}</span>
            </button>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-black border border-gray-600 text-xs text-gray-200 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
              {preset.description}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}