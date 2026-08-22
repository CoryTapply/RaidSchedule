import { WOW_CLASSES, type RaidEvent, type RosterStatus, type WowClass } from '@raidschedule/shared';
import type { RawRaidHelperEvent, RawRaidHelperSignUp } from './types.js';

const WOW_CLASS_SET = new Set<string>(WOW_CLASSES);

/**
 * `className` isn't always a WoW class — verified against a live response,
 * a raid leader can configure any label as a sign-up option. Two specific
 * non-class values are known and handled explicitly (see below); anything
 * else unrecognized falls through to spec-based inference.
 */
const ABSENCE_LABEL = 'absence';
const TENTATIVE_LABEL = 'tentative';

/**
 * Spec name -> class, for when `className` is a role ("Tank") rather than a
 * class. A handful of spec names are shared by two classes (Protection,
 * Holy, Restoration, Frost) — real ambiguity, not a bug. Each is resolved to
 * a single arbitrary default below; if it guesses wrong for your characters,
 * this table is the one place to fix it.
 */
const SPEC_TO_CLASS: Record<string, WowClass> = {
  // Warrior
  Arms: 'Warrior',
  Fury: 'Warrior',
  // Paladin
  Retribution: 'Paladin',
  // Protection: Warrior or Paladin — defaulting to Warrior.
  Protection: 'Warrior',
  // Hunter
  'Beast Mastery': 'Hunter',
  Marksmanship: 'Hunter',
  Survival: 'Hunter',
  // Rogue
  Assassination: 'Rogue',
  Combat: 'Rogue',
  Outlaw: 'Rogue',
  Subtlety: 'Rogue',
  // Priest / Paladin
  Discipline: 'Priest',
  Shadow: 'Priest',
  // Holy: Paladin or Priest — defaulting to Priest.
  Holy: 'Priest',
  // Death Knight
  Blood: 'Death Knight',
  // Frost: Mage or Death Knight — defaulting to Mage.
  Frost: 'Mage',
  Unholy: 'Death Knight',
  // Shaman / Druid
  Elemental: 'Shaman',
  Enhancement: 'Shaman',
  // Restoration: Shaman or Druid — defaulting to Druid.
  Restoration: 'Druid',
  // Mage
  Arcane: 'Mage',
  Fire: 'Mage',
  // Warlock
  Affliction: 'Warlock',
  Demonology: 'Warlock',
  Destruction: 'Warlock',
  // Monk
  Brewmaster: 'Monk',
  Mistweaver: 'Monk',
  Windwalker: 'Monk',
  // Druid
  Balance: 'Druid',
  Feral: 'Druid',
  Guardian: 'Druid',
  // Demon Hunter
  Havoc: 'Demon Hunter',
  Vengeance: 'Demon Hunter',
  // Evoker
  Devastation: 'Evoker',
  Preservation: 'Evoker',
  Augmentation: 'Evoker',
};

function inferClass(className: string, specName: string): WowClass | 'Unknown' {
  if (WOW_CLASS_SET.has(className)) return className as WowClass;
  return SPEC_TO_CLASS[specName] ?? 'Unknown';
}

function inferStatus(className: string): RosterStatus {
  return className.toLowerCase() === TENTATIVE_LABEL ? 'pending' : 'confirmed';
}

function isAbsence(className: string): boolean {
  return className.toLowerCase() === ABSENCE_LABEL;
}

function normalizeSignUp(raw: RawRaidHelperEvent, signUp: RawRaidHelperSignUp, isHorde: boolean): RaidEvent {
  return {
    id: `raid-helper:${raw.id}:${signUp.id}`,
    source: 'raid-helper',
    raidHelperEventId: raw.id,
    raidName: raw.title,
    startsAt: new Date(raw.startTime * 1000).toISOString(),
    endsAt: new Date(raw.endTime * 1000).toISOString(),
    status: inferStatus(signUp.className),
    character: {
      name: signUp.name,
      className: inferClass(signUp.className, signUp.specName),
      spec: signUp.specName,
    },
    isHorde,
  };
}

/**
 * `isHorde` is resolved by the caller (title match, overridden by any explicit
 * horde_tags row for `raw.id`) so this stays a pure mapping from raid-helper's
 * shape to ours.
 */
export function normalizeRaidHelperEvent(raw: RawRaidHelperEvent, isHorde: boolean): RaidEvent[] {
  return raw.signUps
    .filter((signUp) => !isAbsence(signUp.className))
    .map((signUp) => normalizeSignUp(raw, signUp, isHorde));
}
