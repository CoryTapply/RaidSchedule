The outermost element of any full-page view. Owns the ground gradient, the starfield and the centered column.

```jsx
<PageShell maxWidth={1440} style={{ padding: 'var(--zp-space-7) var(--zp-space-6)' }}>
  <SectionHeading title="Raid Calendar" />
  <Panel>…</Panel>
</PageShell>
```

Children are laid out in a column with `--zp-space-10` between them, so a page is a list of sections. Set `starfield={false}` on reading-heavy pages (docs, long-form) where texture behind text is noise.
