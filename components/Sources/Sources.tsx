"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Accordion from "./Accordion";
import "./Sources.scss";
import { useDecodeText } from "../../hooks/useDecodeText";
import type { SourcesContent } from "../../types/content";

interface SourcesProps {
  content: SourcesContent;
  isOpen: boolean;
  handleMenuItemClick: (action: string) => void;
}

export default function Sources({ content, isOpen, handleMenuItemClick }: SourcesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [titleActive, setTitleActive] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);

  const options = {
    iterations: 5,
    speed: 0.1,
    stagger: 0.1,
    blured: 5,
    changeDelay: 30,
    opacity: 0,
  };

  useEffect(() => {
    setTimeout(() => {
      if (isOpen && titleRef.current) {
        setTitleActive(true);
      } else {
        setTitleActive(false);
      }
    }, 500);
  }, [isOpen]);

  useDecodeText(titleRef, titleActive, options);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="sources-wrap"
          initial={{ opacity: 0, scale: 0, y: "50%", borderRadius: "2000px" }}
          animate={{ opacity: 1, scale: 1, y: "0%", borderRadius: "0px" }}
          exit={{ opacity: 0, scale: 0, y: "50%", borderRadius: "2000px" }}
          transition={{ duration: 1 }}
        >
          <button className="close" aria-label="close" onClick={() => handleMenuItemClick("close")}>
            <i></i>
          </button>
          <m.div
            initial={{ opacity: 0, scale: 0, y: "50%" }}
            animate={{ opacity: 1, scale: 1, y: "0%" }}
            exit={{ opacity: 0, scale: 0, y: "50%" }}
            transition={{ duration: 1, delay: 1 }}
            className="ia-container"
          >
            {content.video && (
            <div className="sources-container__bgs">
              <m.video
                initial={{ opacity: 0, x: "-100px" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-100px" }}
                transition={{ duration: 1, delay: 1.8 }}
                src={content.video}
                playsInline
                muted
                loop
                autoPlay
                aria-hidden="true"
              ></m.video>
            </div>
            )}
            <div className="sources-container">
              <m.div
                className={`sources-container__in
                ${activeIndex || activeIndex === 0 ? "active" : ""}
                `}
                initial={{ opacity: 0, y: "50%", scale: 0.2 }}
                animate={{ opacity: 1, y: "0", scale: 1 }}
                exit={{ opacity: 0, y: "50%", scale: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                {content.title && (
                <h2 className="h3 text-light text-center mb-1" ref={titleRef}>
                  {content.title}
                </h2>
                )}
                {content.video && (
                <div className="mobile-video">
                  <m.video
                    initial={{ opacity: 0, x: "-100px" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "-100px" }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                    src={content.video}
                    playsInline
                    muted
                    loop
                    autoPlay
                    aria-hidden="true"
                  ></m.video>
                </div>
                )}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 1, delay: 1.8 }}
                  className="sources-accordion"
                >
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
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
