Loading placeholders. Frames are real from the first paint — only the value inside shimmers.

```jsx
<Skeleton width="60%" height={8} />
<Skeleton width={96} height={38} radius="var(--zp-radius)" shape="pulse" />
```

Size a number placeholder to the widest plausible value, never the current one. Never leave anything shimmering after a failure — swap to an error state.
