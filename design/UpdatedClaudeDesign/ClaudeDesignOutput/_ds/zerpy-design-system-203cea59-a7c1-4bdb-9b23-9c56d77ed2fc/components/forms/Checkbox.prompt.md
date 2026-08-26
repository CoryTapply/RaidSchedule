Multi-select, or a form value that needs a save.

```jsx
<Checkbox checked={done} onChange={setDone} label="Marks capped" />
```

The label brightens from `--zp-text-2` to `--zp-text` when checked, so a checked row reads as active without a second signal. Focus lands on the 16px mark itself — its border brightens to accent and picks up the glow.
