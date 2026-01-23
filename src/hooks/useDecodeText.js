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
    } = options;

    const split = new SplitText(ref.current, { type: "chars" });

    split.chars.forEach((char, index) => {
      const original = char.textContent;
      let lastChange = 0;

      char.textContent =
        chars[Math.floor(Math.random() * chars.length)];

      gsap.to({}, {
        delay: index * stagger,
        duration: iterations * speed,
        ease: "power2.out",
        onUpdate() {
          const now = Date.now();
          if (now - lastChange > changeDelay) {
            char.textContent =
              chars[Math.floor(Math.random() * chars.length)];
            lastChange = now;
          }
        },
        onComplete() {
          char.textContent = original;
        }
      });
    });

    return () => split.revert();
  }, [enabled]);
}