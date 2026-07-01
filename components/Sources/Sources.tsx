"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Accordion from "./Accordion";
import "./Sources.scss";
import { useDecodeText } from "../../hooks/useDecodeText";
import type { SourceItem } from "../../types/content";

// Static asset served from /public — referenced by URL, not imported.
const videoSrc = "/videos/source.mp4";

interface SourcesProps {
  isOpen: boolean;
  handleMenuItemClick: (action: string) => void;
}

export default function Sources({ isOpen, handleMenuItemClick }: SourcesProps) {
  const [items, setItems] = useState<SourceItem[] | null>(null);
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

  useEffect(() => {
    fetch("/data/sources.json")
      .then((response) => response.json())
      .then((data: SourceItem[]) => {
        setItems(data);
      });
  }, []);

  useDecodeText(titleRef, titleActive, options);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="sources-wrap"
          initial={{ opacity: 0, scale: 0, y: "50%", borderRadius: "2000px" }}
          animate={{ opacity: 1, scale: 1, y: "0%", borderRadius: "0px" }}
          exit={{ opacity: 0, scale: 0, y: "50%", borderRadius: "2000px" }}
          transition={{ duration: 1 }}
        >
          <button className="close" aria-label="close" onClick={() => handleMenuItemClick("close")}>
            <i></i>
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0, y: "50%" }}
            animate={{ opacity: 1, scale: 1, y: "0%" }}
            exit={{ opacity: 0, scale: 0, y: "50%" }}
            transition={{ duration: 1, delay: 1 }}
            className="ia-container"
          >
            <div className="sources-container__bgs">
              <motion.video
                initial={{ opacity: 0, x: "-100px" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-100px" }}
                transition={{ duration: 1, delay: 1.8 }}
                src={videoSrc}
                playsInline
                muted
                loop
                autoPlay
                aria-hidden="true"
              ></motion.video>
            </div>
            <div className="sources-container">
              <motion.div
                className={`sources-container__in
                ${activeIndex || activeIndex === 0 ? "active" : ""}
                `}
                initial={{ opacity: 0, y: "50%", scale: 0.2 }}
                animate={{ opacity: 1, y: "0", scale: 1 }}
                exit={{ opacity: 0, y: "50%", scale: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <h2 className="h3 text-light text-center mb-1" ref={titleRef}>
                  Sources
                </h2>
                <div className="mobile-video">
                  <motion.video
                    initial={{ opacity: 0, x: "-100px" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "-100px" }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                    src={videoSrc}
                    playsInline
                    muted
                    loop
                    autoPlay
                    aria-hidden="true"
                  ></motion.video>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 1, delay: 1.8 }}
                  className="sources-accordion"
                >
                  {items &&
                    items.map((item, i) => (
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
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
