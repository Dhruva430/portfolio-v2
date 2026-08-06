import type Lenis from "@studio-freight/lenis";

/**
 * SmoothScroll owns the single Lenis instance, but components deep in the tree
 * (the hero sequence, the navbar) need it to drive programmatic scrolls. A
 * module-level handle avoids threading it through context and re-rendering the
 * whole page every time it changes.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

/**
 * Scroll to an element through Lenis when it is available, falling back to the
 * native scroll so this still works before hydration or if Lenis fails.
 *
 * `lock` is essential for anything triggered *by* scrolling. Lenis handles wheel
 * input by calling scrollTo({programmatic: false}) internally, which replaces
 * whatever animation is in flight — so without the lock a programmatic scroll
 * issued mid-gesture is destroyed on the very next wheel event and silently
 * never happens. The lock releases itself when the animation completes.
 */
export function scrollToElement(
  target: Element,
  options?: { duration?: number; offset?: number; immediate?: boolean }
) {
  const immediate = options?.immediate ?? false;
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(target as HTMLElement, {
      duration: options?.duration ?? 1.1,
      offset: options?.offset ?? 0,
      immediate,
      lock: !immediate,
      // Do not get rejected by a lock that is already in flight.
      force: true,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    return;
  }

  target.scrollIntoView({
    behavior: immediate ? "auto" : "smooth",
    block: "start",
  });
}
