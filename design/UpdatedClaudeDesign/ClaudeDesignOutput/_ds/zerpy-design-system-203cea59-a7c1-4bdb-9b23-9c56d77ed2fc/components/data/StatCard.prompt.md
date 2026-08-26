A single figure in a dashboard row. Three or four across, never more.

```jsx
<StatCard label="Attendance" value="92%" delta="+4 vs last tier" deltaTone="up" />
<StatCard label="Marks needed" value="180" delta="+5 vs average" deltaTone="down" />
<StatCard label="Alts tracked" loading />
```

A delta with no baseline is noise — always say what it is measured against. `down` is amber, not red: a falling number is not an error.
