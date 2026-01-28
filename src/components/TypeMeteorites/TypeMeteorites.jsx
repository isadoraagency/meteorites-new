import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {ScrollTrigger, ScrollToPlugin} from "gsap/all";

import './TypeMeteorites.scss'
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger)

export default function TypeMeteorites({isLoaded}) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const centerRef = useRef(null)
  const itemsRef = useRef([])
  const circleRef = useRef(null)

  const itemsTextRef = useRef([])

  const [data, setData] = useState([])
  const containerRef = useRef(null);
  const [R, setR] = useState(0);

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
          x:  Math.cos(-45 * Math.PI / 180) * R,
          y:  Math.sin(-45 * Math.PI / 180) * R,
          scale: 0.9
        },

        // 15
        {
          x:  Math.cos(0 * Math.PI / 180) * R,
          y:  Math.sin(0 * Math.PI / 180) * R,
          scale: 0.8
        },

        // 9
        {
          x:  Math.cos(180 * Math.PI / 180) * R,
          y:  Math.sin(180 * Math.PI / 180) * R,
          scale: 0.8
        },

        // 10
        {
          x:  Math.cos(225 * Math.PI / 180) * R,
          y:  Math.sin(225 * Math.PI / 180) * R,
          scale: 0.9
        }
      ]
      const DICE_5_POSITIONS = [
        { x:  0,        y:  -R *0.4       }, // center
        { x:  R * 0.2, y: -R *0.6 }, // top-right
        { x:  R * 0.2, y:  -R * 0.3 },  // bottom-right
        { x: -R * 0.2, y:  -R * 0.3 }, // bottom-left
        { x: -R * 0.2, y: -R*0.6 }, // top-left




      ];
      /* INIT STATE */
      gsap.set(titleRef.current, {
        autoAlpha: 0,
        y: 40
      })
      gsap.set(descRef.current, {
        autoAlpha: 0,
        y: 40
      })

      // gsap.set(centerRef.current, {
      //   autoAlpha: 0,
      //   scale: 0.9
      // })
      gsap.set(circleRef.current, {
        autoAlpha: 0,
        scale: 0
      })


      itemsRef.current.forEach((el, i) => {
        const pos = DICE_5_POSITIONS[i];

        gsap.set(el, {
          x: pos.x,
          y: pos.y,
          scale: 0.8,
          autoAlpha: 1,
          filter: 'blur(5px)'
        });
        // if (itemsTextRef && itemsTextRef[i] && itemsTextRef[i].current) {

          gsap.set(itemsTextRef.current[i], {
            y: 50,
            scale: 0.5,
            autoAlpha: 0,
          });
        // }


      });


      /* MAIN TIMELINE */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600%',
          scrub: 1.5,
          pin: true
        }
      })

      tl.to(titleRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      })
      // tl.to(circleRef.current, {
      //   autoAlpha: 1,
      //   y: 0,
      //   duration: 1,
      //   ease: 'power3.out'
      // })


      tl.to(titleRef.current, {
        autoAlpha: 0,
        y: -40,
        duration: 0.6
      })
      tl.to(descRef.current, {
        autoAlpha: 0,
        y: -40,
        duration: 0.6
      })


      //
      // itemsRef.current.forEach((el, i) => {
      //   tl.to(el, {
      //     ...POSITIONS[i],
      //     autoAlpha: 1,
      //     scale: POSITIONS[i].scale,
      //     filter: 'blur(0px)',
      //     duration: 1,
      //     ease: 'power3.out'
      //   }, '<')
      // })

      itemsRef.current.forEach((el, i) => {
        const pos = POSITIONS[i];
        tl.to(el, {
          x: pos.x,
          y: pos.y,
          scale:  0.8,
          filter: 'blur(5px)',
          duration: 1,
          ease: 'power3.out'
        }, '<');
      });
      tl.to(circleRef.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 1,

      }, "<")
      // itemsRef.current.forEach((el, i) => {
      //   const pos = POSITIONS[i];
      //   tl.to(el, {
      //     x: pos.x,
      //     y: pos.y,
      //     scale: i === 0 ? pos.scale : 0.6,
      //     filter: i === 0 ? 'blur(0px)' : 'blur(12px)',
      //     duration: 1,
      //     ease: 'power3.out'
      //   }, '<');
      // });


      // tl.to(centerRef.current, {
      //   autoAlpha: 1,
      //   scale: 1,
      //   duration: 0.6
      // }, '<')

      data.forEach((item, step) => {

        const activeIndex = (0 + step) % POSITIONS.length;
        //
        // tl.to(centerRef.current, {
        //   autoAlpha: 0,
        //   scale: 1,
        //   duration: 1,
        //   onComplete: () => {
        //     // centerRef.current.innerHTML = ``;
        //   }
        // });
        //  tl.to(centerRef.current, { autoAlpha: 1, scale: 1, duration: 0.4 });

        // tl.to(itemsTextRef.current[step], {
        //   y: -500,
        //   autoAlpha: 0,
        //   scale: 0.5,
        // });

        tl.set(itemsTextRef.current[step], {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          onReverseComplete: () => {
            itemsRef.current.forEach((el)=>{
              el.classList.remove('active');
            })
          },
          onComplete: () => {

            itemsRef.current[step].classList.add('active');
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
            ease: 'elastic.out(0.4, 0.5)',
            onComplete: () => {

            }
          }, "<");


          // tl.to(itemsTextRef.current[i], {
          //   y: i === activeIndex ? 0 : -500,
          //   autoAlpha: i === activeIndex ? 1 : 0,
          //   scale: i === activeIndex ? 1 : 0.5,
          //
          // });
        });
        if(step !== itemsRef.current.length - 1) {
          tl.set(itemsTextRef.current[step], {
            y: -500,
            autoAlpha: 0,
            scale: 0.5,

            onReverseComplete: () => {
              itemsRef.current[step].classList.add('active')
            },
            onComplete: () => {

              itemsRef.current.forEach((el) => {

                el.classList.remove('active');

              })

            }
          });
        }


      });
      tl.to({}, {duration: 0.01, onComplete: () => {
          gsap.to(window, {
            duration: 0.5,
            scrollTo: {y: '#Stardust', autoKill: false},
            ease: 'power2.inOut'
          });
        }})

    }, sectionRef)

    return () => ctx.revert()
  }, [isLoaded, data, R])


  return (
    <section className="meteorites-section" id="Types" ref={sectionRef}>
      <section className="meteorites-section__in">

        <div className="ia-container">

          <h2 ref={titleRef} className="meteorites-title">
            Types of meteorites
          </h2>
          <div className="meteorites-desc" ref={descRef}>
            <div className="h5">Get to know the main groups of meteorites and what they reveal about the early solar system.</div>
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
                  <div className="meteorite-item__text-left"><h3>{item.name}</h3></div>
                </div>
                <div className="meteorite-item__text">
                  <div className="meteorite-item__text-left"><div className="fz-6">{item.type}</div></div>
                  <div className="meteorite-item__text-right text-left"><p>{item.description}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}
