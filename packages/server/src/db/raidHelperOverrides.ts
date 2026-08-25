import type { RosterStatus, WowClass } from '@raidschedule/shared';
import type Database from 'better-sqlite3';

interface RaidHelperOverrideRow {
  event_id: string;
  raid_name: string | null;
  character_name: string | null;
  character_class_name: (WowClass | 'Unknown') | null;
  status: RosterStatus | null;
}

export interface RaidHelperOverride {
  raidName?: string;
  characterName?: string;
  characterClassName?: WowClass | 'Unknown';
  status?: RosterStatus;
}

/** All local identity overrides for Raid-Helper-sourced events, keyed by the full `RaidEvent.id` (one per sign-up). */
export function getRaidHelperOverrides(db: Database.Database): Map<string, RaidHelperOverride> {
  const rows = db.prepare('SELECT * FROM raid_helper_overrides').all() as RaidHelperOverrideRow[];
  const map = new Map<string, RaidHelperOverride>();
  for (const row of rows) {
    map.set(row.event_id, {
      raidName: row.raid_name ?? undefined,
      characterName: row.character_name ?? undefined,
      characterClassName: row.character_class_name ?? undefined,
      status: row.status ?? undefined,
    });
  }
  return map;
}

/** Merges `patch` onto any existing override row for `eventId` — only the given keys change. */
export function setRaidHelperOverride(db: Database.Database, eventId: string, patch: RaidHelperOverride): void {
  const existing = db.prepare('SELECT * FROM raid_helper_overrides WHERE event_id = ?').get(eventId) as
    | RaidHelperOverrideRow
    | undefined;
  db.prepare(
    `INSERT INTO raid_helper_overrides (event_id, raid_name, character_name, character_class_name, status, updated_at)
     VALUES (@eventId, @raidName, @characterName, @characterClassName, @status, datetime('now'))
     ON CONFLICT (event_id) DO UPDATE SET
       raid_name = @raidName, character_name = @characterName,
       character_class_name = @characterClassName, status = @status, updated_at = datetime('now')`,
  ).run({
    eventId,
    raidName: patch.raidName ?? existing?.raid_name ?? null,
    characterName: patch.characterName ?? existing?.character_name ?? null,
    characterClassName: patch.characterClassName ?? existing?.character_class_name ?? null,
    status: patch.status ?? existing?.status ?? null,
  });
}

export function applyRaidHelperOverride<T extends { raidName: string; status: RosterStatus; character: { name: string; className: WowClass | 'Unknown' } }>(
  event: T,
  override: RaidHelperOverride | undefined,
): T {
  if (!override) return event;
  return {
    ...event,
    raidName: override.raidName ?? event.raidName,
    status: override.status ?? event.status,
    character: {
      ...event.character,
      name: override.characterName ?? event.character.name,
      className: override.characterClassName ?? event.character.className,
    },
  };
}
