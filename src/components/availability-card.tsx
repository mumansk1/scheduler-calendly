'use client';
import React, { useState } from 'react';
import SharePopup from '@/components/share-popup';
import { DayAvailability, SlotState } from '@/config/types';

type AvailabilityCardProps = {
  className?: string;
  dailyAvailability?: DayAvailability[]; // initial availability passed by caller
  onShare?: (availability: DayAvailability[]) => void | Promise<void>;
  preferenceNote?: string;
};

export default function AvailabilityCard({
  className = '',
  dailyAvailability,
  onShare,
  preferenceNote,
}: AvailabilityCardProps) {
  // Initialize state from prop or fallback to empty array
  const [availability, setAvailability] = useState<DayAvailability[]>(
    () => dailyAvailability ?? []
  );

  const [isSharing, setIsSharing] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [fullSmsText, setFullSmsText] = useState('');
  const [use24Hour, setUse24Hour] = useState(false); // global toggle

  const nextState = (s: SlotState): SlotState =>
    s === 'None' ? 'Free' : s === 'Free' ? 'Tentative' : 'None';

  const toggleStatus = (dayIndex: number, slotIndex: number) => {
    setAvailability((prev) =>
      prev.map((day, dIdx) =>
        dIdx !== dayIndex
          ? day
          : {
              ...day,
              slots: day.slots.map((slot, sIdx) =>
                sIdx !== slotIndex ? slot : { ...slot, status: nextState(slot.status) }
              ),
            }
      )
    );
  };

  const getSlotClasses = (state: SlotState) => {
    switch (state) {
      case 'Free':
        return {
          wrapper:
            'flex items-center justify-between rounded p-2 mb-2 cursor-pointer select-none bg-green-700 hover:bg-green-600',
          label: 'FREE',
        };
      case 'Tentative':
        return {
          wrapper:
            'flex items-center justify-between rounded p-2 mb-2 cursor-pointer select-none bg-yellow-700 hover:bg-yellow-600',
          label: 'TENTATIVE',
        };
      default:
        return {
          wrapper:
            'flex items-center justify-between rounded p-2 mb-2 cursor-pointer select-none bg-gray-700 hover:bg-gray-600',
          label: '',
        };
    }
  };

  const timeStringForDisplay = (slot: any) => {
    if (use24Hour) {
      return slot.time24h ?? slot.time12h ?? '';
    }
    return slot.time12h ?? slot.time24h ?? '';
  };

  const prepareFullMessage = () => {
    const formatAvailability = availability
      .map(
        (day) =>
          `${day.date}:\n${day.slots
            .filter((s) => s.status !== 'None')
            .map((slot) => {
              const timeStr = timeStringForDisplay(slot);
              return `  ${timeStr} - ${slot.status}`;
            })
            .join('\n')}`
      )
      .filter((text) => text.includes('-'))
      .join('\n\n');

    const availabilityHeader = 'Here is my availability:';
    return formatAvailability
      ? preferenceNote
        ? `${availabilityHeader}\n${formatAvailability}\n\nNote:\n${preferenceNote}`
        : `${availabilityHeader}\n${formatAvailability}`
      : preferenceNote ?? '';
  };

  const handleShareMethod = async (method: 'email' | 'text') => {
    try {
      setIsSharing(true);

      if (onShare) {
        await Promise.resolve(onShare(availability));
      }

      const fullMessage = prepareFullMessage();

      if (method === 'email') {
        const subject = encodeURIComponent('My Availability');
        const body = encodeURIComponent(fullMessage);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        setShowSharePopup(false);
      } else {
        setFullSmsText(fullMessage);
        setShowSharePopup(true);
      }
    } catch (err) {
      console.error('Share failed', err);
      setShowSharePopup(false);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className={`bg-gray-800 rounded p-4 mb-4 ${className}`}>
      <h3 className="text-white font-bold text-2xl tracking-wide text-center mb-2">
        Here is When I am Free
      </h3>

      {/* Subtle segmented toggle — reduced margin-bottom */}
      <div className="mb-2 flex items-center">
        <div
          role="group"
          aria-label="Time format"
          className="inline-flex rounded-full bg-gray-700/40 p-0.5"
        >
          <button
            type="button"
            aria-pressed={!use24Hour}
            onClick={() => setUse24Hour(false)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors focus:outline-none ${
              !use24Hour ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            12h
          </button>
          <button
            type="button"
            aria-pressed={use24Hour}
            onClick={() => setUse24Hour(true)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors focus:outline-none ${
              use24Hour ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            24h
          </button>
        </div>
      </div>

      {/* Availability list */}
      {availability.map((day, dayIndex) => (
        <div key={day.date} className="mb-4">
          <strong className="block text-white mb-1 text-sm opacity-90">{day.date}</strong>

          {day.slots.map((slot, slotIndex) => {
            const { wrapper, label } = getSlotClasses(slot.status);
            const timeStr = timeStringForDisplay(slot);
            const slotKey = `${dayIndex}-${slotIndex}-${slot.time24h ?? slot.time12h}`;
            return (
              <div
                key={slotKey}
                className={wrapper}
                onClick={() => toggleStatus(dayIndex, slotIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleStatus(dayIndex, slotIndex);
                  }
                }}
                aria-label={`${timeStr} — ${
                  slot.status === 'None' ? 'not selected' : slot.status
                }`}
                title={
                  slot.status === 'None'
                    ? 'Click to mark as FREE'
                    : slot.status === 'Free'
                    ? 'Click to mark as TENTATIVE'
                    : 'Click to clear selection'
                }
              >
                <span className="text-white">{timeStr}</span>
                <span className="text-xs font-semibold uppercase text-white">{label}</span>
              </div>
            );
          })}
        </div>
      ))}

      {/* Note displayed directly ABOVE the Share button */}
      {preferenceNote && (
        <div className="mt-2 mb-4 p-3 bg-gray-700 rounded text-gray-300 text-sm whitespace-pre-wrap border border-gray-600">
          {preferenceNote}
        </div>
      )}

      <button
        onClick={() => {
          setFullSmsText(prepareFullMessage());
          setShowSharePopup(true);
        }}
        disabled={isSharing}
        className="w-full bg-brandPurpleButton rounded py-2 text-white font-semibold hover:brightness-110 disabled:opacity-60"
        aria-busy={isSharing}
        aria-label="Share Availability"
      >
        {isSharing ? 'Sharing...' : 'Share Availability'}
      </button>

      {showSharePopup && (
        <SharePopup
          onClose={() => setShowSharePopup(false)}
          onShareMethod={handleShareMethod}
          smsText={fullSmsText}
        />
      )}
    </div>
  );
}