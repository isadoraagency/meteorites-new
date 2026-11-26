"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Accordion from "./Accordion";
import "./Sources.scss";
import { useDecodeText } from "../../hooks/useDecodeText";
import { scrollLockScrollable } from "../../hooks/useScrollLock";
import { EASE_OUT, fadeUp, overlayReveal } from "../../lib/motion";
import type { SourcesContent } from "../../types/content";

interface SourcesProps {
  content: SourcesContent;
  isOpen: boolean;
  handleMenuItemClick: (action: string) => void;
}

const DECODE_OPTIONS = {
  iterations: 5,
  speed: 0.08,
  stagger: 0.05,
  blured: 5,
  changeDelay: 30,
  opacity: 0,
};

// Start decoding the title as its card begins to fade in
const TITLE_DECODE_DELAY_MS = 250;

export default function Sources({ content, isOpen, handleMenuItemClick }: SourcesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [titleActive, setTitleActive] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => setTitleActive(true), TITLE_DECODE_DELAY_MS);
    return () => {
      clearTimeout(id);
      setTitleActive(false);
    };
  }, [isOpen]);

  useDecodeText(titleRef, titleActive, DECODE_OPTIONS);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div className="sources-wrap" {...overlayReveal}>
          <button className="close" aria-label="close" onClick={() => handleMenuItemClick("close")}>
            <i></i>
          </button>

          {/* Decorative video stays fixed behind the scrolling content */}
          {content.video && (
            <div className="sources-bg" aria-hidden="true">
              <div className="ia-container">
                <div className="sources-bg__video">
                  <m.video
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE_OUT, delay: 0.45 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    src={content.video}
                    playsInline
                    muted
                    loop
                    autoPlay
                  ></m.video>
                </div>
              </div>
            </div>
          )}

          <div className="sources-scroll" {...scrollLockScrollable}>
            <div className="ia-container">
              <div className="sources-container">
                <m.div
                  className={`sources-container__in ${activeIndex !== null ? "active" : ""}`}
                  {...fadeUp(0.25, 48)}
                >
                  {content.title && (
                    <h2 className="h3 text-light text-center mb-1" ref={titleRef}>
                      {content.title}
                    </h2>
                  )}
                  {content.video && (
                    <div className="mobile-video">
                      <m.video
                        {...fadeUp(0.45, 0)}
                        src={content.video}
                        playsInline
                        muted
                        loop
                        autoPlay
                        aria-hidden="true"
                      ></m.video>
                    </div>
                  )}
                  <m.div {...fadeUp(0.4, 16)} className="sources-accordion">
                    {content.items.length > 0 &&
                      content.items.map((item, i) => (
                        <Accordion
                          key={i}
                          title={item.title}
                          activeIndex={activeIndex}
                          setActiveIndex={setActiveIndex}
                          index={i}
                        >
                          {item.description}
                        </Accordion>
                      ))}
                  </m.div>
                </m.div>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
