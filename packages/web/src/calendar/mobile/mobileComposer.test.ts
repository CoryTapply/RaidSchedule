import { describe, expect, it } from 'vitest';
import { withStartTime } from './mobileComposer.js';

describe('withStartTime', () => {
  it('shifts end by the same duration', () => {
    expect(withStartTime({ start: '18:00', end: '21:00' }, '19:00')).toEqual({ start: '19:00', end: '22:00' });
  });

  it('preserves a sub-hour duration', () => {
    expect(withStartTime({ start: '20:00', end: '20:45' }, '19:00')).toEqual({ start: '19:00', end: '19:45' });
  });

  it('floors the duration at 30 minutes when start and end already coincide', () => {
    expect(withStartTime({ start: '20:00', end: '20:00' }, '21:00')).toEqual({ start: '21:00', end: '21:30' });
  });

  it('floors the duration at 30 minutes when end is before start', () => {
    expect(withStartTime({ start: '20:00', end: '19:00' }, '10:00')).toEqual({ start: '10:00', end: '10:30' });
  });

  it('clamps end to the end of the day rather than wrapping', () => {
    expect(withStartTime({ start: '20:00', end: '23:00' }, '23:30')).toEqual({ start: '23:30', end: '23:59' });
  });
});
