Confirming a completed action, bottom-right, self-dismissing after about four seconds.

```jsx
<ToastStack>
  {toasts.map(t => (
    <Toast key={t.id} tone="success" title="Event published" body="20 members notified" onDismiss={() => drop(t.id)} />
  ))}
</ToastStack>
```

Titles are past tense and specific. Errors that block work belong in the form, not a toast — a toast the user misses is a message that was never sent.
