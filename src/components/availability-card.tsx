'use client';
import React, { useState } from 'react';
import SharePopup from '@/components/share-popup'; // Adjust path as needed
import PreferenceNote from '@/components/preference-note'; // Import PreferenceNote

type SlotState = 'None' | 'Free' | 'Tentative';

type TimeSlot = {
  time: string;
  status: SlotState;
};

type DayAvailability = {
  date: string; // e.g. "Thursday, May 2, 2024"
  slots: TimeSlot[];
};

type AvailabilityCardProps = {
  className?: string;
  onShare?: (availability: DayAvailability[]) => void | Promise<void>;
};

export default function AvailabilityCard({
  className = '',
  onShare,
}: AvailabilityCardProps) {
  // Initial availability state with one Free and one Tentative slot
  const [availability, setAvailability] = useState<DayAvailability[]>([
    {
      date: 'Thursday, May 2, 2024',
      slots: [
        { time: '10:00 AM – 11:30 AM', status: 'Free' },
        { time: '12:30 PM – 2:00 PM', status: 'Tentative' },
        { time: '7:00 PM – 9:00 PM', status: 'None' },
      ],
    },
    {
      date: 'Saturday, May 4, 2024',
      slots: [{ time: '2:00 PM – 4:00 PM', status: 'None' }],
    },
  ]);

  const [preferenceNote, setPreferenceNote] = useState<string>('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);

  // Cycle states: None -> Free -> Tentative -> None
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

  // Helper to get styles + label for a given SlotState
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

  // Handle share method chosen in popup
  const handleShareMethod = async (method: 'email' | 'text') => {
    try {
      setIsSharing(true);
      setShareMessage(null);

      if (onShare) {
        await Promise.resolve(onShare(availability));
      }

      const formatAvailability = availability
        .map(
          (day) =>
            `${day.date}:\n${day.slots
              .map((slot) => `  ${slot.time} - ${slot.status}`)
              .join('\n')}`
        )
        .join('\n\n');

      const fullMessage = `Note: ${preferenceNote}\n\nAvailability:\n${formatAvailability}`;

      if (method === 'email') {
        const subject = encodeURIComponent('My Availability');
        const body = encodeURIComponent(fullMessage);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        setShareMessage('Email client opened');
      } else if (method === 'text') {
        const body = encodeURIComponent(fullMessage);
        window.location.href = `sms:?&body=${body}`;
        setShareMessage('SMS app opened');
      }
    } catch (err) {
      console.error('Share failed', err);
      setShareMessage('Failed to share — try again');
    } finally {
      setIsSharing(false);
      setShowSharePopup(false);
    }
  };

  // ... rest of your component code remains the same ...

return (
  <div className={`bg-gray-800 rounded p-4 mb-4 ${className}`}>
    {/* Instruction header */}
    <h3 className="text-white font-bold text-2xl tracking-wide text-center mb-6">
      Here is When I am Free
    </h3>

    {/* Availability by day */}
    {availability.map((day, dayIndex) => (
      <div key={day.date} className="mb-4">
        <strong className="block text-white mb-2">{day.date}</strong>

        {day.slots.map((slot, slotIndex) => {
          const { wrapper, label } = getSlotClasses(slot.status);
          const title =
            slot.status === 'None'
              ? `Click to mark as FREE`
              : slot.status === 'Free'
              ? `Click to mark as TENTATIVE`
              : `Click to clear selection`;
          return (
            <div
              key={`${dayIndex}-${slotIndex}-${slot.time}`}
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
              aria-label={`${slot.time} — ${
                slot.status === 'None' ? 'not selected' : slot.status
              }`}
              title={title}
            >
              <span className="text-white">{slot.time}</span>
              <span className="text-xs font-semibold uppercase text-white">{label}</span>
            </div>
          );
        })}
      </div>
    ))}

    {/* PreferenceNote placed here, above the Share button */}
    <PreferenceNote
      className="mb-4"
      showPresets={false}
      onChange={(note) => setPreferenceNote(note)}
    />

    {/* Share Availability button */}
    <button
      onClick={() => setShowSharePopup(true)}
      disabled={isSharing}
      className="w-full bg-brandPurpleButton rounded py-2 text-white font-semibold hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
      aria-busy={isSharing}
      aria-label="Share Availability"
    >
      {isSharing ? 'Sharing...' : 'Share Availability'}
    </button>

    {/* Share message */}
    {shareMessage && (
      <p className="mt-2 text-center text-sm text-gray-300">{shareMessage}</p>
    )}

    {/* Share popup */}
    {showSharePopup && (
      <SharePopup
        onClose={() => setShowSharePopup(false)}
        onShareMethod={handleShareMethod}
      />
    )}
  </div>
);
}