import { addDays, type RaidEvent, type RosterStatus, type WowClass } from '@raidschedule/shared';

interface SeedEntry {
  offset: number;
  character: string;
  className: WowClass;
  raidName: string;
  time: string;
  status: RosterStatus;
}

const SEED: SeedEntry[] = [
  { offset: 1, character: 'Thrashclaw', className: 'Druid', raidName: 'Nerub-ar Palace', time: '20:00', status: 'confirmed' },
  { offset: 1, character: 'Windrunner', className: 'Hunter', raidName: 'Nerub-ar Palace', time: '20:00', status: 'confirmed' },
  { offset: 3, character: 'Ironhide', className: 'Warrior', raidName: 'Liberation of Undermine', time: '19:30', status: 'pending' },
  { offset: 5, character: 'Stormcaller', className: 'Shaman', raidName: 'Nerub-ar Palace', time: '20:00', status: 'confirmed' },
  { offset: 5, character: 'Thrashclaw', className: 'Druid', raidName: 'Nerub-ar Palace', time: '20:00', status: 'confirmed' },
  { offset: 8, character: 'Windrunner', className: 'Hunter', raidName: 'Liberation of Undermine', time: '19:00', status: 'pending' },
  { offset: 10, character: 'Ironhide', className: 'Warrior', raidName: 'Nerub-ar Palace', time: '20:00', status: 'confirmed' },
  { offset: 12, character: 'Stormcaller', className: 'Shaman', raidName: 'Vault Farm Night', time: '19:00', status: 'pending' },
  { offset: 15, character: 'Thrashclaw', className: 'Druid', raidName: 'Liberation of Undermine', time: '19:30', status: 'confirmed' },
  { offset: 17, character: 'Windrunner', className: 'Hunter', raidName: 'Nerub-ar Palace', time: '20:00', status: 'confirmed' },
  { offset: 17, character: 'Ironhide', className: 'Warrior', raidName: 'Nerub-ar Palace', time: '20:00', status: 'pending' },
  { offset: 19, character: 'Stormcaller', className: 'Shaman', raidName: 'Liberation of Undermine', time: '19:30', status: 'confirmed' },
];

/** Local dev/offline fallback data, ported from the design prototype's EVENT_SEED, relative to `anchor`. */
export function buildSeedEvents(anchor: Date): RaidEvent[] {
  return SEED.map((seed, i) => {
    const [hours, minutes] = seed.time.split(':').map(Number);
    const startsAt = addDays(anchor, seed.offset);
    startsAt.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    return {
      id: `seed:${i}`,
      source: 'custom',
      raidName: seed.raidName,
      startsAt: startsAt.toISOString(),
      status: seed.status,
      character: {
        name: seed.character,
        className: seed.className,
      },
    } satisfies RaidEvent;
  });
}
