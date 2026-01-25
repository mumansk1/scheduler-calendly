export const APP_NAME = 'whenRUfree';
export const MAX_SELECTION = 4;
export const DEFAULT_TIMEZONE = 'EST';
export const SHARE_LINK_BASE = 'https://whenrufree.com/schedule';

export const NAVIGATION_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Availability', href: '/availability' },
  { label: 'Connections', href: '/connections'},
  { label: 'Settings', href: '/settings' },
];

export const UI_STRINGS = {
  SHARE_LABEL: 'Copy this link to share when you are free',
  NO_MATCHES_TITLE: 'No matches found',
  NO_MATCHES_SUBTITLE: 'There are no 1-hour slots today where everyone is free.',
  INDIVIDUAL_AVAILABILITY: 'Individual Availability',
  MATCH_FOUND_SINGULAR: 'match found',
  MATCH_FOUND_PLURAL: 'matches found',
  ALL_AVAILABLE_SUFFIX: 'when all of you are available',
};

// defaults.ts
export type Preset = {
  id: string;
  category: string;
  tag: string;
  icon: string;
  description: string;
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