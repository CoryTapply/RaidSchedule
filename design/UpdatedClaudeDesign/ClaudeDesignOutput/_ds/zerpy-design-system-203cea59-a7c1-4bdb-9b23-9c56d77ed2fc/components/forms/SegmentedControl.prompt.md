View switching and short exclusive choices. Also the system's tab bar — there is no Tabs component.

```jsx
<SegmentedControl options={['Day', 'Week', 'Month']} value={view} onChange={setView} />
<SegmentedControl options={['Horde', 'Alliance']} value={faction} onChange={setFaction} style={{ width: '100%' }} />
```

The selected segment is an accent tint with an accent border at 2px radius, inside a recessed 4px track. Focus brightens the segment's own edge. Past four options, or with labels over about ten characters, use a Select.
