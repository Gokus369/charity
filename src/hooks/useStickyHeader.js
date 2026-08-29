import { useEffect, useState } from 'react';

/** True once the page has scrolled past `offset` — used to shadow the header. */
export function useStickyHeader(offset = 8) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);

  return stuck;
}
