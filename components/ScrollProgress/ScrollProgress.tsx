"use client";

import { useEffect, useRef } from "react";
import "./ScrollProgress.scss";

// Updates the bar straight on the DOM once per frame. Driving it through React
// state re-rendered the whole App tree on scroll, and the old CSS width
// transition made the bar trail behind the page.
export default function ScrollProgress() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    if (!container || !bar) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      container.style.visibility = progress > 0 ? "visible" : "hidden";
      // clip-path keeps the full-width gradient fixed in place, like the old width clip
      bar.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="scroll-progress-container" ref={containerRef} style={{ visibility: "hidden" }}>
      <div className="scroll-progress-bar" ref={barRef} />
    </div>
  );
}
