Wraps every control that has a label.

```jsx
<Field label="Event title" hint="Shown on the calendar block.">
  <Input placeholder="Nerub-ar Palace" />
</Field>
<Field label="Roster size" error="Mythic is capped at 20.">
  <Input invalid value="24" />
</Field>
```

An error replaces the hint and turns the label red — never show both. Hints state effect ("Ping an hour before pull"), never restate the label.
