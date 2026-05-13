import gsap from "gsap";
import SplitText from "gsap/SplitText";

export function addDecodeToTimeline(tl, el, options = {}, position) {
  if (!el) return;

  const {
    chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!@#$%^&*",
    iterations = 5,
    speed = 0.1,
    stagger = 0.05,
    blured = 0,
    opacity = 0,
  } = options;

  const split = new SplitText(el, { type: "words, chars" });

  // Set initial state immediately (outside the timeline)
  gsap.set(split.chars, { opacity, filter: `blur(${blured}px)` });

  // Use provided position or current timeline duration
  const startTime = position !== undefined ? position : tl.duration();

  split.chars.forEach((char, index) => {
    const original = char.textContent;

    // Scramble the char so it's already randomised when the tween begins
    char.textContent = chars[Math.floor(Math.random() * chars.length)];

    let lastChange = 0;

    tl.to(
      char,
      {
        duration: iterations * speed,
        opacity: 1,
        filter: "blur(0px)",
        ease: "power2.out",
        onUpdate() {
          const now = Date.now();
          if (now - lastChange > 70) {
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            lastChange = now;
          }
        },
        onComplete() {
          char.textContent = original;
        },
      },
      // Each char starts staggered from the shared stamp
      startTime + index * stagger
    );
  });

  return () => split.revert();
}