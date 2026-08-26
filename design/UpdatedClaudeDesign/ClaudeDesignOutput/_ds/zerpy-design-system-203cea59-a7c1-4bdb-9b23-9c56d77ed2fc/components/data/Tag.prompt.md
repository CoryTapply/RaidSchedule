Filters, facets and attributes — anything selectable or removable.

```jsx
<Tag selected onClick={toggle}>Mythic</Tag>
<Tag rail="var(--zp-class-druid)">Druid</Tag>
<Tag onDismiss={() => remove(id)}>Tuesday</Tag>
```

The rail is the only place a WoW class color is allowed to appear — 3px wide, never as the tag's fill or text.
