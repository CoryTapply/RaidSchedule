Every card, section container, popover body and dialog surface in the system.

```jsx
<Panel>Section content</Panel>
<Panel elevation="flat" padding="var(--zp-space-4)">A row inside another panel</Panel>
<Panel padding="0" style={{ overflow: 'hidden' }}>{/* owns its own grid */}</Panel>
```

`flat` has no blur and no shadow — use it for anything already inside a panel. `overlay` is 8px radius, 22px blur and the deep shadow; it is for things floating above the page.
