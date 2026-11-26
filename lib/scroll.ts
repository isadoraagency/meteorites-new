import { gsap, ScrollTrigger } from "./gsap";

/**
 * Jumps the window to an anchor (e.g. "#stardust") with ScrollTrigger snapping
 * suspended, so snap tweens don't fight the jump. UI components (Menu, modals)
 * should use this instead of importing GSAP directly.
 */
export function scrollToAnchor(
  target: string | number | Element,
  { duration = 0, onComplete }: { duration?: number; onComplete?: () => void } = {}
) {
  const snapTriggers = ScrollTrigger.getAll().filter((st) => st.vars.snap);
  snapTriggers.forEach((st) => st.disable(false));

  gsap.to(window, {
    duration,
    scrollTo: { y: target, autoKill: true },
    ease: "power2.inOut",
    onComplete: () => {
      snapTriggers.forEach((st) => st.enable(false));
      ScrollTrigger.refresh();
      onComplete?.();
    },
  });
}
