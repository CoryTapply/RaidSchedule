/**
 * Default (title-based) Horde detection. A raid-helper raid can also be tagged
 * as Horde explicitly (see `RaidEvent.isHorde`/`raidHelperEventId`), which
 * overrides this in either direction — this function is only the fallback
 * used when no explicit tag exists for that raid.
 */
export function isHordeTitle(raidName: string): boolean {
  return /horde/i.test(raidName);
}
