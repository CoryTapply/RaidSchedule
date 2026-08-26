Inspecting or confirming one thing, when the page behind must stay put.

```jsx
<Dialog
  title="Nerub-ar Palace"
  description="Friday, August 21, 2026 · 8:00 PM – 11:00 PM"
  onClose={close}
  footer={<><Button intent="ghost" onClick={close}>Close</Button><Button intent="danger">Withdraw</Button></>}
>
  <Panel elevation="flat">…</Panel>
</Dialog>
```

Panels inside a dialog are `elevation="flat"` — the dialog already owns the blur. Wire Escape yourself; the component does not add a key listener.
