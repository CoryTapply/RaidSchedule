A time of day typed as `h:mm AM/PM`, with presets behind a chevron. Use it wherever a schedule is set — raid start and end, a reminder, a window. Not for durations; a duration is a number field.

```jsx
<Field label="Start">
  <TimeSelect value={start} onChange={setStart} aria-label="Start time" />
</Field>

<Field label="End">
  <TimeSelect value={end} onChange={setEnd} relativeTo={start} align="end" aria-label="End time" />
</Field>
```

Pair the two: `relativeTo` puts a duration on every preset (`10:00 PM · 3 hr`) and drops the times that fall before the start. `align="end"` anchors the second field's listbox to its right edge so the popover stays inside a narrow panel.

Typing is segmented. `9` `3` `0` `p` gives `9:30 PM`; the hour advances by itself once it can no longer grow, digits do nothing once the caret is on `AM`/`PM`, and `A`/`P` set it directly. `↑` steps the focused segment — the hour wraps 11→12→1 without touching the meridiem, the minute wraps 59→00 without touching the hour. `↓` opens the presets. Blur fills in whatever was left out: `9` commits as `9:00 AM`.

The list does not filter as you type; it scrolls to the nearest option and highlights it, so `9:07` stays typeable on a 15-minute grid. Set `interval` for a different grid, `min`/`max` to bound it. Above roughly 100 rows, virtualize.
