'use client';
import React, { useState } from 'react';
import SharePopup from '@/components/share-popup';

type SlotState = 'None' | 'Free' | 'Tentative';

type TimeSlot = {
  time: string;
  status: SlotState;
};

type DayAvailability = {
  date: string;
  slots: TimeSlot[];
};

type AvailabilityCardProps = {
  className?: string;
  onShare?: (availability: DayAvailability[]) => void | Promise<void>;
  preferenceNote?: string;
};

export default function AvailabilityCard({
  className = '',
  onShare,
  preferenceNote,
}: AvailabilityCardProps) {
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

  const [isSharing, setIsSharing] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [fullSmsText, setFullSmsText] = useState('');

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
          wrapper: 'flex items-center justify-between rounded p-2 mb-2 cursor-pointer select-none bg-green-700 hover:bg-green-600',
          label: 'FREE',
        };
      case 'Tentative':
        return {
          wrapper: 'flex items-center justify-between rounded p-2 mb-2 cursor-pointer select-none bg-yellow-700 hover:bg-yellow-600',
          label: 'TENTATIVE',
        };
      default:
        return {
          wrapper: 'flex items-center justify-between rounded p-2 mb-2 cursor-pointer select-none bg-gray-700 hover:bg-gray-600',
          label: '',
        };
    }
  };

  const prepareFullMessage = () => {
    const formatAvailability = availability
      .map(
        (day) =>
          `${day.date}:\n${day.slots
            .filter((s) => s.status !== 'None')
            .map((slot) => `  ${slot.time} - ${slot.status}`)
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
        // For SMS, save the message text and open popup to copy + open SMS app
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
      <h3 className="text-white font-bold text-2xl tracking-wide text-center mb-6">
        Here is When I am Free
      </h3>

      {/* Availability by day */}
      {availability.map((day, dayIndex) => (
        <div key={day.date} className="mb-4">
          <strong className="block text-white mb-2">{day.date}</strong>

          {day.slots.map((slot, slotIndex) => {
            const { wrapper, label } = getSlotClasses(slot.status);
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
                title={
                  slot.status === 'None'
                    ? 'Click to mark as FREE'
                    : slot.status === 'Free'
                    ? 'Click to mark as TENTATIVE'
                    : 'Click to clear selection'
                }
              >
                <span className="text-white">{slot.time}</span>
                <span className="text-xs font-semibold uppercase text-white">{label}</span>
              </div>
            );
          })}
        </div>
      ))}

      {/* Note displayed directly ABOVE the Share button */}
      {preferenceNote && (
        <div className="mb-4 p-3 bg-gray-700 rounded text-gray-300 text-sm whitespace-pre-wrap border border-gray-600">
          {preferenceNote}
        </div>
      )}

      <button
        onClick={() => {
          // Prepare SMS text and open popup for sharing
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