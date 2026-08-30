import { useEffect, useState } from 'react';

/** Live-updating match against a CSS media query, via matchMedia's change event. */
export function useMediaQuery(query: string): boolean {
  // Correct on mount. If `query` itself changes later (it doesn't at this hook's one call
  // site), `matches` stays stale until the new query's next real change event — accepted to
  // avoid a setState call inside the effect body.
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
