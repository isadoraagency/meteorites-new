import { useEffect } from "react";

/**
 * Locks page scrolling while `active` is true, without touching `overflow` on
 * <html>/<body>. Toggling overflow there would collapse the document height
 * (body has `height: 100%` + `overflow-x: hidden`), jump the page to the top
 * and force every ScrollTrigger pin to re-measure. Instead we cancel the
 * user-input events that would scroll the page: wheel, touch and keyboard.
 *
 * Elements that should still scroll (a modal body) opt in by spreading
 * `scrollLockScrollable` onto them; they also get `overscroll-behavior:
 * contain` in CSS so reaching their end never chains to the page.
 *
 * Locks are ref-counted, so several overlays (menu + modal) can hold one.
 */

const SCROLLABLE_ATTR = "data-scroll-lock-scrollable";

export const scrollLockScrollable = { [SCROLLABLE_ATTR]: "" } as const;

const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);

let lockCount = 0;
let lastTouchY = 0;

function findScrollable(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element
    ? target.closest<HTMLElement>(`[${SCROLLABLE_ATTR}]`)
    : null;
}

function canScroll(el: HTMLElement, deltaY: number) {
  if (deltaY < 0) return el.scrollTop > 0;
  if (deltaY > 0) return Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight;
  return false;
}

function onWheel(e: WheelEvent) {
  if (e.ctrlKey) return; // pinch-zoom on trackpads
  const el = findScrollable(e.target);
  if (!el || !canScroll(el, e.deltaY)) e.preventDefault();
}

function onTouchStart(e: TouchEvent) {
  lastTouchY = e.touches[0]?.clientY ?? 0;
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return; // let pinch-zoom through
  const y = e.touches[0].clientY;
  const deltaY = lastTouchY - y;
  lastTouchY = y;
  const el = findScrollable(e.target);
  if (e.cancelable && (!el || !canScroll(el, deltaY))) e.preventDefault();
}

function onKeyDown(e: KeyboardEvent) {
  if (!SCROLL_KEYS.has(e.key)) return;
  const target = e.target as HTMLElement | null;
  if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
  if (e.key === " " && target?.closest("button, a")) return; // space activates controls
  if (!findScrollable(target)) e.preventDefault();
}

function lock() {
  document.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("keydown", onKeyDown);
}

function unlock() {
  document.removeEventListener("wheel", onWheel);
  document.removeEventListener("touchstart", onTouchStart);
  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("keydown", onKeyDown);
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (lockCount++ === 0) lock();
    return () => {
      if (--lockCount === 0) unlock();
    };
  }, [active]);
}
