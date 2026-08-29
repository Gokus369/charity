import { useEffect, useRef } from 'react';

/**
 * Fades an element in the first time it scrolls into view.
 * Attach the returned ref directly to the element and give it
 * the `reveal` class — no wrapper div, so grid/flex layout is untouched.
 */
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('is-visible');
        io.disconnect();
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
