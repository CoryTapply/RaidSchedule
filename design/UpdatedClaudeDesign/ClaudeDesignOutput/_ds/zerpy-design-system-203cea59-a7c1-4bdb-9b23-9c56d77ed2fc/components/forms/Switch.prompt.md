Immediate settings — not form values that need a save.

```jsx
<Switch checked={ping} onChange={setPing} label="Raid reminders" description="Ping an hour before pull." />
<Switch checked={on} onChange={setOn} />
```

Use a Checkbox instead when the value is part of a form the user submits.
