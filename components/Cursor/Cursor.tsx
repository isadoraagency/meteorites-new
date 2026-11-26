"use client";

import { useEffect, useRef } from "react";
import "./Cursor.scss";

const INTERACTIVE = 'a, button, input[type="submit"]';

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Position via the `translate` property, batched to one write per frame.
    // Setting top/left on every mousemove forced a layout each event; this
    // stays on the compositor and leaves `transform` free for the hover state.
    let x = 0;
    let y = 0;
    let frame = 0;
    const render = () => {
      frame = 0;
      cursor.style.translate = `${x}px ${y}px`;
    };

    const onMouseMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMouseEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.nodeType === 1 && el.matches?.(INTERACTIVE)) {
        cursor.classList.add("hover");
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.nodeType === 1 && el.matches?.(INTERACTIVE)) {
        cursor.classList.remove("hover");
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter, true);
    document.addEventListener("mouseleave", onMouseLeave, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter, true);
      document.removeEventListener("mouseleave", onMouseLeave, true);
    };
  }, []);

  return <div className="cursor" ref={cursorRef}></div>;
};

export default Cursor;
