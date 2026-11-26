"use client";

import "./Navigation.scss";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { veilJump } from "../../lib/scroll";
import type { Meteorite } from "../../types/content";

interface NavigationProps {
  items: Meteorite[];
  isLoaded?: boolean;
  navActive: boolean;
  activeItem: number | null;
  handleActiveItem: (index: number) => void;
  setIsJumping: (value: boolean) => void;
}

export default function Navigation({
  items,
  navActive,
  activeItem,
  handleActiveItem,
  setIsJumping,
}: NavigationProps) {
  const moveToItem = (e: React.MouseEvent, el: string) => {
    e.preventDefault();
    const st = ScrollTrigger.getById("TimeCapsules" + el.replace("#", ""));
    const targetIndex = items.findIndex((item) => "#" + item.slug === el);

    // Suppresses section callbacks (nav toggling, decode triggers) mid-jump
    setIsJumping(true);

    // The jump itself is instant (scrubbing through every pinned section in
    // between would be chaotic), but it happens behind a short fade so it
    // reads as a deliberate cut instead of the page glitching.
    veilJump(
      async () => {
        gsap.set(window, { scrollTo: { y: st ? st.start : el } });

        // Let ScrollTrigger settle on the new position before revealing
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (targetIndex !== -1) handleActiveItem(targetIndex);
        ScrollTrigger.refresh();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        ScrollTrigger.refresh();
      },
      { onComplete: () => setIsJumping(false) }
    );
  };

  return (
    <nav className={`meteorite-nav ${navActive ? "active" : ""}`}>
      <div className="meteorite-nav__inner">
        <ul>
          {items.map((el, i) => (
            <li className={`${i === activeItem ? "active" : ""}`} key={el.slug}>
              <button
                className="meteorite-link"
                onClick={(e) => {
                  moveToItem(e, "#" + el.slug);
                }}
              >
                <span>
                  <img src={el.image} alt={el.title} />
                  <img src={el.shadow} alt="shadow" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
