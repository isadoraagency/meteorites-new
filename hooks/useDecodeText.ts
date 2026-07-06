import { useLayoutEffect, type RefObject } from "react";
import { gsap, SplitText } from "../lib/gsap";

export interface DecodeTextOptions {
  chars?: string;
  iterations?: number;
  speed?: number;
  stagger?: number;
  changeDelay?: number;
  opacity?: number;
  blured?: number;
}

type DecodeRefTarget = HTMLElement | HTMLElement[] | null;

export function useDecodeText(
  ref: RefObject<DecodeRefTarget>,
  enabled: boolean,
  options: DecodeTextOptions = {}
) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const split = new SplitText(ref.current, { type: "words, chars" });
    if (!enabled || !ref.current) return;

    const {
      chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!@#$%^&*",
      iterations = 5,
      speed = 0.1,
      stagger = 0.05,
      changeDelay = 70,
      opacity = 0,
      blured = 0, // Starting with a visible blur value
    } = options;

    split.chars.forEach((char, index) => {
      // Set initial blur
      gsap.set(char, { filter: `blur(${blured}px)`, opacity });

      const original = char.textContent;
      let lastChange = 0;

      char.textContent = chars[Math.floor(Math.random() * chars.length)];

      // Create a timeline for each character
      const charTl = gsap.timeline({
        delay: index * stagger,
        onComplete() {
          char.textContent = original;
        },
      });

      // Animate the character from blurred to clear while changing text
      charTl.to(char, {
        duration: iterations * speed,
        opacity: 1,
        filter: "blur(0px)", // Animate the blur from blured to 0
        ease: "power2.out",
        onUpdate() {
          const now = Date.now();
          if (now - lastChange > changeDelay) {
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            lastChange = now;
          }
        },
      });
    });

    return () => split.revert();
  }, [enabled]);
}
