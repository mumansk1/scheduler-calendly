// lib/match-utils.ts
export type Slot = {
  time: string | number; // e.g. 9, "09:00", "14:00"
  free?: boolean;        // true if free at this slot
};

export type PersonSchedule = Slot[][]; // [dayIndex][slotIndex]
export type PersonMinimal = {
  id: string;
  name?: string;
  schedule?: PersonSchedule;
};

export type MatchResult = {
  idx: number;       // the hour number (e.g. 9)
  time: string;      // raw hour string
  label: string;     // formatted range (e.g. "09:00 - 10:00")
};

/**
 * Parse a time string or numeric value into a 24h hour number.
 */
export function parseTimeString(startTime: string | number) {
  if (typeof startTime === 'number') {
    return { hour: Math.floor(startTime) % 24, minute: 0 };
  }

  const s = (startTime || '').toString().trim();
  
  // Matches HH:mm or H:mm
  const hm = /(\d{1,2}):(\d{2})/.exec(s);
  if (hm) {
    return { hour: Number(hm[1]), minute: Number(hm[2]) };
  }

  // Matches raw hour number in string format
  const hOnly = /^(\d{1,2})$/.exec(s);
  if (hOnly) {
    return { hour: Number(hOnly[1]), minute: 0 };
  }

  return { hour: 0, minute: 0 };
}

/** Format hour/minute into 24-hour "HH:00" */
export function format24Hour(hour24: number, minute: number) {
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Format a one-hour time range string (24-hour format).
 * Example: "09:00 - 10:00"
 */
export function formatOneHourRange(startTime: string | number) {
  const { hour, minute } = parseTimeString(startTime);
  const endHour = (hour + 1) % 24;
  
  const startStr = format24Hour(hour, minute);
  const endStr = format24Hour(endHour, minute);
  
  return `${startStr} - ${endStr}`;
}

/**
 * Build a Set of available hours for a person.
 */
function availableHoursForPerson(person: PersonMinimal, dayIndex: number): Set<number> {
  const set = new Set<number>();
  const day = person.schedule?.[dayIndex] || [];
  for (const slot of day) {
    if (!slot || slot.free === false) continue;

    const parsed = parseTimeString(slot.time);
    set.add(parsed.hour);
  }
  return set;
}

/**
 * Find matching hour numbers where EVERY selected person is free.
 */
export function findMatchingHours(
  people: PersonMinimal[],
  selectedIds: string[],
  dayIndex: number
): number[] {
  const selectedPeople = people.filter((p) => selectedIds.includes(p.id));
  if (selectedPeople.length === 0) return [];

  const hourSets = selectedPeople.map((p) => availableHoursForPerson(p, dayIndex));
  
  let intersection = new Set<number>(hourSets[0]);
  for (let i = 1; i < hourSets.length; i++) {
    const next = hourSets[i];
    intersection = new Set<number>([...intersection].filter((h) => next.has(h)));
    if (intersection.size === 0) break;
  }

  return [...intersection].sort((a, b) => a - b);
}

/**
 * Build MatchResult objects with 24-hour labels.
 */
export function buildMatches(
  people: PersonMinimal[],
  selectedIds: string[],
  dayIndex: number
): MatchResult[] {
  const hours = findMatchingHours(people, selectedIds, dayIndex);

  return hours.map((hour) => {
    return { 
      idx: hour, 
      time: String(hour), 
      label: formatOneHourRange(hour) 
    };
  });
}