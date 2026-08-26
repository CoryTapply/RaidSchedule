Overflow menus, and small composers that should not take over the screen.

```jsx
<span style={{ position: 'relative' }}>
  <IconButton label="More" onClick={() => setOpen(!open)}>⋯</IconButton>
  <Popover open={open} onClose={() => setOpen(false)} align="right" items={[
    { label: 'Duplicate' },
    { label: 'Copy week across' },
    { label: 'Delete event', tone: 'danger' },
  ]} />
</span>
```

Danger rows are red text, never a red row. Item clicks close the popover automatically.
