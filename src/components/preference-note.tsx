'use client';
import React, { useState, useEffect } from 'react';
import { DEFAULT_PRESETS, Preset } from '@/config/defaults';
import PreferencePresets from '@/components/preference-presets';

type PreferenceNoteProps = {
  className?: string;
  showPresets?: boolean;
  presets?: Preset[];
  // ADD THIS LINE:
  onChange?: (fullNote: string) => void;
};

export default function PreferenceNote({
  className = '',
  showPresets = true,
  presets = DEFAULT_PRESETS,
  onChange, // Destructure it here
}: PreferenceNoteProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [manualNotes, setManualNotes] = useState<string>('');

  // EFFECT: Whenever selected presets or manual notes change, 
  // construct the full string and send it to the parent
  useEffect(() => {
    if (onChange) {
      const selectedDescriptions = presets
        .filter((p) => selectedIds.includes(p.id))
        .map((p) => p.description);
      
      const bulletPoints = selectedDescriptions.map(d => `• ${d}`).join('\n');
      const fullNote = bulletPoints 
        ? `${bulletPoints}\n\n${manualNotes}`.trim() 
        : manualNotes.trim();
        
      onChange(fullNote);
    }
  }, [selectedIds, manualNotes, onChange, presets]);

  const togglePreset = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const removePreset = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const isEmpty = selectedIds.length === 0 && manualNotes.trim() === '';

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col space-y-4 ${className}`}>
      {showPresets && (
        <PreferencePresets
          presets={presets}
          selectedIds={selectedIds}
          onToggle={togglePreset}
        />
      )}

      <div className="bg-gray-800 rounded p-3 min-h-[100px] flex flex-col border border-gray-700">
        {selectedIds.length > 0 && (
          <ul className="list-disc list-inside text-gray-200 space-y-1 mb-2">
            {presets
              .filter((p) => selectedIds.includes(p.id))
              .map((preset) => (
                <li key={preset.id} className="flex items-center justify-between group">
                  <span className="flex-1">• {preset.description}</span>
                  <button
                    onClick={() => removePreset(preset.id)}
                    className="text-gray-500 hover:text-red-400 text-lg px-2"
                    type="button"
                  >
                    ×
                  </button>
                </li>
              ))}
          </ul>
        )}

        <textarea
          placeholder={isEmpty ? 'Type additional details here...' : ''}
          value={manualNotes}
          onChange={(e) => setManualNotes(e.target.value)}
          className="w-full bg-transparent rounded resize-none text-white placeholder-gray-500 focus:outline-none flex-grow"
          rows={selectedIds.length > 0 ? 3 : 4}
        />
      </div>
    </div>
  );
}