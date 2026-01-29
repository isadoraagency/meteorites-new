import { useLayoutEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

export function useDecodeText(ref, enabled, options = {}) {
  useLayoutEffect(() => {
    if (!enabled || !ref.current) return;

    const {
      chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!@#$%^&*",
      iterations = 5,
      speed = 0.1,
      stagger = 0.05,
      changeDelay = 70,

      opacity = 1,
      blured = 0 // Starting with a visible blur value
    } = options;

    const split = new SplitText(ref.current, { type: "chars" });

    split.chars.forEach((char, index) => {
      // Set initial blur
      gsap.set(char, { filter: `blur(${blured}px)`, opacity: opacity });

      const original = char.textContent;
      let lastChange = 0;

      char.textContent =
        chars[Math.floor(Math.random() * chars.length)];

      // Create a timeline for each character
      const charTl = gsap.timeline({
        delay: index * stagger,
        onComplete() {
          char.textContent = original;
        }
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
            char.textContent =
              chars[Math.floor(Math.random() * chars.length)];
            lastChange = now;
          }
        }
      });
    });

    return () => split.revert();
  }, [enabled]);
}
