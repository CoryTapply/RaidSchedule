import { describe, expect, it } from 'vitest';
import { normalizeRaidHelperEvent } from './normalize.js';
import type { RawRaidHelperEvent } from './types.js';
import fixture from './fixtures/sample-raid-helper-response.json' with { type: 'json' };

const rawEvents = fixture as unknown as RawRaidHelperEvent[];

describe('normalizeRaidHelperEvent', () => {
  it('maps a real class name straight through as confirmed', () => {
    const [event] = normalizeRaidHelperEvent(rawEvents[0]!, false);
    expect(event).toMatchObject({
      source: 'raid-helper',
      status: 'confirmed',
      character: { name: 'Thrashclaw', className: 'Druid', spec: 'Balance' },
    });
  });

  it('infers a class from specName when className is a role, and treats it as confirmed', () => {
    const events = normalizeRaidHelperEvent(rawEvents[0]!, false);
    const ironhide = events.find((e) => e.character.name === 'Ironhide');
    expect(ironhide).toMatchObject({
      status: 'confirmed',
      character: { className: 'Warrior', spec: 'Protection' },
    });
  });

  it('filters out Absence sign-ups entirely', () => {
    const events = normalizeRaidHelperEvent(rawEvents[0]!, false);
    expect(events.find((e) => e.character.name === 'Windrunner')).toBeUndefined();
  });

  it('maps Tentative to pending status, while still inferring class from specName', () => {
    const events = normalizeRaidHelperEvent(rawEvents[0]!, false);
    const stormcaller = events.find((e) => e.character.name === 'Stormcaller');
    expect(stormcaller).toMatchObject({ status: 'pending', character: { className: 'Shaman', spec: 'Elemental' } });
  });

  it('falls back to Unknown for an unrecognized className and specName', () => {
    const raw: RawRaidHelperEvent = {
      ...rawEvents[0]!,
      signUps: [{ ...rawEvents[0]!.signUps[0]!, className: 'Melee', specName: 'Some Custom Spec' }],
    };
    const [event] = normalizeRaidHelperEvent(raw, false);
    expect(event!.character.className).toBe('Unknown');
  });

  it('produces one RaidEvent per non-absence sign-up, namespaced by event id and sign-up id', () => {
    const raw = rawEvents[0]!;
    const events = normalizeRaidHelperEvent(raw, false);
    expect(events).toHaveLength(raw.signUps.length - 1); // minus the one Absence entry
    expect(events[0]!.id).toBe(`raid-helper:${raw.id}:${raw.signUps[0]!.id}`);
    expect(events[0]!.raidHelperEventId).toBe(raw.id);
  });

  it('converts unix-second timestamps to ISO 8601 UTC strings', () => {
    const raw = rawEvents[0]!;
    const [event] = normalizeRaidHelperEvent(raw, false);
    expect(event!.startsAt).toBe(new Date(raw.startTime * 1000).toISOString());
    expect(event!.endsAt).toBe(new Date(raw.endTime * 1000).toISOString());
  });

  it('passes the isHorde flag through onto every produced sign-up', () => {
    const events = normalizeRaidHelperEvent(rawEvents[0]!, true);
    expect(events.every((e) => e.isHorde)).toBe(true);
  });
});
