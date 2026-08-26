A square button for a single glyph — overflow menus, pagination, dismiss.

```jsx
<IconButton label="More actions">⋯</IconButton>
<IconButton label="Previous week" onClick={prev}>‹</IconButton>
<IconButton label="Close" intent="ghost" size="sm" onClick={close}>✕</IconButton>
```

The system has no SVG icon set — pass a unicode glyph set in the UI font (`⋯ ✕ ‹ › ✓`). `label` is required and becomes the accessible name.
