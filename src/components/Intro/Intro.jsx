import {useState, useEffect, useRef} from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDecodeText } from "../../hooks/useDecodeText";
import './Intro.scss';
import meteorImg from '/images/meteor.webp';
import videoIntro from '/videos/intro-bg.mp4';
gsap.registerPlugin(ScrollTrigger);

export default function Intro({progress, isLoaded, animationComplete= false, toggleAnimationComplete, className=''}) {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const meteor = useRef(null);
  const introBg = useRef(null);
  const introRef = useRef(null);
  const intro1Ref = useRef(null);
  const intro2Ref = useRef(null);
  const intro3Ref = useRef(null);
  const intro4Ref = useRef(null);
  const introText2Ref = useRef(null);
  const introText3Ref = useRef(null);
  const introText5Ref = useRef(null);
  const introText6Ref = useRef(null);

  const [triggerIntro2, setTriggerIntro2] = useState(false);
  const [triggerIntro3, setTriggerIntro3] = useState(false);
  const [triggerIntro5, setTriggerIntro5] = useState(false);
  const [triggerIntro6, setTriggerIntro6] = useState(false);

  const options = {
    iterations: 4,
    speed: 0.05,
    stagger: 0.01,
    blured: 5,
    opacity: 0.9,
  };

  useDecodeText(titleRef, isLoaded);
  useDecodeText(textRef, isLoaded);
  useDecodeText(introText2Ref, triggerIntro2, options);
  useDecodeText(introText3Ref, triggerIntro3, options);
  useDecodeText(introText5Ref, triggerIntro5, options);
  useDecodeText(introText6Ref, triggerIntro6, options);

  useEffect(() => {
    const ctx2 = gsap.context(() => {
      gsap.set(intro1Ref.current,{opacity: 0})
      if (isLoaded) {
        gsap.to('.intro-counter', {
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => {
            toggleAnimationComplete();
          }
        })
        // gsap.fromTo(intro1Ref.current, {
        //   opacity: 0,
        //   y: '100%',
        //   duration: 1,
        //   ease: 'power3.out'
        // }, {
        //   opacity: 1,
        //   y: '-50%',
        //   duration: 1,
        //   ease: 'power3.out',
        //
        // })
      }
    }, introRef)
    return () => ctx2.revert();
  }, [isLoaded])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(intro1Ref.current,{opacity: 0})
      gsap.set(meteor,{scale: 0.6})
      const animationStates = {
        anim0: false,
        anim1: false,
        anim2: false,
        anim3: false,
        anim4: false,
        anim5: false,
        anim6: false
      };

      const timelines = {
        tl0: null,
        tl1: null,
        tl2: null,
        tl3: null,
        tl4: null,
        tl5: null,
        tl6: null
      };

      let isAnimating = false;

      if (animationComplete) {

        gsap.set(intro1Ref.current, {opacity: 0, y: '100%'});
        gsap.set(intro2Ref.current, {opacity: 0});
        gsap.set(intro3Ref.current, {opacity: 0});
        gsap.set(introText5Ref.current, {opacity: 0});
        gsap.set('.intro-6', {opacity: 0});
        gsap.set(meteor.current, {scale: 0.6});


        let prevProgress = 0;

        const scrollTrigger = ScrollTrigger.create({
          trigger: introRef.current,
          start: 'top top',
          end: () => window.innerHeight * 3,
          pin: true,
          pinSpacing: true,
          id: "intro-scroll",
          anticipatePin: 1,
          // markers: true,
          invalidateOnRefresh: true,
          onUpdate: self => {

            if (isAnimating) return;

            const progress = self.progress;
            const isScrollingDown = progress > prevProgress;

            // down
            if (isScrollingDown) {
              if(progress >= 0 && !animationStates.anim0){
                playAnimation0();
              }
              else if (progress > 0.1 && !animationStates.anim1) {
                playAnimation1();
              }
              else if (progress > 0.15 && !animationStates.anim2) {
                playAnimation2();
              }
              else if (progress > 0.3 && !animationStates.anim3) {
                playAnimation3();
              }
              else if (progress > 0.5 && !animationStates.anim4) {
                playAnimation4();
              }
              else if (progress > 0.7 && !animationStates.anim5) {
                playAnimation5();
              }
              else if (progress > 0.85 && !animationStates.anim6) {
                playAnimation6();
              }
            }//up
            else {
              if (progress < 0.85 && animationStates.anim6) {
                reverseAnimation(6);
              }
              else if (progress < 0.7 && animationStates.anim5) {
                reverseAnimation(5);
              }
              else if (progress < 0.5 && animationStates.anim4) {
                reverseAnimation(4);
              }
              else if (progress < 0.3 && animationStates.anim3) {
                reverseAnimation(3);
              }
              else if (progress < 0.15 && animationStates.anim2) {
                reverseAnimation(2);
              }
              else if (progress < 0.1 && animationStates.anim1) {
                reverseAnimation(1);
              }
              else if (progress <= 0 && animationStates.anim0) {
                reverseAnimation(0);
              }
            }

            prevProgress = progress;
          }
        });


        function disableScroll() {
          isAnimating = true;
          document.body.style.overflow = 'hidden';
        }


        function enableScroll() {
          isAnimating = false;
          document.body.style.overflow = '';
        }


        function reverseAnimation(num) {
          disableScroll();


          const timeline = timelines[`tl${num}`];

          if (timeline) {

            timeline.reverse();


            animationStates[`anim${num}`] = false;


            timeline.eventCallback("onReverseComplete", enableScroll);


          } else {
            enableScroll();
          }
        }


        function playAnimation0() {
          disableScroll();

          const tl = gsap.timeline({
            onComplete: () => {
              enableScroll();
              animationStates.anim0 = true;
            }
          });

          tl.fromTo(intro1Ref.current,
            {
              opacity: 0,
              y: '100%'
            },
            {
              opacity: 1,
              y: '-50%',
              duration: 1,
              ease: 'power3.out',
            }
          );

          timelines.tl0 = tl;
        }



        function playAnimation1() {
          disableScroll();

          const tl = gsap.timeline({
            onComplete: () => {
              enableScroll();
              animationStates.anim1 = true;

            }
          });

          tl.fromTo(intro1Ref.current,
            {y: '-50%', opacity: 1},
            {y: '-100%', opacity: 0, duration: 1, ease: "power2.inOut"}
          )
            .to(introBg.current,
              {filter: 'blur(0px)', duration: 1, ease: 'power3.out', onStart: () => setTriggerIntro2(false)},
              '<'
            )
            .set(intro2Ref.current,
              {opacity: 1, ease: "power2.inOut", onComplete: () => setTriggerIntro2(true)}
            )
            .to({},
              {duration: 0.5, onComplete: () => setTriggerIntro3(false)}
            );


          timelines.tl1 = tl;
        }

        function playAnimation2() {
          disableScroll();

          const tl = gsap.timeline({
            onComplete: () => {
              enableScroll();
              animationStates.anim2 = true;
            }
          });

          tl.to(intro2Ref.current,
            {opacity: 0, duration: 1, ease: "power2.inOut"}
          )
            .set(intro3Ref.current,
              {opacity: 1, ease: "power2.inOut", onComplete: () => setTriggerIntro3(true)}
            )
            .to({},
              {duration: 0.5}
            );


          timelines.tl2 = tl;
        }

        function playAnimation3() {
          disableScroll();

          const tl = gsap.timeline({
            onComplete: () => {
              enableScroll();
              animationStates.anim3 = true;
            }
          });

          tl.to(intro3Ref.current,
            {opacity: 0, duration: 1, ease: "power2.inOut"}
          )
            .to(introBg.current,
              {width: '100%', height: '70%', borderRadius: '50vh', duration: 1.5, ease: "power2.inOut"}
            )
            .to(intro4Ref.current,
              {x: '0%', duration: 1.5, ease: "power2.inOut"},
              '<'
            );

          timelines.tl3 = tl;
        }

        function playAnimation4() {
          disableScroll();

          const tl = gsap.timeline({
            onComplete: () => {
              enableScroll();
              animationStates.anim4 = true;
            }
          });

          tl.to(intro4Ref.current,
            {opacity: 0, x: '-50%', duration: 1, ease: "power2.inOut"}
          )
            .to(introBg.current,
              {width: '40%', height: '30%', borderRadius: '30vh', duration: 1, ease: "power2.inOut"},
              "<"
            )
            .to(introBg.current,
              {width: '90px', height: '90px', borderRadius: '30vh', duration: 0.5, ease: "power2.inOut", onComplete: () => setTriggerIntro5(false)}
            )
            .to(introBg.current,
              {opacity: 0, duration: 0.5, ease: "power2.inOut"}
            )
            .set(introText5Ref.current,
              {opacity: '1', ease: "power2.inOut", onComplete: () => setTriggerIntro5(true)},
              "-=0.1"
            )
            .to({},
              {duration: 0.5, onComplete: () => setTriggerIntro6(false)}
            );


          timelines.tl4 = tl;
        }

        function playAnimation5() {
          disableScroll();

          const tl = gsap.timeline({
            onComplete: () => {
              enableScroll();
              animationStates.anim5 = true;
            }
          });

          tl.to(meteor.current,
            {top: '40%', scale: 1, opacity: '1', duration: 2, ease: "power2.inOut"}
          )
            .to(introText5Ref.current,
              {opacity: '0', duration: 0.5, ease: "power2.inOut"},
              '-=1'
            )
            .set('.intro-6',
              {opacity: '1', ease: "power2.inOut", onComplete: () => setTriggerIntro6(true)}
            )
            .to({},
              {duration: 0.5}
            );


          timelines.tl5 = tl;
        }

        function playAnimation6() {
          disableScroll();

          const tl = gsap.timeline({
            onComplete: () => {
              enableScroll();
              animationStates.anim6 = true;
            }
          });

          tl.to(meteor.current,
            {top: '100%', opacity: 0.5, scale: 1.8, duration: 0.3, ease: "power2.inOut"}
          )
            .to('.intro-6',
              {opacity: '0', duration: 0.3, ease: "power2.inOut"}
            )
            .to(meteor.current,
              {top: '110%', opacity: 0, duration: 0.3, ease: "power2.inOut",
                onComplete() {
                  window.scrollTo({
                    top: window.innerHeight * 7,
                    behavior: "smooth"
                  });
                }
              },
              "-=0.4"
            );

          timelines.tl6 = tl;
        }
      }


    }, introRef)
    return () => ctx.revert();
  }, [animationComplete])

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    ro.observe(introRef.current);

    return () => ro.disconnect();
  }, []);
  return (

      <div className={`intro ${className}`} ref={introRef} role="region" aria-label="Introduction sequence">
      <div className="intro-bg" ref={introBg} aria-hidden="true">
        <video
          src={videoIntro}
          playsInline
          muted
          loop
          autoPlay
          type="video/mp4"
          aria-hidden="true"
        />
        <div className="intro-4 text-upper text--info ">
          <div className="text-title" ref={intro4Ref}>Time Capsules</div>
        </div>
      </div>
      <div className="ia-container">
        <div className="intro-counter lg text--info text-light text-title" aria-live="polite" aria-atomic="true">{progress}%</div>
        <div className="intro-1" ref={intro1Ref}>
          <div className="lg text-title text--info text-light mb-2"  ref={titleRef}>WE ARE MADE OF STARDUST</div>
          <p className="h6 text--info mb-0" ref={textRef}>A tale of beginnings by Isadora Agency</p>
        </div>
        <div className="intro-2" ref={intro2Ref}>
          <div className="fz-5 text-upper text--info text-title" ref={introText2Ref}>ACCORDING TO Planetary scientistS and stardust expertS, nearly all the elements in the human body were made in a star and many have come through several supernovas.</div>
        </div>
        <div className="intro-3" ref={intro3Ref}>
          <div className="fz-5 text-upper text--info text-title mb-0" ref={introText3Ref}>THEY KNOW THIS THANKS TO THE STUDY OF METEORITES.</div>
        </div>
        <div className="intro-5 fz-5 text-title text-upper mb-0" ref={introText5Ref}>
          Meteorites are far older than any terrestrial rock, acting as snapshots of the solar system before planets even existed.
        </div>
        <div className="intro-6 fz-5 text-title text-upper mb-0" ref={introText6Ref}>
          So in a way they are like Time Capsules, this site is dedicated to them.
        </div>
        <div className="intro-meteor" ref={meteor}>
          <img src={meteorImg} alt="meteor" aria-hidden="true"/>
        </div>
      </div>
    </div>

  )
}
