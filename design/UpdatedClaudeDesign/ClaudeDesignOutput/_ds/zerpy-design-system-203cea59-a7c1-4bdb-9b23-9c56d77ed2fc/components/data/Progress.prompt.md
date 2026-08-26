Completion against a known target — marks farmed, attunement steps, upload.

```jsx
<Progress value={68} label="Warsong marks" caption="14 / 20" />
<Progress label="Syncing" />
```

Put the number in `caption`, never inside the track. Indeterminate is for work with no measurable end — if you know the total, show it.
