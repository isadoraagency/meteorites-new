import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {ScrollTrigger, ScrollToPlugin} from "gsap/all";

import './TypeMeteorites.scss'
import {useDecodeText} from "../../hooks/useDecodeText.js";
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger)

export default function TypeMeteorites({isLoaded, className}) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const centerRef = useRef(null)
  const itemsRef = useRef([])
  const circleRef = useRef(null)
  const itemTitleRef = useRef([])
  const itemsTextRef = useRef([])

  const [activeStep, setActiveStep] = useState(null)


  const [data, setData] = useState([])
  const containerRef = useRef(null);
  const [R, setR] = useState(0);

  const [animateMainTitle, setAnimateMainTitle] = useState(false);
  const [animateMainDesc, setAnimateMainDesc] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);
  const activeTitleRef = useRef(null);


  const options = {
    iterations: 4,
    speed: 0.08,
    stagger: 0.03,
    opacity: 0,
    blured: 5
  }
  const options2 = {
    iterations: 4,
    speed: 0.08,
    stagger: 0.005,
    opacity: 0,
    blured: 5
  }


  useDecodeText(activeTitleRef, animateTitle, options);

  useDecodeText(titleRef, animateMainTitle, options);
  useDecodeText(descRef, animateMainDesc, options2);

  useEffect(() => {
    // First, disable animation to reset if step changes
    setAnimateTitle(false);

    // Small delay to ensure animation flag is reset
    const timeoutId = setTimeout(() => {
      if (activeStep !== null && itemTitleRef.current[activeStep]) {
        // Update ref to current active title
        activeTitleRef.current = itemTitleRef.current[activeStep];
        // Enable animation for new title
        setAnimateTitle(true);
      } else {
        activeTitleRef.current = null;
      }
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [activeStep]);



  const handleItemActivation = (step) => {
    if (itemsRef.current[step]) {
      // Clear any previous active classes
      itemsRef.current.forEach(el => {
        if (el) el.classList.remove('active');
      });

      // Set new active class and step
      itemsRef.current[step].classList.add('active');
      setActiveStep(step);
    }
  };

  const handleItemDeactivation = () => {
    itemsRef.current.forEach(el => {
      if (el) el.classList.remove('active');
    });
    setActiveStep(null);
  };




  useEffect(() => {
    fetch('/data/types.json')
      .then(res => res.json())
      .then(setData)
  }, [])


  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      setR(containerRef.current.offsetWidth / 2);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, []);


  useEffect(() => {
    if (!data.length) return

    const ctx = gsap.context(() => {

      const POSITIONS = [
        // 12
        { x: 0, y: -R, scale: 1.2 },

        // 14  (2)
        {
          x: Math.cos(-45 * Math.PI / 180) * R,
          y: Math.sin(-45 * Math.PI / 180) * R,
          scale: 0.9
        },

        // 15
        {
          x: Math.cos(0 * Math.PI / 180) * R,
          y: Math.sin(0 * Math.PI / 180) * R,
          scale: 0.8
        },

        // 9
        {
          x: Math.cos(180 * Math.PI / 180) * R,
          y: Math.sin(180 * Math.PI / 180) * R,
          scale: 0.8
        },

        // 10
        {
          x: Math.cos(225 * Math.PI / 180) * R,
          y: Math.sin(225 * Math.PI / 180) * R,
          scale: 0.9
        }
      ]
      const DICE_5_POSITIONS = [
        { x: 0,       y: -R *0.4 },     // center
        { x: R * 0.2, y: -R *0.6 },     // top-right
        { x: R * 0.2, y: -R * 0.3 },    // bottom-right
        { x: -R * 0.2, y: -R * 0.3 },   // bottom-left
        { x: -R * 0.2, y: -R*0.6 },     // top-left
      ];

      /* INIT STATE */
      gsap.set(titleRef.current, {
        autoAlpha: 0,
      })
      gsap.set(descRef.current, {
        autoAlpha: 0,

      })

      gsap.set(circleRef.current, {
        autoAlpha: 0,
        scale: 0
      })

      // Set initial position (dice 5 pattern)
      itemsRef.current.forEach((el, i) => {
        const pos = DICE_5_POSITIONS[i];
        gsap.set(el, {
          x: pos.x,
          y: pos.y,
          scale: 0.8,
          autoAlpha: 1,
          filter: 'blur(5px)'
        });

        gsap.set(itemsTextRef.current[i], {
          autoAlpha: 0,
        });
      });

      /* MAIN TIMELINE */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600%',
          scrub: 1.2,
          pin: true,
          pinSpacing: false,
          id: "type-meteorites-scroll",
          anticipatePin: 1,
          onEnter: () => {
            gsap.set(titleRef.current, {
              autoAlpha: 1,
              onComplete: () => {
                setAnimateMainTitle(true);
                setTimeout(() => setAnimateMainTitle(false), 2000);
              }
            });
          },
          onLeaveBack: () => {
            gsap.set(titleRef.current, {
              autoAlpha: 0,
            });
          }
        }
      })


      // Show title
      // tl.set(titleRef.current, {
      //   autoAlpha: 1,
      //   y: 0,
      //   onComplete: () => {setAnimateMainTitle(true);
      //     setTimeout(() => {
      //       setAnimateMainTitle(false);
      //     }, 2000);
      //
      //   }
      //   // duration: 1,
      //   // ease: 'power3.out'
      // })
      tl.to(titleRef.current, {duration: 0.5})


      // Create spiral animation
      const spiralTimeline = gsap.timeline();

// The number of rotations in the spiral
      const rotations = 1.5;
// Smaller stagger delay for nearly simultaneous start
      const staggerDelay = 0.1;

      itemsRef.current.forEach((el, i) => {
        // Create spiral animation for each item with shorter delay
        const spiralTween = gsap.timeline({delay: i * staggerDelay});

        // Create spiral animation with growing radius
        for (let step = 0; step <= 20; step++) {
          const progress = step / 20;
          const angle = progress * rotations * Math.PI * 2 + (i * (Math.PI * 2) / itemsRef.current.length);
          const radius = progress * R;

          spiralTween.to(el, {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            // rotation: -angle * 360 / Math.PI,
            scale: 0.8 + progress * 0.2,
            filter: `blur(${(1 - progress) * 5}px)`,
            duration: 0.1,
            ease: 'none'
          });
        }

        // After spiral, move to final position
        const finalPos = POSITIONS[i];
        spiralTween.to(el, {
          x: finalPos.x,
          y: finalPos.y,
          scale: finalPos.scale || 0.8,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'elastic.out(0.4, 0.7)'
        });

        // Add each animation to main timeline with a very small offset
        // This ensures they all start nearly simultaneously
        spiralTimeline.add(spiralTween, i === 0 ? 0 : "-=" + (0.95 * (staggerDelay * 5 + spiralTween.duration())));
      });


      // Add the spiral animation to the main timeline
      tl.add(spiralTimeline);

      // Hide title
      tl.to(titleRef.current, {
        autoAlpha: 0,
        y: -40,
        duration: 0.6
      }, "<")

      // Show description
      tl.set(descRef.current, {
        autoAlpha: 1,
        y: 0,

        onComplete: () => {
          setAnimateMainDesc(true);
          setTimeout(() => {
            setAnimateMainDesc(false);
          }, 2000);
        }
      }, "-=2")

      // Show circle outline
      tl.to(circleRef.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.3,
      }, "<")

      // Hide description
      tl.to(descRef.current, {
        autoAlpha: 0,
        y: 40,
        duration: 0.6
      })

      // Rest of the timeline for cycling through items...
      data.forEach((item, step) => {
        const activeIndex = (0 + step) % POSITIONS.length;

        tl.set(itemsTextRef.current[step], {
          autoAlpha: 1,
          onReverseComplete: () => {
            itemsRef.current.forEach((el)=>{
              el.classList.remove('active');
              handleItemDeactivation()
            })
          },
          onComplete: () => {
            itemsRef.current[step].classList.add('active');
            handleItemActivation(step)
          }
        });

        itemsRef.current.forEach((el, i) => {
          const pos = POSITIONS[(i - step + POSITIONS.length) % POSITIONS.length];

          tl.to(el, {
            x: pos.x,
            y: pos.y,
            scale: i === activeIndex ? 1 : 0.8,
            filter: i === activeIndex ? 'blur(0px)' : 'blur(5px)',
            duration: 1.5,
            ease: 'elastic.out(0.4, 0.5)'
          }, "<");
        });

        if(step !== itemsRef.current.length - 1) {
          tl.set(itemsTextRef.current[step], {
            autoAlpha: 0,
            onReverseComplete: () => {
              itemsRef.current[step].classList.add('active')
              handleItemDeactivation();
            },
            onComplete: () => {
              itemsRef.current.forEach((el) => {
                el.classList.remove('active');
                handleItemDeactivation(step)
              })
            }
          });
        }
      });

      tl.to({}, {duration: 2});
    }, sectionRef)

    return () => ctx.revert()
  }, [isLoaded, data, R])



  return (
    <div id="Types">
      <div className={`meteorites-section ${className}`}  ref={sectionRef}>
        <div className="meteorites-section__in">
          <div className="ia-container">
            <h2 ref={titleRef} className="meteorites-title">
              Types of meteorites
            </h2>
            <div className="meteorites-desc" ref={descRef}>
              <div className="fz-5 text-title text-center">Get to know the main groups of meteorites and what they reveal about the early solar system.</div>
            </div>

            <div className="meteorites-circle" ref={containerRef}>
              <div className="meteorites-circle__line" ref={circleRef}></div>
              {data.map((item, i) => (
                <div
                  key={item.id}
                  ref={el => (itemsRef.current[i] = el)}
                  className="meteorite-item"
                >
                  <img src={item.image} alt={item.name} />
                </div>
              ))}
            </div>

            <div ref={centerRef} className="meteorites-center">
              {data.map((item, i) => (
                <div key={item.id} className="meteorite-item__info" ref={el => (itemsTextRef.current[i] = el)}>
                  <div className="meteorite-item__text">
                    <div className="meteorite-item__text-left"><h3 ref={el => itemTitleRef.current[i] = el}
                    >{item.name}</h3></div>
                  </div>
                  <div className="meteorite-item__text">
                    <div className="meteorite-item__text-left"><div className="fz-6 meteorite-item__sub-title">{item.type}</div></div>
                    <div className="meteorite-item__text-right text-left"><p>{item.description}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
