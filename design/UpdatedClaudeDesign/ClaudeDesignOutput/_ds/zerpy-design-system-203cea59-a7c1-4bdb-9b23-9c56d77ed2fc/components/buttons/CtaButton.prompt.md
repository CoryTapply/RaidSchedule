The one loud control on a screen — a hero action or the last step of a flow. Never two on a page, and never inside a dense list.

```jsx
<CtaButton onClick={publish}>Publish event</CtaButton>
<CtaButton variant="orbit-breathing">Start planning</CtaButton>
<CtaButton variant="plain">Continue</CtaButton>
```

The ambient motion is slow on purpose (6s orbit, 4.5s breath) so it reads as light, not as a notification. Both animations stop under `prefers-reduced-motion`.
