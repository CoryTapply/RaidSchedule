import { describe, expect, it } from 'vitest';
import { timeRangeLabel } from './format.js';

describe('timeRangeLabel', () => {
  it('joins start and end with an en dash', () => {
    const start = new Date(2026, 7, 29, 20, 0).toISOString();
    const end = new Date(2026, 7, 29, 23, 0).toISOString();
    expect(timeRangeLabel(start, end)).toBe('8:00 PM – 11:00 PM');
  });

  it('falls back to just the start time when there is no end', () => {
    const start = new Date(2026, 7, 29, 20, 0).toISOString();
    expect(timeRangeLabel(start)).toBe('8:00 PM');
  });
});
