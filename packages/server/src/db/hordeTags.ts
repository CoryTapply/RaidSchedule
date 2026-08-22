import type Database from 'better-sqlite3';

interface HordeTagRow {
  raid_helper_event_id: string;
  is_horde: 0 | 1;
}

/** All explicit Horde overrides, keyed by raid-helper event id. */
export function getHordeTags(db: Database.Database): Map<string, boolean> {
  const rows = db.prepare('SELECT raid_helper_event_id, is_horde FROM horde_tags').all() as HordeTagRow[];
  return new Map(rows.map((row) => [row.raid_helper_event_id, row.is_horde === 1]));
}

export function setHordeTag(db: Database.Database, raidHelperEventId: string, isHorde: boolean): void {
  db.prepare(
    `INSERT INTO horde_tags (raid_helper_event_id, is_horde, updated_at)
     VALUES (@raidHelperEventId, @isHorde, datetime('now'))
     ON CONFLICT (raid_helper_event_id) DO UPDATE SET is_horde = @isHorde, updated_at = datetime('now')`,
  ).run({ raidHelperEventId, isHorde: isHorde ? 1 : 0 });
}
