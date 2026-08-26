The standard action control — use it for every button that is not the single page-defining CTA.

```jsx
<Button intent="primary" onClick={publish}>Publish event</Button>
<Button>Details</Button>
<Button intent="ghost" size="sm">Cancel</Button>
<Button intent="danger" onClick={withdraw}>Withdraw</Button>
<Button loading>Saving</Button>
```

Intents: `primary` (accent outline + glow, one per view — never a solid fill), `secondary` (default), `ghost` (tertiary, no border until hover), `danger`. Sizes `sm` 30px / `md` 38px / `lg` 46px. `loading` disables the button and shows a spinner in the icon slot, so the label stays readable — never blank the label while saving.
