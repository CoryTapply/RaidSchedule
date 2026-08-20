import { beforeEach, describe, expect, it } from 'vitest';
import { getStoredClass, localDateTimeToIso, makeCustomEventId, setStoredClass } from './composer.js';

beforeEach(() => {
  localStorage.clear();
});

describe('localDateTimeToIso', () => {
  it('produces an instant matching the given local date and time', () => {
    const iso = localDateTimeToIso('2026-08-18', '20:00');
    const d = new Date(iso);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(7);
    expect(d.getDate()).toBe(18);
    expect(d.getHours()).toBe(20);
    expect(d.getMinutes()).toBe(0);
  });

  it('handles single-digit hours and minutes', () => {
    const iso = localDateTimeToIso('2026-01-05', '09:05');
    const d = new Date(iso);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(5);
    expect(d.getHours()).toBe(9);
    expect(d.getMinutes()).toBe(5);
  });
});

describe('makeCustomEventId', () => {
  it('returns unique ids prefixed with custom:', () => {
    const a = makeCustomEventId();
    const b = makeCustomEventId();
    expect(a).not.toBe(b);
    expect(a.startsWith('custom:')).toBe(true);
    expect(b.startsWith('custom:')).toBe(true);
  });
});

describe('getStoredClass / setStoredClass', () => {
  it('returns null when nothing has been stored', () => {
    expect(getStoredClass()).toBeNull();
  });

  it('round-trips a stored class', () => {
    setStoredClass('Shaman');
    expect(getStoredClass()).toBe('Shaman');
  });

  it('ignores an unrecognized stored value', () => {
    localStorage.setItem('raidschedule.composer.lastClass', 'Not A Class');
    expect(getStoredClass()).toBeNull();
  });
});
