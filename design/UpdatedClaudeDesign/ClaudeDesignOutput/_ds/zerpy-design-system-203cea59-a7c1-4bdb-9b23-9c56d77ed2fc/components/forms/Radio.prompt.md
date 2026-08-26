A single choice from three or more options that need words, not just labels.

```jsx
<Radio checked={diff === 'normal'} onChange={() => setDiff('normal')} label="Normal" />
<Radio checked={diff === 'heroic'} onChange={() => setDiff('heroic')} label="Heroic" />
```

Only ever fires with `true` — the group owner clears the others. Two or three short options belong in a SegmentedControl.
