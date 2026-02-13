import {AnimatePresence, motion} from 'framer-motion'
import {useEffect, useRef, useState} from "react";
import Accordion from "./Accordion";
import './Sources.scss';
import videoSrc from '/videos/source.mp4';
import {useDecodeText} from "../../hooks/useDecodeText.js";
export default function  Sources ({isOpen,handleMenuItemClick}){
  const [items, setItems] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [titleActive, setTitleActive] = useState(false);

  const titleRef = useRef(null);

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

    }, 500)

  }, [isOpen])


  useEffect(() => {
    fetch('/data/sources.json')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);

      });
  }, []);


  useDecodeText(titleRef, titleActive, options);

  return (
    <AnimatePresence >
      {isOpen && (
        <motion.div
          className="sources-wrap"
          initial={{opacity: 0, scale: 0, borderRadius: '1000px'}}
          animate={{opacity: 1, scale: 1, borderRadius: '0px'}}
          exit={{opacity: 0, scale: 0}}
          transition={{duration: 0.5}}
        >
            <button className="close" aria-label="close" onClick={()=>handleMenuItemClick('close')}><i></i></button>
            <motion.div
              initial={{opacity: 0, scale: 0}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0}}
              transition={{duration: 0.5, delay: 0.45}}
              className="ia-container">
              <div

                className="sources-container__bgs">
                <motion.video
                  initial={{opacity: 0, x: "-100px"}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: "-100px"}}
                  transition={{duration: 0.5, delay: 1.2}}

                  src={videoSrc}
                  playsInline
                  muted
                  loop
                  autoPlay
                  type="video/mp4"
                  aria-hidden="true"
                ></motion.video>
              </div>
              <div className="sources-container">
                <div className="sources-container__in">
                  <h2 className="h3 text-light text-center mb-1" ref={titleRef}>Sources</h2>
                  <div className="mobile-video">
                    <motion.video
                      initial={{opacity: 0, x: "-100px"}}
                      animate={{opacity: 1, x: 0}}
                      exit={{opacity: 0, x: "-100px"}}
                      transition={{duration: 0.5, delay: 1.2}}

                      src={videoSrc}
                      playsInline
                      muted
                      loop
                      autoPlay
                      type="video/mp4"
                      aria-hidden="true"
                    ></motion.video>
                  </div>
                  <motion.div
                    initial={{opacity: 0, y: 20, maxHeight: '0px' }}
                    animate={{opacity: 1, y: 0, maxHeight: '2000px' }}
                    exit={{opacity: 0, y: 20, maxHeight: '0px'}}
                    transition={{duration: 0.5, delay: 1}}
                    className="sources-accordion">
                    {
                      items && items.map((item, i) => <Accordion key={i} title={item.title} activeIndex={activeIndex}
                                                                 setActiveIndex={setActiveIndex}
                                                                 index={i}>{item.description}</Accordion>)
                    }
                  </motion.div>
                </div>
              </div>
            </motion.div>

        </motion.div>
      )}
    </AnimatePresence>

  )
}
