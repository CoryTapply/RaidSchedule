Any single-line value — text, time, number, search.

```jsx
<Input placeholder="Character name" value={name} onChange={e => setName(e.target.value)} />
<Input type="time" value="20:00" />
<Input invalid value="24" />
```

Focus brightens the field's own border to accent and adds the soft glow — the same treatment every control gets. Nothing is drawn outside the control. Always wrap in a `Field` unless the context makes the label redundant (a search box with a placeholder).
