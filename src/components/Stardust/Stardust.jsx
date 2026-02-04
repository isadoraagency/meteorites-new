import Spline from "@splinetool/react-spline";
import './Stardust.scss';
import { AnimatePresence, motion} from 'framer-motion'
import {gsap, ScrollToPlugin, ScrollTrigger} from 'gsap/all';

import {useRef, useState, useEffect} from "react";

gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(ScrollTrigger)

const Stardust = ({isLoaded, onBackToIntro
                  })=> {
  const options = [
    {
      value: 1,
      label: 'Ben',
      spline: 'https://prod.spline.design/qp5LEGhHQNPxy4Gq/scene.splinecode',
      position: 'Creative Director',
      tooltip: '3D Modeling and animation with Spline'
    },
    {
      value: 2,
      label: 'Cyn',
      spline: 'https://prod.spline.design/3NuFoMFXlUrDsIs6/scene.splinecode',
      position: 'Senior Designer',
      tooltip: 'Concept and Design 3D animation with Spline'
    },
    {
      value: 3,
      label: 'Kostya',
      spline: 'https://prod.spline.design/k2xmx0PUFAaHAIR2/scene.splinecode',
      position: 'Web Developer',
      tooltip: ''
    }
  ];

  const [currentOption, setCurrentOption] = useState(options[0]);
  const [move, setMove] = useState(false);
  const [popupActive, setPopupActive] = useState(false);
  const sturdust = useRef(null);

  const splineRef = useRef(null);
  const [splineApp, setSplineApp] = useState(null);


  //
  useEffect(() => {
    const handleWheel = (e) => {
      const isOverSpline = e.target.closest('.stardust-page');

      if(move && isOverSpline) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [move]);

  useEffect(() => {
    const ctxs = gsap.context(() => {
      if (isLoaded) {
        // const StardustBg = document.getElementById('Stardust-bg');
        // const tl = gsap.timeline({
        //   scrollTrigger: {
        //     trigger: sturdust.current,
        //     start: 'top bottom',
        //     end: 'top top',
        //     scrub: true,
        //     id: "sturdust-start",
        //     // pinSpacing: false
        //   }
        // })
        // tl.to(StardustBg, {duration: 1, y: "0", ease: 'power2.inOut'})
        //


        // const tl = gsap.timeline({
          ScrollTrigger.create({
            trigger: sturdust.current,
            start: 'top top',
            pin: true,
            end: '+=200%',
            // pinSpacing: true,
            id: "stardust-scroll",
            anticipatePin: 1,
            // markers: true,
            // onUpdate: (self) =>{ self.progress > 0.2 && setPopupActive(true)},
            onEnter: () => {
              setPopupActive(true);
              // const typesSection = document.getElementById('Types');
              // if (typesSection) {
              //   gsap.set(typesSection, {
              //     position: 'fixed',
              //     top: 0,
              //     left: 0,
              //     width: '100%',
              //     zIndex: 1
              //   });
              // }
            },
            onEnterBack: () => {setPopupActive(false); setMove(false)
              const typesSection = document.getElementById('Types');
              // if (typesSection) {
              //   gsap.set(typesSection, {
              //     clearProps: 'position,top,left,width,zIndex'
              //   });
              // }


            },
            onLeaveBack: () => {setPopupActive(false); setMove(false)
              // const typesSection = document.getElementById('Types');
              // if (typesSection) {
              //   gsap.set(typesSection, {
              //     clearProps: 'position,top,left,width,zIndex'
              //   });
              // }

            },
          })
        // });
      }
    }, sturdust)
    return () => ctxs.revert();
  }, [isLoaded])

  const onSplineLoad = (splineApp) => {
    // Store the spline app reference
    splineRef.current = splineApp;

    // Get current viewport dimensions
    const viewportHeight = window.innerHeight;

    // Check if we can access the camera controls
    if (splineApp && splineApp.runtime && splineApp.runtime.camera) {
      // First try the runtime camera approach
      const cameraZoom = viewportHeight < 768 ? 0.7 :
        viewportHeight < 1024 ? 0.85 : 1;

      // Apply zoom by adjusting the camera position
      // Move the camera back to simulate zooming out
      const camera = splineApp.runtime.camera;

      // Instead of directly setting zoom, adjust the position
      // Increase the z position to zoom out (move camera backward)
      if (viewportHeight < 768) {
        // Move camera back for small screens
        camera.position.z *= 1.5;
      }
    } else if (splineApp && splineApp.setZoom) {
      // Alternative: try using setZoom method if available
      const zoomLevel = viewportHeight < 768 ? 0.5 :
        viewportHeight < 1024 ? 0.55 : 1;
      splineApp.setZoom(zoomLevel);
    }
  };



  return (
    <div id="Stardust" >
      <div id="Stardust-bg"></div>
      <div ref={sturdust} id="stardust-page" className={`stardust-page ${move ? 'active scrolled' : ''} ${popupActive ? 'scrolled' : ''}`}
        >
        {
          popupActive && (
            <motion.div
              className="stardust-page__popup"
              initial={{opacity: 0, x: '50%', y: '50%', scale: 0}}
              animate={{opacity: 1, x: '-50%', y: '-50%', scale: 1}}
              transition={{duration: 0.8}}
              exit={{opacity: 0, x: '-100%', y: '-100%', scale: 0}}
            >
              <button className="stardust-page__popup-close" onClick={() => {
                setMove(true);
                setPopupActive(false);
                gsap.to(window, {duration: 0.5, scrollTo: {y: sturdust.current,  ease: 'power2.inOut'}});

              }} aria-label="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                  <path d="M12.3059 12.6447L7.49707 17.4536L6.78996 16.7465L11.5988 11.9376L6.71953 7.05831L7.42664 6.3512L12.3059 11.2305L16.9726 6.56389L17.6797 7.27099L13.0131 11.9376L17.6093 16.5338L16.9021 17.2409L12.3059 12.6447Z" fill="#C8C6FF"/>
                </svg>
              </button>
              <p className='mb-0 text--info'><svg width="52" height="20" viewBox="0 0 52 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.48598 3.20385C9.77477 2.93205 10.2252 2.93205 10.514 3.20385L14.764 7.20385C15.0657 7.48774 15.08 7.96239 14.7962 8.26402C14.5123 8.56565 14.0376 8.58004 13.736 8.29615L10.75 5.48582L10.75 16.25C10.75 16.6642 10.4142 17 10 17C9.58579 17 9.25 16.6642 9.25 16.25L9.25 5.48582L6.26403 8.29615C5.9624 8.58004 5.48774 8.56565 5.20385 8.26402C4.91996 7.96239 4.93435 7.48774 5.23598 7.20385L9.48598 3.20385Z" fill="#C8C6FF"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M42 3C42.4142 3 42.75 3.33579 42.75 3.75V14.5142L45.736 11.7038C46.0376 11.42 46.5123 11.4343 46.7962 11.736C47.08 12.0376 47.0657 12.5123 46.764 12.7962L42.514 16.7962C42.2252 17.068 41.7748 17.068 41.486 16.7962L37.236 12.7962C36.9343 12.5123 36.92 12.0376 37.2039 11.736C37.4877 11.4343 37.9624 11.42 38.264 11.7038L41.25 14.5142V3.75C41.25 3.33579 41.5858 3 42 3Z" fill="#C8C6FF"/>
              </svg>
              </p>
              <p className="text--info">Scroll to zoom in-out</p>
              <p className="mb-0 text--info">
                <svg width="52" height="20" viewBox="0 0 52 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.26402 5.20385C8.56565 5.48774 8.58004 5.9624 8.29615 6.26403L5.48582 9.25H16.25C16.6642 9.25 17 9.58579 17 10C17 10.4142 16.6642 10.75 16.25 10.75H5.48582L8.29615 13.736C8.58004 14.0376 8.56565 14.5123 8.26402 14.7962C7.96239 15.08 7.48774 15.0657 7.20385 14.764L3.20385 10.514C2.93205 10.2252 2.93205 9.77477 3.20385 9.48598L7.20385 5.23598C7.48774 4.93435 7.96239 4.91996 8.26402 5.20385Z" fill="#C8C6FF"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M43.736 5.20385C44.0376 4.91996 44.5123 4.93435 44.7962 5.23598L48.7962 9.48598C49.068 9.77477 49.068 10.2252 48.7962 10.514L44.7962 14.764C44.5123 15.0657 44.0376 15.08 43.736 14.7962C43.4343 14.5123 43.42 14.0376 43.7038 13.736L46.5142 10.75H35.75C35.3358 10.75 35 10.4142 35 10C35 9.58579 35.3358 9.25 35.75 9.25H46.5142L43.7038 6.26403C43.42 5.9624 43.4343 5.48774 43.736 5.20385Z" fill="#C8C6FF"/>
                </svg>
              </p>
              <p className="mb-0 text--info">Drag to move the camera</p>
            </motion.div>
          )
        }

        <div className="stardust-page__wrap">
          <div className="stardust-page__text">
            <div className="ia-container">
              <div className="text--info stardust-page__text-in">
                <p>“It is totally 100% true: nearly all the elements in the human body were made in a star and many have
                  come through several supernovas.”</p>
                <p><strong>–Dr Ashley King, Planetary scientist </strong></p>
              </div>


            </div>
          </div>
          <div className="spline-canvas">

            {
              currentOption && <Spline scene={currentOption.spline} onLoad={onSplineLoad}/>
            }
            {
              currentOption && move && (
                <motion.div
                  key={`person-${currentOption.value}`}
                  className="spline-canvas__tooltip text--info "
                  initial={{opacity: 0, x: '100%', y: '50%', scale: 0}}
                  animate={{opacity: 1, x: '50%', y: '-50%', scale: 1}}
                  transition={{duration: 0.8}}
                  exit={{opacity: 0, x: '-100%', y: '-100%', scale: 0}}
                >
                  <p className="mb-0">
                    <strong>{currentOption.label}</strong>
                    <br/>
                    {currentOption.tooltip}
                  </p>
                </motion.div>
              )
            }
          </div>
        </div>
          <div className="text--info stardust-page__text-in spline-nav">
            <p>The creators behind this site are made of stardust.</p>
            <div className="spline-tabs">
              {
                options.map((item, index) => (
                  <button className={`ia-btn ia-btn--sm ${currentOption.value === item.value ? 'active' : ''}`} key={`tab-${item.value}` } onClick={() => setCurrentOption(item)}>
                    {item.label}
                  </button>
                ))
              }
            </div>
          </div>

          <button className="ia-btn stardust-page__back"  onClick={()=>{
            onBackToIntro();
            setPopupActive(false);
            setMove(false);

          }}
                  aria-label="start stardust again">
            Become stardust again
          </button>

      </div>
    </div>
  )
}
export default Stardust;