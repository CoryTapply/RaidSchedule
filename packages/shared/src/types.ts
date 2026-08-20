export const WOW_CLASSES = [
  'Death Knight',
  'Demon Hunter',
  'Druid',
  'Evoker',
  'Hunter',
  'Mage',
  'Monk',
  'Paladin',
  'Priest',
  'Rogue',
  'Shaman',
  'Warlock',
  'Warrior',
] as const;

export type WowClass = (typeof WOW_CLASSES)[number];

export type RosterStatus = 'pending' | 'confirmed';

export interface CharacterSignup {
  name: string;
  className: WowClass | 'Unknown';
  spec?: string;
}

export interface RaidEvent {
  /** Namespaced by source, e.g. `raid-helper:${eventId}:${signUpId}`. */
  id: string;
  source: 'raid-helper' | 'custom';
  raidName: string;
  /** ISO 8601 UTC. */
  startsAt: string;
  /** ISO 8601 UTC. */
  endsAt?: string;
  status: RosterStatus;
  character: CharacterSignup;
}

export interface EventsResponse {
  events: RaidEvent[];
}
