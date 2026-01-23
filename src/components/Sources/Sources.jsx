import {AnimatePresence, motion} from 'framer-motion'
import {useEffect, useState} from "react";
import Accordion from "./Accordion";
import './Sources.scss';
import videoSrc from '/videos/source.mp4';
export default function  Sources ({isOpen,handleMenuItemClick}){
  const [items, setItems] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/data/sources.json')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      });
  }, []);
  return (
    <AnimatePresence >
      {isOpen && (
        <motion.div

          className="sources-wrap"
          initial={{opacity: 0, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0, scale: 0}}
          transition={{duration: 0.5}}
        >
            <button className="close" aria-label="close" onClick={()=>handleMenuItemClick('close')}><i></i></button>
            <div className="ia-container">
              <div className="sources-container__bgs">
                <video
                  src={videoSrc}
                  playsInline
                  muted
                  loop
                  autoPlay
                  type="video/mp4"
                  aria-hidden="true"
                ></video>
              </div>
              <div className="sources-container">
                <div className="sources-container__in">
                  <h2 className="h3 text-light text-center mb-1">Sources</h2>
                  <div className="sources-accordion">
                    {
                      items && items.map((item, i) => <Accordion key={i} title={item.title} activeIndex={activeIndex}
                                                                 setActiveIndex={setActiveIndex}
                                                                 index={i}>{item.description}</Accordion>)
                    }
                  </div>
                </div>
              </div>
            </div>

        </motion.div>
      )}
    </AnimatePresence>

  )
}
