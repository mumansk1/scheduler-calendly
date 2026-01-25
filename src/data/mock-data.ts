import {DayAvailability} from '@/config/types';
export type Slot = { time: string; free: boolean };

/**
 * New Person shape expected by the UI components
 * - id: unique identifier
 * - firstName, lastName: split name fields
 * - countryCode: ISO 3166-1 alpha-2 (optional)
 * - countryName: human readable country/region label
 * - timezoneAbbr: e.g. 'EST', 'IST'
 * - schedule: same as before (7 days x 24 hours)
 */
export type Person = {
  id: string;
  firstName: string;
  lastName?: string;
  countryCode?: string;
  countryName?: string;
  timezoneAbbr?: string;
  schedule: Slot[][];
};

export const PEOPLE: Person[] = [
  {
    id: 'alice',
    firstName: 'Alice',
    lastName: 'Martinez',
    countryCode: 'US',
    countryName: 'USA',
    timezoneAbbr: 'EST',
    schedule: Array(7)
      .fill(null)
      .map(() =>
        Array.from({ length: 24 }, (_, h) => ({
          time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
          free: [9, 10, 14, 15].includes(h),
        }))
      ),
  },
  {
    id: 'bob',
    firstName: 'Bob',
    lastName: 'Johnson',
    countryCode: 'IN',
    countryName: 'India',
    timezoneAbbr: 'IST',
    schedule: Array(7)
      .fill(null)
      .map(() =>
        Array.from({ length: 24 }, (_, h) => ({
          time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
          free: [9, 10, 11, 15, 16].includes(h),
        }))
      ),
  },
  {
    id: 'carol',
    firstName: 'Carol',
    lastName: 'Smith',
    countryCode: 'GB',
    countryName: 'UK',
    timezoneAbbr: 'GMT',
    schedule: Array(7)
      .fill(null)
      .map(() =>
        Array.from({ length: 24 }, (_, h) => ({
          time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
          free: [9, 13, 14].includes(h),
        }))
      ),
  },
  {
    id: 'david',
    firstName: 'David',
    lastName: 'Rubin',
    countryCode: 'US',
    countryName: 'USA (West)',
    timezoneAbbr: 'PST',
    schedule: Array(7)
      .fill(null)
      .map(() =>
        Array.from({ length: 24 }, (_, h) => ({
          time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
          free: [8, 19, 15].includes(h),
        }))
      ),
  },
  {
    id: 'emma',
    firstName: 'Emma',
    lastName: 'Thompson',
    countryCode: 'AU',
    countryName: 'Australia',
    timezoneAbbr: 'AEST',
    schedule: Array(7)
      .fill(null)
      .map(() =>
        Array.from({ length: 24 }, (_, h) => ({
          time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
          free: [10, 11, 15, 16].includes(h),
        }))
      ),
  },
];

export const sampleAvailability: DayAvailability[] = [
  {
    date: 'Thursday, May 2, 2024',
    slots: [
      { time12h: '10:00 AM – 11:30 AM', time24h: '10:00 – 11:30', status: 'Free' },
      { time12h: '12:30 PM – 02:00 PM',  time24h: '12:30 – 14:00', status: 'Tentative' },
      { time12h: '07:00 PM – 09:00 PM',   time24h: '19:00 – 21:00', status: 'None' },
    ],
  },
  {
    date: 'Saturday, May 4, 2024',
    slots: [
      { time12h: '02:00 PM – 04:00 PM', time24h: '14:00 – 16:00', status: 'None' },
    ],
  },
];