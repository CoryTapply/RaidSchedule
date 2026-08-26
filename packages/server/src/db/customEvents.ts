import { randomUUID } from 'node:crypto';
import type { CreateCustomEventInput, RaidEvent, UpdateCustomEventInput, WowClass } from '@raidschedule/shared';
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

/** Merges `patch` onto the existing row — a PATCH only writes the keys it's given. Returns null if `id` doesn't exist. */
export function updateCustomEvent(db: Database.Database, id: string, patch: UpdateCustomEventInput): RaidEvent | null {
  const existing = db.prepare('SELECT * FROM custom_events WHERE id = ?').get(id) as CustomEventRow | undefined;
  if (!existing) return null;

  const merged: CustomEventRow = {
    ...existing,
    raid_name: patch.raidName ?? existing.raid_name,
    starts_at: patch.startsAt ?? existing.starts_at,
    ends_at: patch.endsAt !== undefined ? patch.endsAt : existing.ends_at,
    status: patch.status ?? existing.status,
    character_name: patch.character?.name ?? existing.character_name,
    character_class_name: patch.character?.className ?? existing.character_class_name,
    character_spec: patch.character?.spec !== undefined ? patch.character.spec : existing.character_spec,
    is_horde: patch.isHorde !== undefined ? (patch.isHorde ? 1 : 0) : existing.is_horde,
  };

  db.prepare(
    `UPDATE custom_events
     SET raid_name = @raid_name, starts_at = @starts_at, ends_at = @ends_at, status = @status,
         character_name = @character_name, character_class_name = @character_class_name,
         character_spec = @character_spec, is_horde = @is_horde
     WHERE id = @id`,
  ).run({ ...merged, id });

  return rowToRaidEvent(merged);
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
