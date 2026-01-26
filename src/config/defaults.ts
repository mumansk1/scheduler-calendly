import {DayAvailability, Preset} from '@/config/types';

export const APP_NAME = 'whenRUfree';
export const MAX_SELECTION = 4;
export const DEFAULT_TIMEZONE = 'EST';
//export const DEFAULT_APP_LINK = 'https://whenrufree.com/schedule';
export const DEFAULT_APP_LINK = 'https://scheduler-calendly.vercel.app/';

export const UI_STRINGS = {
  SHARE_LABEL: 'Copy this link to share when you are free',
  NO_MATCHES_TITLE: 'No matches found',
  NO_MATCHES_SUBTITLE: 'There are no 1-hour slots today where everyone is free.',
  INDIVIDUAL_AVAILABILITY: 'Individual Availability',
  MATCH_FOUND_SINGULAR: 'match found',
  MATCH_FOUND_PLURAL: 'matches found',
  ALL_AVAILABLE_SUFFIX: 'when all of you are available',
};

export const DEFAULT_PRESETS: Preset[] = [
  { id: '1', category: 'Boundaries', tag: 'Hard Stop', icon: '🛑', description: "I have to leave exactly at this time for pickup/nap." },
  { id: '2', category: 'Boundaries', tag: 'Brain Fried', icon: '🧠', description: "I’m social, but my decision-making capacity is zero." },
  { id: '3', category: 'Boundaries', tag: 'Delayed Start', icon: '⏳', description: "I might be 5 mins late depending on the toddler." },
  { id: '4', category: 'Environment', tag: 'Kids in Tow', icon: '👶', description: "My circus is coming with me." },
  { id: '5', category: 'Environment', tag: 'Child-Free!', icon: '🎉', description: "I have a sitter; let's actually finish a sentence." },
  { id: '6', category: 'Environment', tag: 'Casual/Messy', icon: '🏠', description: "My house is a disaster, but the door is open." },
  { id: '7', category: 'Activity', tag: 'Walking Date', icon: '👟', description: "Let's move so I can hit my steps." },
  { id: '8', category: 'Activity', tag: 'Caffeine Fix', icon: '☕', description: "Don't talk to me until we get to the counter." },
  { id: '9', category: 'Activity', tag: 'Parking Info', icon: '🚗', description: "Parking is tricky - check the map or give me a call." },
  { id: '10', category: 'Energy', tag: 'Low Battery', icon: '🪫', description: "I need a low-energy hang. Pajamas welcome." },
  { id: '11', category: 'Energy', tag: 'Venting Session', icon: '🗣️', description: "I have things to get off my chest." },
];

export const DEFAULT_DAY: DayAvailability[] = [
  {
    date: '',
    slots: [
      {
        time12h: '12:00 AM – 01:00 AM',
        time24h: '00:00 – 01:00',
        status: 'None',
      },
      {
        time12h: '01:00 AM – 02:00 AM',
        time24h: '01:00 – 02:00',
        status: 'None',
      },
      {
        time12h: '02:00 AM – 03:00 AM',
        time24h: '02:00 – 03:00',
        status: 'None',
      },
      {
        time12h: '03:00 AM – 04:00 AM',
        time24h: '03:00 – 04:00',
        status: 'None',
      },
      {
        time12h: '04:00 AM – 05:00 AM',
        time24h: '04:00 – 05:00',
        status: 'None',
      },
      {
        time12h: '05:00 AM – 06:00 AM',
        time24h: '05:00 – 06:00',
        status: 'None',
      },
      {
        time12h: '06:00 AM – 07:00 AM',
        time24h: '06:00 – 07:00',
        status: 'None',
      },
      {
        time12h: '07:00 AM – 08:00 AM',
        time24h: '07:00 – 08:00',
        status: 'None',
      },
      {
        time12h: '08:00 AM – 09:00 AM',
        time24h: '08:00 – 09:00',
        status: 'None',
      },
      {
        time12h: '09:00 AM – 10:00 AM',
        time24h: '09:00 – 10:00',
        status: 'None',
      },
      {
        time12h: '10:00 AM – 11:00 AM',
        time24h: '10:00 – 11:00',
        status: 'None',
      },
      {
        time12h: '11:00 AM – 12:00 PM',
        time24h: '11:00 – 12:00',
        status: 'None',
      },
      {
        time12h: '12:00 PM – 01:00 PM',
        time24h: '12:00 – 13:00',
        status: 'None',
      },
      {
        time12h: '01:00 PM – 02:00 PM',
        time24h: '13:00 – 14:00',
        status: 'None',
      },
      {
        time12h: '02:00 PM – 03:00 PM',
        time24h: '14:00 – 15:00',
        status: 'None',
      },
      {
        time12h: '03:00 PM – 04:00 PM',
        time24h: '15:00 – 16:00',
        status: 'None',
      },
      {
        time12h: '04:00 PM – 05:00 PM',
        time24h: '16:00 – 17:00',
        status: 'None',
      },
      {
        time12h: '05:00 PM – 06:00 PM',
        time24h: '17:00 – 18:00',
        status: 'None',
      },
      {
        time12h: '06:00 PM – 07:00 PM',
        time24h: '18:00 – 19:00',
        status: 'None',
      },
      {
        time12h: '07:00 PM – 08:00 PM',
        time24h: '19:00 – 20:00',
        status: 'None',
      },
      {
        time12h: '08:00 PM – 09:00 PM',
        time24h: '20:00 – 21:00',
        status: 'None',
      },
      {
        time12h: '09:00 PM – 10:00 PM',
        time24h: '21:00 – 22:00',
        status: 'None',
      },
      {
        time12h: '10:00 PM – 11:00 PM',
        time24h: '22:00 – 23:00',
        status: 'None',
      },
      {
        time12h: '11:00 PM – 12:00 AM',
        time24h: '23:00 – 00:00',
        status: 'None',
      },
    ],
  },
];

export const DEFAULT_WAKING_HOURS = {
  "start": "09:00 AM",
  "end": "09:30 PM"
}