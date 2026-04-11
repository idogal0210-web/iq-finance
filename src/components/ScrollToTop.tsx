import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from './SmoothScroll';

/**
 * Instant-scroll-to-top on every route change. Prefers the Lenis instance so
 * the reset respects Lenis' internal state; falls back to window.scrollTo when
 * Lenis hasn't mounted yet (first render).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname, lenis]);

  return null;
}
