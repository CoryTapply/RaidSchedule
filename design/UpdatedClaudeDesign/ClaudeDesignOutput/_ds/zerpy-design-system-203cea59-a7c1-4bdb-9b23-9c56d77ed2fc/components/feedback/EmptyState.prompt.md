An empty list, an empty range, a filter with no matches.

```jsx
<EmptyState
  glyph="—"
  title="No events in this range"
  body="Right-click any day to schedule a raid, or jump back to today."
  action={<Button onClick={today}>Back to today</Button>}
/>
```

The body names the gesture, not the goal. This is the only dashed border in the system — do not use dashes anywhere else.
