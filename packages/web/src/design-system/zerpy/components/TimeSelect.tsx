import React from 'react';

export type TimeValue = number | null; // minutes since midnight, 0–1439

const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
const norm = (v: number) => ((v % 1440) + 1440) % 1440;

export function formatTime(value: TimeValue): string {
  if (value == null || isNaN(value)) return '';
  const t = norm(value);
  const h = Math.floor(t / 60);
  let hh = h % 12;
  if (!hh) hh = 12;
  return hh + ':' + pad(t % 60) + ' ' + (h < 12 ? 'AM' : 'PM');
}

/** Lenient: "9:30 PM" "9:30pm" "930p" "9 30 pm" "9.30 PM" "0930" "21:30" "9pm" "9". Clamps. */
export function parseTime(input: string): TimeValue {
  const s = String(input ?? '').trim().toLowerCase().replace(/\./g, ':').replace(/\s+/g, ' ');
  if (!s) return null;
  const m = s.match(/^(\d{1,2})(?:[:\s]?(\d{2}))?\s*(am|pm|a|p)?$/);
  if (!m) return null;
  let h = parseInt(m[1]!, 10);
  let mi = m[2] == null ? 0 : parseInt(m[2], 10);
  const ap = m[3] ? m[3][0] : null;
  if (mi > 59) mi = 59;
  if (ap) {
    if (h > 12 || h < 1) h = 12;
    h = (h % 12) + (ap === 'p' ? 12 : 0);
  } else if (h > 23) h = 23;
  return h * 60 + mi;
}

export interface TimeSelectProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  onInputChange?: (raw: string) => void;
  onOpenChange?: (open: boolean) => void;
  min?: TimeValue;
  max?: TimeValue;
  interval?: number;
  step?: number;
  defaultMeridiem?: 'AM' | 'PM';
  relativeTo?: TimeValue;
  align?: 'start' | 'end';
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  openOnFocus?: boolean;
  id?: string;
  name?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

type Seg = 'h' | 'm' | 'a';
interface Draft { hour: string; minute: string; meridiem: 'AM' | 'PM' | null; seg: Seg }

const ROW = 30;

export function TimeSelect({
  value, onChange, onInputChange, onOpenChange,
  min = 0, max = 1439, interval = 15, step = 1,
  defaultMeridiem = 'AM', relativeTo, align = 'start',
  placeholder = '--:-- --', disabled = false, readOnly = false,
  invalid = false, required = false, openOnFocus = false,
  id, name, ...aria
}: TimeSelectProps) {
  // eslint-disable-next-line react-hooks/purity -- vendored Zerpy source; one-time id generated on mount via the empty dep array
  const uid = React.useMemo(() => 'ts' + Math.random().toString(36).slice(2, 7), []);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  // The draft lives in a ref as well as in state, so several keystrokes inside
  // one React batch still see each other's result.
  const d = React.useRef<Draft>({ hour: '', minute: '', meridiem: null, seg: 'h' });
  // Per segment: does the next digit replace what is there, or extend it?
  const fresh = React.useRef({ h: true, m: true, a: true });
  const [, bump] = React.useReducer((n: number) => n + 1, 0);
  const [open, setOpenState] = React.useState(false);
  const [hi, setHi] = React.useState(-1);
  const [focused, setFocused] = React.useState(false);
  const [flash, setFlash] = React.useState(false);
  const [selAll, setSelAll] = React.useState(false);
  const [live, setLive] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- vendored Zerpy source; timer handle type differs between DOM and Node lib typings
  const liveT = React.useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- vendored Zerpy source; timer handle type differs between DOM and Node lib typings
  const flashT = React.useRef<any>(null);

  const lo = Math.min(min ?? 0, max ?? 1439);
  const hiBound = Math.max(min ?? 0, max ?? 1439);

  const sync = React.useCallback((v: TimeValue) => {
    if (v == null || isNaN(v)) Object.assign(d.current, { hour: '', minute: '', meridiem: null });
    else {
      const t = norm(v), h = Math.floor(t / 60);
      let hh = h % 12; if (!hh) hh = 12;
      Object.assign(d.current, { hour: String(hh), minute: pad(t % 60), meridiem: h < 12 ? 'AM' : 'PM' });
    }
    fresh.current = { h: true, m: true, a: true };
    bump();
  }, []);

  React.useEffect(() => { if (!focused) sync(value); }, [value, focused, sync]);
  React.useEffect(() => () => { clearTimeout(liveT.current); clearTimeout(flashT.current); }, []);

  const texts = () => ({
    h: d.current.hour === '' ? '--' : d.current.hour,
    m: d.current.minute === '' ? '--' : d.current.minute,
    a: d.current.meridiem || '--',
  });
  const isEmpty = () => d.current.hour === '' && d.current.minute === '' && !d.current.meridiem;
  // eslint-disable-next-line react-hooks/refs -- vendored Zerpy source; draft lives in a ref by design (see comment above d's declaration) and this reads it during render to compute display text
  const display = isEmpty() && !focused ? placeholder : (() => { const t = texts(); return t.h + ':' + t.m + ' ' + t.a; })();
  const ranges = () => {
    const t = texts();
    const hEnd = t.h.length, mStart = hEnd + 1, mEnd = mStart + t.m.length, aStart = mEnd + 1;
    return { h: [0, hEnd], m: [mStart, mEnd], a: [aStart, aStart + t.a.length] } as Record<Seg, number[]>;
  };

  React.useEffect(() => {
    const el = inputRef.current;
    if (!el || !focused || selAll || document.activeElement !== el) return;
    const r = ranges()[d.current.seg];
    if (el.selectionStart !== r[0] || el.selectionEnd !== r[1]) el.setSelectionRange(r[0]!, r[1]!);
  });

  const announce = (text: string) => {
    clearTimeout(liveT.current);
    liveT.current = setTimeout(() => setLive(text), 150);
  };
  const set = (patch: Partial<Draft>, ann?: string) => {
    Object.assign(d.current, patch);
    if (onInputChange) { const t = texts(); onInputChange(t.h + ':' + t.m + ' ' + t.a); }
    bump();
    if (ann !== undefined) announce(ann);
  };
  const setSeg = (seg: Seg) => { d.current.seg = seg; fresh.current[seg] = true; setSelAll(false); bump(); };

  const draftValue = (): TimeValue => {
    const s = d.current;
    if (s.hour === '' && s.minute === '' && !s.meridiem) return null;
    let h = s.hour === '' ? 12 : parseInt(s.hour, 10);
    if (h === 0 || h > 12) h = 12;
    const mm = s.minute === '' ? 0 : (s.minute.length === 1 ? parseInt(s.minute, 10) * 10 : parseInt(s.minute, 10));
    const mer = s.meridiem || defaultMeridiem;
    return (h % 12) * 60 + (mer === 'PM' ? 720 : 0) + Math.min(mm, 59);
  };
  const clamp = (v: number) => Math.min(Math.max(v, lo), hiBound);
  const commit = () => {
    let v = draftValue();
    if (v == null) {
      if (required && min != null) v = min;
      else { if (value != null) onChange(null); return; }
    }
    v = clamp(v);
    sync(v);
    if (v !== value) onChange(v);
  };
  const applyValue = (v: number) => {
    const c = clamp(v);
    sync(c);
    if (c !== value) onChange(c);
    announce(formatTime(c));
  };

  const optionValues = () => {
    const iv = Math.max(1, interval);
    const from = relativeTo != null ? Math.max(lo, relativeTo + iv) : lo;
    const out: number[] = [];
    for (let v = Math.ceil(from / iv) * iv; v <= hiBound; v += iv) out.push(v);
    return out;
  };
  const nearestIndex = () => {
    const vals = optionValues();
    const cur = draftValue() ?? value;
    if (cur == null || !vals.length) return 0;
    let best = 0, bd = Infinity;
    vals.forEach((v, i) => { const dd = Math.abs(v - cur); if (dd < bd) { bd = dd; best = i; } });
    return best;
  };
  const setOpen = (next: boolean) => {
    if (next === open) return;
    setOpenState(next);
    setHi(next ? nearestIndex() : -1);
    onOpenChange?.(next);
  };
  const moveHi = (dir: number) => {
    const n = optionValues().length;
    if (n) setHi(i => (i + dir + n) % n);
  };

  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = Math.max(0, Math.max(0, hi) * ROW - 84);
    const away = (e: MouseEvent) => {
      if (rootRef.current && rootRef.current.contains(e.target as Node)) return;
      commit();
      setOpen(false);
    };
    document.addEventListener('mousedown', away, true);
    return () => document.removeEventListener('mousedown', away, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    const top = Math.max(0, hi) * ROW;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (top + ROW > el.scrollTop + el.clientHeight) el.scrollTop = top + ROW - el.clientHeight;
  }, [hi, open]);

  const stepSeg = (dir: number) => {
    const s = d.current;
    if (s.seg === 'h') {
      let h = s.hour === '' ? 12 : parseInt(s.hour, 10);
      if (!h || h > 12) h = 12;
      h += dir; if (h > 12) h = 1; if (h < 1) h = 12;
      set({ hour: String(h) }, String(h));
    } else if (s.seg === 'm') {
      const st = Math.max(1, step);
      let m = s.minute === '' ? 0 : (s.minute.length === 1 ? parseInt(s.minute, 10) * 10 : parseInt(s.minute, 10));
      m = (m + dir * st + 60) % 60;
      set({ minute: pad(m) }, pad(m));
    } else {
      const mer = (s.meridiem || defaultMeridiem) === 'AM' ? 'PM' : 'AM';
      set({ meridiem: mer }, mer);
    }
  };

  const typeDigit = (digit: string, restart: boolean) => {
    if (restart) {
      Object.assign(d.current, { hour: '', minute: '', meridiem: null, seg: 'h' });
      fresh.current = { h: true, m: true, a: true };
    }
    const s = d.current;
    if (s.seg === 'h') {
      const cur = fresh.current.h ? '' : s.hour;
      fresh.current.h = false;
      const toMinute = (patch: Partial<Draft>, ann?: string) => { fresh.current.m = true; set(patch, ann); };
      if (cur === '') {
        if (digit === '1' || digit === '0') return set({ hour: digit, seg: 'h' });
        return toMinute({ hour: digit, seg: 'm' }, digit);
      }
      if (cur === '1') {
        if (digit <= '2') return toMinute({ hour: '1' + digit, seg: 'm' }, '1' + digit);
        // 3-9: the hour stays 1 and the digit becomes the first minute digit
        fresh.current.m = false;
        const patch: Partial<Draft> = { hour: '1', seg: 'm' };
        if (digit <= '5') patch.minute = digit;
        else { patch.minute = '0' + digit; patch.seg = 'a'; }
        return set(patch, '1');
      }
      if (cur === '0') {
        if (digit === '0') return toMinute({ hour: '12', seg: 'm' }, '12');
        return toMinute({ hour: digit, seg: 'm' }, digit);
      }
      return; // third digit while pending: ignored
    }
    if (s.seg === 'm') {
      const cur = fresh.current.m ? '' : s.minute;
      if (cur.length === 2) return; // minute complete, digits ignored
      fresh.current.m = false;
      if (cur === '') {
        if (digit <= '5') return set({ minute: digit });
        fresh.current.a = true;
        return set({ minute: '0' + digit, seg: 'a' }, s.hour + ':0' + digit);
      }
      fresh.current.a = true;
      return set({ minute: cur + digit, seg: 'a' }, (s.hour || '') + ':' + cur + digit);
    }
    // meridiem: digits do nothing
  };

  const backspace = () => {
    const s = d.current;
    fresh.current = { h: false, m: false, a: false };
    if (s.seg === 'a') return set({ meridiem: null, seg: 'm', minute: s.minute.slice(0, -1) });
    if (s.seg === 'm') {
      if (s.minute !== '') return set({ minute: s.minute.slice(0, -1) });
      return set({ seg: 'h', hour: s.hour.slice(0, -1) });
    }
    if (s.hour !== '') set({ hour: s.hour.slice(0, -1) });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const k = e.key, s = d.current;
    if (k === 'Escape') {
      e.stopPropagation(); e.preventDefault();
      if (open) setOpen(false);
      else { sync(value); setSeg('h'); }
      return;
    }
    if ((e.metaKey || e.ctrlKey) && k.toLowerCase() === 'a') {
      const r = ranges();
      setSelAll(true);
      inputRef.current?.setSelectionRange(0, r.a[1]!);
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (k === 'Tab') { if (!readOnly) commit(); return; }
    if (k === 'Enter') {
      e.preventDefault();
      if (open) {
        const v = optionValues()[hi];
        if (v != null) applyValue(v);
        setOpen(false);
        setSeg('a');
      } else if (!readOnly) commit();
      return;
    }
    if (readOnly) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- vendored Zerpy source
    if (k === 'ArrowDown') { e.preventDefault(); open ? moveHi(1) : setOpen(true); return; }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- vendored Zerpy source
    if (k === 'ArrowUp') { e.preventDefault(); open ? moveHi(-1) : stepSeg(1); return; }
    if (k === 'ArrowLeft') { e.preventDefault(); setSeg(s.seg === 'a' ? 'm' : 'h'); return; }
    if (k === 'ArrowRight') { e.preventDefault(); setSeg(s.seg === 'h' ? 'm' : 'a'); return; }
    if (k === 'Home') { e.preventDefault(); setSeg('h'); return; }
    if (k === 'End') { e.preventDefault(); setSeg('a'); return; }
    if (k === 'Backspace') {
      e.preventDefault();
      if (selAll) { setSelAll(false); return set({ hour: '', minute: '', meridiem: null, seg: 'h' }); }
      backspace();
      return;
    }
    if (k === 'Delete') {
      e.preventDefault();
      setSelAll(false);
      if (s.seg === 'h') set({ hour: '' });
      else if (s.seg === 'm') set({ minute: '' });
      else set({ meridiem: null });
      return;
    }
    if (/^[0-9]$/.test(k)) {
      e.preventDefault();
      if (selAll) { setSelAll(false); typeDigit(k, true); } else typeDigit(k, false);
      return;
    }
    if (/^[ap]$/i.test(k)) {
      e.preventDefault();
      const mer = k.toLowerCase() === 'a' ? 'AM' : 'PM';
      const t = texts();
      setSelAll(false);
      set({ meridiem: mer, seg: 'a' }, t.h + ':' + t.m + ' ' + mer);
      return;
    }
    if (k.length === 1) e.preventDefault(); // 'm' included: absorbed so "AM"/"PM" typed as words work
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (readOnly || disabled) return;
    const v = parseTime(e.clipboardData.getData('text'));
    if (v == null) {
      clearTimeout(flashT.current);
      setFlash(true);
      flashT.current = setTimeout(() => setFlash(false), 200);
      return;
    }
    applyValue(v);
    setSeg('a');
  };

  const showInvalid = invalid || flash;
  const vals = open ? optionValues() : [];

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          id={id || uid}
          name={name}
          className={['zp-in', showInvalid ? 'zp-in-err' : ''].filter(Boolean).join(' ')}
          aria-expanded={open}
          aria-controls={uid + '-list'}
          aria-autocomplete="none"
          aria-activedescendant={open && hi >= 0 ? uid + '-o' + hi : undefined}
          aria-invalid={showInvalid || undefined}
          aria-label={aria['aria-label'] || 'Time'}
          aria-describedby={aria['aria-describedby']}
          disabled={disabled}
          readOnly={readOnly}
          value={display}
          onChange={() => {}}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onFocus={() => {
            d.current.seg = 'h';
            fresh.current = { h: true, m: true, a: true };
            setFocused(true); setSelAll(false);
            if (openOnFocus && !readOnly && !disabled) setOpen(true);
          }}
          onBlur={() => { setFocused(false); setSelAll(false); setOpen(false); if (!readOnly) commit(); }}
          onMouseUp={e => {
            const pos = (e.target as HTMLInputElement).selectionStart ?? 0;
            const r = ranges();
            setSeg(pos <= r.h[1]! ? 'h' : pos <= r.m[1]! ? 'm' : 'a');
          }}
          onDragStart={e => e.preventDefault()}
          style={{
            paddingRight: 30,
            font: 'var(--zp-text-data)',
            // eslint-disable-next-line react-hooks/refs -- vendored Zerpy source; see the display computation above
            color: showInvalid ? 'var(--zp-danger-text)' : (isEmpty() && !focused ? 'var(--zp-text-4)' : 'var(--zp-text)'),
            caretColor: 'transparent',
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Show times"
          disabled={disabled || readOnly}
          onMouseDown={e => { e.preventDefault(); if (disabled || readOnly) return; inputRef.current?.focus(); setOpen(!open); }}
          style={{
            position: 'absolute', right: 4, width: 24, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', borderRadius: 2, background: 'transparent',
            fontSize: 11, lineHeight: 1, cursor: 'pointer',
            color: open ? 'var(--zp-accent-300)' : 'var(--zp-text-4)',
            transition: 'color var(--zp-dur) var(--zp-ease)',
          }}
        >▾</button>
      </div>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          id={uid + '-list'}
          aria-label="Preset times"
          style={{
            position: 'absolute', zIndex: 20,
            top: 'calc(var(--zp-control-h) + 4px)',
            left: align === 'end' ? 'auto' : 0,
            right: align === 'end' ? 0 : 'auto',
            minWidth: '100%', width: 'max-content', maxWidth: 220, maxHeight: 198,
            boxSizing: 'border-box', padding: 4, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 2,
            background: 'var(--zp-surface-overlay)',
            backdropFilter: 'blur(var(--zp-blur-lg))',
            border: '1px solid var(--zp-line-strong)',
            borderRadius: 'var(--zp-radius-md)',
            boxShadow: 'var(--zp-elev-overlay)',
            animation: 'zp-slide-in var(--zp-dur-fast) var(--zp-ease)',
          }}
        >
          {vals.map((v, i) => {
            const on = i === hi;
            const selected = value != null && v === value;
            let sub = '';
            if (relativeTo != null) {
              const dur = v - relativeTo;
              sub = dur >= 60
                ? (dur % 60 === 0 ? dur / 60 + ' hr' : Math.floor(dur / 60) + ' hr ' + (dur % 60) + ' min')
                : dur + ' min';
            }
            return (
              <div
                key={v}
                id={uid + '-o' + i}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHi(i)}
                onMouseDown={e => {
                  e.preventDefault();
                  applyValue(v);
                  setOpen(false);
                  setSeg('a');
                  inputRef.current?.focus();
                }}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 'var(--zp-space-3)', height: 28, padding: '0 var(--zp-space-2)', boxSizing: 'border-box',
                  border: '1px solid ' + (on ? 'var(--zp-line-accent)' : 'transparent'),
                  borderRadius: 2,
                  background: on ? 'var(--zp-accent-tint)' : 'transparent',
                  font: 'var(--zp-text-data)',
                  color: on ? 'var(--zp-accent-100)' : (selected ? 'var(--zp-text)' : 'var(--zp-text-3)'),
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                <span>{formatTime(v)}</span>
                {sub && <span style={{ font: 'var(--zp-text-micro)', color: 'var(--zp-text-4)' }}>{sub}</span>}
              </div>
            );
          })}
        </div>
      )}

      <span aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}>{live}</span>
    </div>
  );
}
