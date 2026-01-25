// types.ts
export type Preset = {
  id: string;
  category: string;
  tag: string;
  icon: string;
  description: string;
};

export type SlotState = 'None' | 'Free' | 'Tentative';

export type TimeSlot = {
  status: SlotState;
  time12h: string;
  time24h: string;
};

export type DayAvailability = {
  date: string;
  slots: TimeSlot[];
};