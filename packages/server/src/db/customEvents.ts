import { randomUUID } from 'node:crypto';
import type { CreateCustomEventInput, RaidEvent, RosterStatus, WowClass } from '@raidschedule/shared';
import type Database from 'better-sqlite3';

interface CustomEventRow {
  id: string;
  raid_name: string;
  starts_at: string;
  ends_at: string | null;
  status: 'pending' | 'confirmed';
  character_name: string;
  character_class_name: WowClass | 'Unknown';
  character_spec: string | null;
  is_horde: number;
}

function rowToRaidEvent(row: CustomEventRow): RaidEvent {
  return {
    id: `custom:${row.id}`,
    source: 'custom',
    raidName: row.raid_name,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    status: row.status,
    character: {
      name: row.character_name,
      className: row.character_class_name,
      spec: row.character_spec ?? undefined,
    },
    isHorde: Boolean(row.is_horde),
  };
}

export function listCustomEvents(db: Database.Database): RaidEvent[] {
  const rows = db.prepare('SELECT * FROM custom_events ORDER BY starts_at').all() as CustomEventRow[];
  return rows.map(rowToRaidEvent);
}

export function deleteCustomEvent(db: Database.Database, id: string): boolean {
  const result = db.prepare('DELETE FROM custom_events WHERE id = ?').run(id);
  return result.changes > 0;
}

export function updateCustomEventStatus(db: Database.Database, id: string, status: RosterStatus): RaidEvent | null {
  const result = db.prepare('UPDATE custom_events SET status = ? WHERE id = ?').run(status, id);
  if (result.changes === 0) return null;
  const row = db.prepare('SELECT * FROM custom_events WHERE id = ?').get(id) as CustomEventRow;
  return rowToRaidEvent(row);
}

export function updateCustomEventFaction(db: Database.Database, id: string, isHorde: boolean): RaidEvent | null {
  const result = db.prepare('UPDATE custom_events SET is_horde = ? WHERE id = ?').run(isHorde ? 1 : 0, id);
  if (result.changes === 0) return null;
  const row = db.prepare('SELECT * FROM custom_events WHERE id = ?').get(id) as CustomEventRow;
  return rowToRaidEvent(row);
}

export function insertCustomEvent(db: Database.Database, input: CreateCustomEventInput): RaidEvent {
  const id = randomUUID();
  const isHorde = input.isHorde ? 1 : 0;
  db.prepare(
    `INSERT INTO custom_events (id, raid_name, starts_at, ends_at, status, character_name, character_class_name, character_spec, is_horde)
     VALUES (@id, @raidName, @startsAt, @endsAt, @status, @characterName, @characterClassName, @characterSpec, @isHorde)`,
  ).run({
    id,
    raidName: input.raidName,
    startsAt: input.startsAt,
    endsAt: input.endsAt ?? null,
    status: input.status,
    characterName: input.character.name,
    characterClassName: input.character.className,
    characterSpec: input.character.spec ?? null,
    isHorde,
  });
  return rowToRaidEvent({
    id,
    raid_name: input.raidName,
    starts_at: input.startsAt,
    ends_at: input.endsAt ?? null,
    status: input.status,
    character_name: input.character.name,
    character_class_name: input.character.className,
    character_spec: input.character.spec ?? null,
    is_horde: isHorde,
  });
}
