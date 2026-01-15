import { useEffect } from 'react';

/**
 * Yotpo widgets might try to scroll to specific positions on the page. It uses window.scrollTo
 * for that. However, in PWA the scrollable container is not window, but a div scroll container.
 * This hook patches window.scrollTo to scroll the correct container.
 * @param {React.RefObject<HTMLElement>} containerRef Ref to the element that contains the
 * Yotpo widgets.
 */
export function usePatchWindowScrollTo(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return undefined;

    // Select the scrollable container
    const container = containerRef.current.closest('.engage__view__content');

    if (!container) return undefined;

    const original = window.scrollTo.bind(window);

    // Above the scroll container there might be other fixed elements (like app bar).
    // We need to take their height into account.
    const offsetTop = container.getBoundingClientRect().top;

    window.scrollTo = ((arg1, arg2) => {
      // Support both signatures: scrollTo(x, y) and scrollTo({top,left,...})
      let top = 0;
      let left = 0;

      if (typeof arg1 === 'object' && arg1) {
        top = arg1.top ?? 0;
        left = arg1.left ?? 0;
      } else {
        left = Number(arg1) || 0;
        top = Number(arg2) || 0;
      }

      container.scrollTo({
        top: top + (offsetTop / 2),
        left,
        behavior: 'smooth',
      });
    });

    return () => {
      window.scrollTo = original;
    };
  }, [containerRef]);
}
