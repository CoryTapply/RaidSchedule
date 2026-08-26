Opens a portfolio or project page. The only place a gradient display title belongs — one per screen.

```jsx
<Hero
  eyebrow="Tools for WoW Classic"
  title="Small tools for a raid that starts on time"
  lede="A shared calendar, an alt tracker, and a handful of helpers I use every week."
  actions={<><CtaButton>Open the calendar</CtaButton><Button intent="ghost">All projects</Button></>}
/>
```

Sits inside a `PageShell`, which already provides the ground and the starfield — the Hero draws no background of its own. `aside` takes a Panel or a screenshot; leave it off for a text-only opening.
