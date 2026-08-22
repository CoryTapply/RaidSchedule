import { describe, expect, it } from 'vitest';
import { isHordeTitle } from './horde.js';

describe('isHordeTitle', () => {
  it('matches "horde" case-insensitively anywhere in the title', () => {
    expect(isHordeTitle('Thursday Horde Run')).toBe(true);
    expect(isHordeTitle('HORDE NAXX GDKP')).toBe(true);
    expect(isHordeTitle('friday horde gdkp')).toBe(true);
    expect(isHordeTitle('Wed Ally Run')).toBe(false);
    expect(isHordeTitle('Nerub-ar Palace')).toBe(false);
  });
});
