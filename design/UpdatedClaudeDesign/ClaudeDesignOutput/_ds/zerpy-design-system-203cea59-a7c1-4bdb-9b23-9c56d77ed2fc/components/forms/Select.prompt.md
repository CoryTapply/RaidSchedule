One choice from a list too long for a SegmentedControl (roughly five or more).

```jsx
<Select options={CLASS_NAMES} value={cls} onChange={e => setCls(e.target.value)} />
<Select options={[{ value: 'h', label: 'Heroic' }, { value: 'm', label: 'Mythic' }]} />
```

Pair it with a 3px identity rail when the value has a color (a class, a faction) — the rail sits to the left of the control, not inside it.
