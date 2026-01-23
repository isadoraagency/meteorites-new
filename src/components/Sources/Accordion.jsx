import React, {useState, useRef, useEffect, useCallback} from 'react';
import DOMPurify from "dompurify";
import './Accordion.scss';

const Accordion = ({ title, children, activeIndex, setActiveIndex, index }) => {
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);
  const isOpen = index === activeIndex;
  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setTimeout(function (){
        updateHeight();
      }, 100)
    });
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [updateHeight]);

  const toggleAccordion = () => {
    setActiveIndex(isOpen ? null : index);
  };

  return (
    <div className="accordion">
      <button className={`accordion-header p2 mb-0 text-semi-bold text-upper text--primary ${isOpen ? 'open' : ''}`} onClick={toggleAccordion}>
        {title}
        <i></i>
      </button>
      <div
        ref={contentRef}
        className="accordion-content"
        style={{ height: `${height}px`, overflow: 'hidden', transition: '0.35s height' }}
      >
        <div className="accordion-inner" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(children, {
            ADD_ATTR: ['target', 'rel']
          })}} />
      </div>
    </div>
  );
};

export default Accordion;