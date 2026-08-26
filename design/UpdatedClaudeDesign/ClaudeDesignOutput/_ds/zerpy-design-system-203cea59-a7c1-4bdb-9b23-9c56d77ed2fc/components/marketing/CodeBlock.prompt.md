Any code sample in docs, a changelog entry or a project write-up.

```jsx
<CodeBlock filename="lockout.ts" lineNumbers code={`const reset = lockoutStart(new Date());\nreturn days.filter(d => d >= reset);`} />
<CodeBlock language="bash" code="npm i zerpy" />
```

Highlighting covers comments, strings, numbers, keywords and call sites — that is all it will ever cover. Set the header with `filename` (preferred) or `language`; omit both and the bar disappears along with the copy button.
