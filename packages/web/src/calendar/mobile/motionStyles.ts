import type { CSSProperties } from 'react';

/**
 * CSS Modules scopes bare identifiers inside `animation`/`animation-name` shorthand — even
 * when no local @keyframes of that name exists in the file — so a reference to a keyframe
 * defined in controls.css written directly into a .module.css rule silently resolves to a
 * hashed name with no matching @keyframes, and the animation never plays.
 * Inline style values aren't touched by that transform, so the keyframe name stays literal
 * here and actually resolves.
 */
export const toastSlideIn: CSSProperties = { animation: 'zp-slide-in var(--zp-dur) var(--zp-ease)' };
