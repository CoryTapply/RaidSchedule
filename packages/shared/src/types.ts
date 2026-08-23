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
  /**
   * The underlying raid-helper event id shared by every sign-up on the same
   * raid (only present for `source: 'raid-helper'`). Tagging a raid as Horde
   * (see `isHorde`) applies to this id, not the per-sign-up `id`.
   */
  raidHelperEventId?: string;
  raidName: string;
  /** ISO 8601 UTC. */
  startsAt: string;
  /** ISO 8601 UTC. */
  endsAt?: string;
  status: RosterStatus;
  character: CharacterSignup;
  /**
   * Whether this raid should show the Horde badge. Defaults to a title match
   * (see `isHordeTitle`) but can be explicitly overridden per raid-helper
   * event via the horde-tag endpoint — the override always wins. Always set
   * by the server; optional here only so callers that build a `RaidEvent`
   * without caring about it (tests, seed data) don't have to.
   */
  isHorde?: boolean;
}

export interface EventsResponse {
  events: RaidEvent[];
}

export interface CreateCustomEventInput {
  raidName: string;
  /** ISO 8601 UTC. */
  startsAt: string;
  /** ISO 8601 UTC. */
  endsAt?: string;
  status: RosterStatus;
  character: CharacterSignup;
  isHorde: boolean;
}
