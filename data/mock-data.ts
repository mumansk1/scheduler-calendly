// src/data/mockData.ts

export type Slot = { time: string; free: boolean };
export type Person = { id: string; name: string; country: string; schedule: Slot[][] };

export const MAX_SELECTION = 3;

export const PEOPLE: Person[] = [
  {
    id: 'alice',
    name: 'Alice Martinez (You)',
    country: '🇺🇸 USA (EST)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![9, 10, 14, 15].includes(h),
      }))
    ),
  },
  {
    id: 'bob',
    name: 'Bob Johnson',
    country: '🇮🇳 India (IST)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![10, 11, 15, 16].includes(h),
      }))
    ),
  },
  {
    id: 'carol',
    name: 'Carol Smith',
    country: '🇬🇧 UK (GMT)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![9, 13, 14].includes(h),
      }))
    ),
  },
  {
    id: 'david',
    name: 'David Wilson',
    country: '🇺🇸 USA (West) (PST)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![8, 9, 15].includes(h),
      }))
    ),
  },
  {
    id: 'emma',
    name: 'Emma Thompson',
    country: '🇦🇺 Australia (AEST)',
    schedule: Array(7).fill(null).map(() =>
      Array.from({ length: 24 }, (_, h) => ({
        time: `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        free: ![10, 11, 15, 16].includes(h),
      }))
    ),
  },
];