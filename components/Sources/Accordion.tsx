"use client";

import { useId } from "react";
import { sanitizeHtml } from "../../lib/sanitizeHtml";
import "./Accordion.scss";

interface AccordionProps {
  title: string;
  children: string;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  index: number;
}

// Height is animated in CSS (grid-template-rows 0fr -> 1fr), so opening starts
// on the same frame as the click — no measuring, timers or resize listeners.
const Accordion = ({ title, children, activeIndex, setActiveIndex, index }: AccordionProps) => {
  const isOpen = index === activeIndex;
  const panelId = useId();

  const toggleAccordion = () => {
    setActiveIndex(isOpen ? null : index);
  };

  return (
    <div className={`accordion ${isOpen ? "accordion--open" : ""}`}>
      <button
        className={`accordion-header p2 mb-0 text-semi-bold text-upper text--primary ${isOpen ? "open" : ""}`}
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {title}
        <i></i>
      </button>
      <div id={panelId} className="accordion-content" inert={!isOpen}>
        <div className="accordion-content__clip">
          <div
            className="accordion-inner"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(children, {
                ADD_ATTR: ["target", "rel"],
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Accordion;
