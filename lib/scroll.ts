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

/**
 * Snap settings shared by every label-based scroll timeline. Snaps used to run
 * for up to 2s with an ease-out that lurched at full speed the moment the user
 * stopped; a short ease-in-out settle feels like the page coming to rest.
 */
export const LABEL_SNAP: ScrollTrigger.SnapVars = {
  snapTo: "labelsDirectional",
  duration: { min: 0.2, max: 0.8 },
  delay: 0.2, // default is scrub/2 = 0.5s of dead time before settling
  ease: "power1.inOut",
};

let veil: HTMLDivElement | null = null;

function getVeil() {
  if (!veil) {
    veil = document.createElement("div");
    veil.setAttribute("aria-hidden", "true");
    Object.assign(veil.style, {
      position: "fixed",
      inset: "0",
      zIndex: "950", // above sections and the capsule nav, below the menu (999+)
      background: "#000",
      opacity: "0",
      pointerEvents: "none",
    });
    document.body.appendChild(veil);
  }
  return veil;
}

/**
 * Runs an instant scroll jump behind a quick fade to black, so long jumps
 * through pinned sections read as a cut rather than a glitch. The page is
 * revealed once the jump (and any async settling it returns) has finished.
 */
export function veilJump(
  jump: () => void | Promise<void>,
  { onComplete }: { onComplete?: () => void } = {}
) {
  const el = getVeil();
  gsap.killTweensOf(el);
  el.style.pointerEvents = "auto";

  gsap.to(el, {
    opacity: 1,
    duration: 0.25,
    ease: "power2.in",
    onComplete: () => {
      void Promise.resolve(jump()).then(revealAfterPaint);
    },
  });

  function revealAfterPaint() {
    // Two frames so pinned sections have painted their new state
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        gsap.to(el, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            el.style.pointerEvents = "none";
            onComplete?.();
          },
        });
      })
    );
  }
}
