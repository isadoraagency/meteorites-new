// Shared motion tokens so every overlay opens and closes with the same feel.
import type { MotionProps, Transition } from "framer-motion";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // expo-out: fast start, soft landing
export const EASE_IN = [0.5, 0, 0.75, 0] as const; // quick, decisive exits

/** Full-screen overlay revealed as a growing circle (clip-path, not scale, so
 *  text and backdrop-filters inside are never re-rasterised mid-animation). */
export const overlayReveal: MotionProps = {
  initial: { opacity: 0, clipPath: "circle(0% at 50% 50%)" },
  animate: {
    opacity: 1,
    clipPath: "circle(75% at 50% 50%)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    clipPath: "circle(0% at 50% 50%)",
    transition: { duration: 0.4, ease: EASE_IN },
  },
};

/** Content block that rises into place after its overlay starts opening. */
export function fadeUp(delay = 0, distance = 24): MotionProps {
  const enter: Transition = { duration: 0.6, ease: EASE_OUT, delay };
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0, transition: enter },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
}
