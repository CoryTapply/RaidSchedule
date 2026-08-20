import type { WowClass } from './types.js';

/** Blizzard's canonical class colors — hardcoded per the design system, not design tokens. */
export const CLASS_COLORS: Record<WowClass, string> = {
  'Death Knight': '#C41E3A',
  'Demon Hunter': '#A330C9',
  Druid: '#FF7C0A',
  Evoker: '#33937F',
  Hunter: '#AAD372',
  Mage: '#3FC7EB',
  Monk: '#00FF98',
  Paladin: '#F48CBA',
  Priest: '#FFFFFF',
  Rogue: '#FFF468',
  Shaman: '#0070DD',
  Warlock: '#8788EE',
  Warrior: '#C69B6D',
};

const UNKNOWN_CLASS_COLOR = '#9E9EA6';

export function classColor(className: WowClass | 'Unknown'): string {
  if (className === 'Unknown') return UNKNOWN_CLASS_COLOR;
  return CLASS_COLORS[className];
}
