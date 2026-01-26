'use client';
import React, { useState, useEffect, useMemo } from 'react';
import SharePopup from '@/components/share-popup';
import CalendarNavigator from '@/components/calendar-navigator';
import { DayAvailability, SlotState } from '@/config/types';
import { DEFAULT_APP_LINK } from '@/config/defaults';

// Helper function to parse time strings (e.g., "9:00 AM") into a comparable format
const parseTime = (timeStr: string): number => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
};

type AvailabilityCardProps = {
  className?: string;
  dailyAvailability?: DayAvailability[];
  onShare?: (availability: DayAvailability[]) => void | Promise<void>;
  preferenceNote?: string;
  wakingHours?: { start: string; end: string };
  onUpdate?: (updatedAvailability: DayAvailability[]) => void;
};

export default function AvailabilityCard({
  className = '',
  dailyAvailability,
  onShare,
  preferenceNote,
  wakingHours,
  onUpdate,
}: AvailabilityCardProps) {
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [fullSmsText, setFullSmsText] = useState('');
  const [use24Hour, setUse24Hour] = useState(false);

  const filteredDailyAvailability = useMemo(() => {
    if (!dailyAvailability || !wakingHours) {
      return dailyAvailability ?? [];
    }

    const wakingStartMinutes = parseTime(wakingHours.start);
    const wakingEndMinutes = parseTime(wakingHours.end);

    return dailyAvailability.map(day => ({
      ...day,
      slots: day.slots.filter(slot => {
        const slotStartMinutes = parseTime(slot.time12h);
        if (wakingStartMinutes <= wakingEndMinutes) {
          return slotStartMinutes >= wakingStartMinutes && slotStartMinutes < wakingEndMinutes;
        } else {
          return slotStartMinutes >= wakingStartMinutes || slotStartMinutes < wakingEndMinutes;
        }
      })
    }));
  }, [dailyAvailability, wakingHours]);

  useEffect(() => {
    setAvailability(filteredDailyAvailability);
  }, [filteredDailyAvailability]);

  // Logic to check if any spots are selected
  const hasSelection = useMemo(() => {
    return availability.some(day => day.slots.some(slot => slot.status !== 'None'));
  }, [availability]);

  const nextState = (s: SlotState): SlotState =>
    s === 'None' ? 'Free' : s === 'Free' ? 'Tentative' : 'None';

  const toggleStatus = (dayIndex: number, slotIndex: number) => {
    setAvailability((prev) => {
      const updatedAvailability = prev.map((day, dIdx) =>
        dIdx !== dayIndex
          ? day
          : {
              ...day,
              slots: day.slots.map((slot, sIdx) =>
                sIdx !== slotIndex ? slot : { ...slot, status: nextState(slot.status) }
              ),
            }
      );
      if (onUpdate) {
        onUpdate(updatedAvailability);
      }
      return updatedAvailability;
    });
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

  const timeStringForDisplay = (slot: any) => {
    if (use24Hour) {
      return slot.time24h ?? slot.time12h ?? '';
    }
    return slot.time12h ?? slot.time24h ?? '';
  };

  // prepareFullMessage now accepts an optional dateStr to include the selected calendar date
  const prepareFullMessage = (dateStr?: string) => {
    const dayBlocks: string[] = availability
      .map((day) => {
        const selectedSlots = day.slots.filter((s) => s.status !== 'None');
        if (selectedSlots.length === 0) return null;

        const slotsText = selectedSlots
          .map((slot) => {
            const timeStr = (timeStringForDisplay(slot) ?? '').trim();
            if (!timeStr && !slot.status) return null;
            return `  ${timeStr}${timeStr ? ' - ' : ''}${slot.status}`;
          })
          .filter(Boolean)
          .join('\n');

        if (!slotsText) return null;
        return `${day.date}:\n${slotsText}`;
      })
      .filter(Boolean) as string[];

    const joined = dayBlocks.join('\n\n');
    const cleaned = joined
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        return trimmed !== ':' && trimmed !== '：' && trimmed.length > 0 || trimmed.includes('-');
      })
      .join('\n');

    // Include the requested phrasing with date when dateStr is provided
    const availabilityHeader = dateStr
      ? `Here is when I am available on ${dateStr}:\n\nUse ${DEFAULT_APP_LINK} to see if my times work for you.\n\n`
      : `Use ${DEFAULT_APP_LINK} to see if my times work for you.\n\nHere is my availability:\n\n`;

    if (!cleaned) {
      const noAvailabilityMsg = dateStr
        ? `I have no availability on ${dateStr}.`
        : "I have no availability on this date.";
      return preferenceNote
        ? `${noAvailabilityMsg}\n\nNote:\n${preferenceNote}`
        : noAvailabilityMsg;
    }

    return preferenceNote
      ? `${availabilityHeader}${cleaned}\n\nNote:\n${preferenceNote}`
      : `${availabilityHeader}${cleaned}`;
  };

  const handleShareMethod = async (method: 'email' | 'text') => {
    try {
      setIsSharing(true);

      if (onShare) {
        await Promise.resolve(onShare(availability));
      }

      const fullMessage = prepareFullMessage();

      if (method === 'email') {
        const subject = encodeURIComponent(`Availability`);
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
    <>
      {/* Main container */}
      <div className={`bg-gray-800 rounded p-4 mb-4 max-w-7xl mx-auto px-6`}>
        {/* Removed vertical margin above and below CalendarNavigator */}
        <div className="flex justify-center py-0 my-0">
          <CalendarNavigator className="min-w-[360] text-base text-xl" />
        </div>

        <div className="mb-2 flex items-center">
          <div role="group" aria-label="Time format" className="inline-flex rounded-full bg-gray-700/40 p-0.5">
            <button
              type="button"
              onClick={() => setUse24Hour(false)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors focus:outline-none ${!use24Hour ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`}
            >
              12h
            </button>
            <button
              type="button"
              onClick={() => setUse24Hour(true)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors focus:outline-none ${use24Hour ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`}
            >
              24h
            </button>
          </div>
        </div>

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
                >
                  <span className="text-white">{timeStr}</span>
                  <span className="text-xs font-semibold uppercase text-white">{label}</span>
                </div>
              );
            })}
          </div>
        ))}

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
          className={`w-full rounded py-3 px-4 text-white font-bold transition-all active:scale-95 shadow-lg border ${
            hasSelection
              ? 'bg-brandPurpleAvailable border-purple-400/30 hover:brightness-110 text-white'
              : 'bg-brandPurpleUnavailable border-white/10 text-gray-200 hover:bg-gray-650'
          }`}
          aria-busy={isSharing}
          aria-label={hasSelection ? "Share selected availability" : "Report no availability or select time spots"}
        >
          {isSharing ? 'Sharing...' : hasSelection ? "Send I'm Available" : "Send I'm Not Available"}
        </button>

        {showSharePopup && (
          <SharePopup
            onClose={() => setShowSharePopup(false)}
            onShareMethod={handleShareMethod}
            smsText={fullSmsText}
          />
        )}
      </div>
    </>
  );
}