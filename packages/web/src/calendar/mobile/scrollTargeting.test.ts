import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pickActiveKey, rowTop, scrollToKey } from './scrollTargeting.js';

function rectAt(top: number): DOMRect {
  return { top, left: 0, right: 0, bottom: top, width: 0, height: 0, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
}

function makeRow(scrollerTop: number, elTop: number): { scroller: HTMLElement; el: HTMLElement } {
  const scroller = document.createElement('div');
  vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue(rectAt(scrollerTop));
  const el = document.createElement('div');
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rectAt(elTop));
  return { scroller, el };
}

describe('rowTop', () => {
  it('combines the scroller scrollTop with the rect delta', () => {
    const { scroller, el } = makeRow(0, 120);
    scroller.scrollTop = 50;
    expect(rowTop(scroller, el)).toBe(170);
  });

  it('is independent of the scroller not being the offsetParent — only rects matter', () => {
    const { scroller, el } = makeRow(30, 120);
    expect(rowTop(scroller, el)).toBe(90);
  });
});

describe('scrollToKey', () => {
  it('scrolls to the row top minus 6px, clamped to 0', () => {
    const scroller = document.createElement('div');
    vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue(rectAt(0));
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rectAt(2));
    const scrollTo = vi.fn();
    scroller.scrollTo = scrollTo;

    scrollToKey(scroller, new Map([['k', el]]), 'k', 'smooth');

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('is a no-op for an unknown key', () => {
    const scroller = document.createElement('div');
    const scrollTo = vi.fn();
    scroller.scrollTo = scrollTo;

    scrollToKey(scroller, new Map(), 'missing', 'auto');

    expect(scrollTo).not.toHaveBeenCalled();
  });
});

describe('pickActiveKey', () => {
  let scroller: HTMLElement;

  beforeEach(() => {
    scroller = document.createElement('div');
    vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue(rectAt(0));
    scroller.scrollTop = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('picks the greatest rowTop at or above the threshold', () => {
    const a = document.createElement('div');
    vi.spyOn(a, 'getBoundingClientRect').mockReturnValue(rectAt(-100));
    const b = document.createElement('div');
    vi.spyOn(b, 'getBoundingClientRect').mockReturnValue(rectAt(0));
    const c = document.createElement('div');
    vi.spyOn(c, 'getBoundingClientRect').mockReturnValue(rectAt(500));
    document.body.append(a, b, c);

    const rowEls = new Map([
      ['a', a],
      ['b', b],
      ['c', c],
    ]);

    expect(pickActiveKey(scroller, rowEls)).toBe('b');
    a.remove();
    b.remove();
    c.remove();
  });

  it('skips rows detached from the document', () => {
    const attached = document.createElement('div');
    vi.spyOn(attached, 'getBoundingClientRect').mockReturnValue(rectAt(-50));
    document.body.appendChild(attached);
    const detached = document.createElement('div');
    vi.spyOn(detached, 'getBoundingClientRect').mockReturnValue(rectAt(0));
    // never appended — el.isConnected stays false

    const rowEls = new Map([
      ['attached', attached],
      ['detached', detached],
    ]);

    expect(pickActiveKey(scroller, rowEls)).toBe('attached');
    document.body.removeChild(attached);
  });

  it('returns null when nothing qualifies', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rectAt(500));
    document.body.appendChild(el);
    expect(pickActiveKey(scroller, new Map([['k', el]]))).toBeNull();
    el.remove();
  });
});
