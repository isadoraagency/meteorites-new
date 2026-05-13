import {useState, useEffect, useRef} from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addDecodeToTimeline } from "../../hooks/addDecodeToTimeline";
import { useDecodeText } from "../../hooks/useDecodeText";
import './Intro.scss';
import meteorImg from '/images/meteor.webp';
import meteorVideo from '/videos/Meteorite-Loop.mov';
import meteorVideoW from '/videos/Meteorite-Loop.webm';
import videoIntro from '/videos/intro-bg.mp4';
gsap.registerPlugin(ScrollTrigger);

export default function Intro({progress, isLoaded, animationComplete= false, toggleAnimationComplete, isJumping, className='', toggleNav}) {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const meteor = useRef(null);
  const introBg = useRef(null);
  const introBgVideo = useRef(null);
  const introRef = useRef(null);
  const intro1Ref = useRef(null);
  const intro2Ref = useRef(null);
  const intro3Ref = useRef(null);
  const intro4Ref = useRef(null);
  const introText2Ref = useRef(null);
  const introText3Ref = useRef(null);
  const introText5Ref = useRef(null);
  const introText6Ref = useRef(null);
  //
  // const [triggerIntro2, setTriggerIntro2] = useState(false);
  // const [triggerIntro3, setTriggerIntro3] = useState(false);
  const [triggerIntro5, setTriggerIntro5] = useState(false);
  const [triggerIntro6, setTriggerIntro6] = useState(false);

  const options = {
    iterations: 4,
    speed: 0.05,
    stagger: 0.01,
    blured: 5,
    opacity: 0.9,
  };
  const mm = gsap.matchMedia()

  useDecodeText(titleRef, isLoaded);
  useDecodeText(textRef, isLoaded);

  // useDecodeText(introText2Ref, triggerIntro2, options);
  // useDecodeText(introText3Ref, triggerIntro3, options);

  useDecodeText(introText5Ref, triggerIntro5, options);
  useDecodeText(introText6Ref, triggerIntro6, options);

  useEffect(() => {
    const ctx2 = gsap.context(() => {
      gsap.set(intro1Ref.current,{opacity: 0})
      if (isLoaded) {
        gsap.to('.intro-counter', {
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out'
        })
        gsap.fromTo(intro1Ref.current, {
          opacity: 0,
          y: '100%',
          duration: 1,
          ease: 'power3.out'
        }, {
          opacity: 1,
          y: '-50%',
          duration: 1,
          ease: 'power3.out',
          onComplete: () => {
            toggleAnimationComplete();
          }
        })
      }
    }, introRef)
    return () => ctx2.revert();
  }, [isLoaded])


  useEffect(() => {
    const ctx = gsap.context(() => {


      mm.add({
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 768px) and (max-width: 1023px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        const { isDesktop, isTablet, isMobile } = context.conditions

      gsap.set(introBgVideo.current, { scale: 1.3 })
      gsap.set(intro1Ref.current, { opacity: 0 })
      gsap.set(meteor.current, { scale: 0.6, top: '-100%', opacity: 0 })

      if (!animationComplete) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top top',
          end: '+=10000px',
          scrub: 1,
          pin: true,
          pinSpacing: false,
          id: "intro-scroll",
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onEnter: () => {
             if (isJumping) return;
             toggleNav && toggleNav(false);
          },
          onEnterBack: () => {
             if (isJumping) return;
             toggleNav && toggleNav(false);
          },
          onLeave: () => {
             if (isJumping) return;
             toggleNav && toggleNav(true);
          },
          snap: isJumping ? false : {
            snapTo: "labelsDirectional",
            duration: { min: 0.3, max: 2 },
            ease: "power2.out",
          }
        }
      })

      // ======================
      // 1 animation
      // ======================
      tl.addLabel("intro-1")

        .fromTo(
          intro1Ref.current,
          { y: '-50%', opacity: 1 },
          { y: '-100%', opacity: 0, ease: "power2.inOut" }
        )
        .to(
          introBg.current,
          { filter: 'blur(0px)', ease: 'power3.out' },
          '<'
        )
        .to(introRef.current, {background: "transparent"}, '<')
        .set(
          intro2Ref.current,
          { opacity: 1}, '-=.1'
        )

      const decodeDuration2 = (introText2Ref.current.textContent.length - 1) * options.stagger + options.iterations * options.speed;
      const startDecode2 = tl.duration() - 0.1;
      tl.to(introBgVideo.current, {
        scale: 1.2,
        duration: decodeDuration2,
        ease: "none"
      }, startDecode2);
      addDecodeToTimeline(tl, introText2Ref.current, options, startDecode2);


      // ======================
      // 2 animation
      // ======================
      tl.addLabel("intro-2")

        .to(intro2Ref.current, { opacity: 0, ease: "power2.inOut" })
        .set(
          intro3Ref.current,
          { opacity: 1 }
        );

      const decodeDuration3 = (introText3Ref.current.textContent.length - 1) * options.stagger + options.iterations * options.speed;
      const startDecode3 = tl.duration();
      tl.to(introBgVideo.current, {
        scale: 1.1,
        duration: decodeDuration3,
        ease: "none"
      }, startDecode3);
      addDecodeToTimeline(tl, intro3Ref.current, options, startDecode3);

      // ======================
      // 3 animation
      // ======================
      tl.addLabel("intro-3")

        .to(intro3Ref.current, { opacity: 0, ease: "power2.inOut" })

        .to(introBgVideo.current, {
          scale: 1.05
        }, '<')

        .to(
          introBg.current,
          { width: isMobile ? '95%' : '100%', height: isMobile ? '90%': '70%', borderRadius: '50vh', duration: 1.5, ease: "power2.inOut" }
        )
        .set(document.body.querySelector('.footer'), {color: '#6D65C4'}, "<+.5")
        .to(
          intro4Ref.current,
          { x: '0%', duration: 1.5, ease: "power2.inOut" },
          '<'
        )
        // if(isMobile){
        //   tl.to(
        //     intro4Ref.current,
        //     { x: '-100%', duration: 1, ease: "power2.inOut" }
        //   )
        // }

      // ======================
      // 4 animation
      // ======================
      tl.addLabel("intro-4")
        .to(
          introBg.current,
          {
            width: '90px',
            height: '90px',
            borderRadius: '30vh',
            duration: 1.5,
            ease: "power1.inOut",
            onComplete: () => {
              if (!isJumping) setTriggerIntro5(false);
            }
          }
        )
        .to(introBgVideo.current, {
          scale: 1
        }, '<')
        .to(
          intro4Ref.current,
          { opacity: 0, x: '-100%', duration: 1,
            ease: "power2.inOut"
          }, '<'
        )

        // .to(
        //   introBg.current,
        //   { width: '40%', height: '30%', borderRadius: '30vh', duration: 1,
        //     ease: "power2.inOut"
        //   },
        //   "<"
        // )

        .to(introBg.current, { opacity: 0, duration: 1 })
        .set(
          introText5Ref.current,
          { opacity: 1, onComplete: () => { if (!isJumping) setTriggerIntro5(true) } },
          "-=0.1"
        )

      // ======================
      // 5 animation
      // ======================
      tl.addLabel("intro-5")

        .to(
          meteor.current,
          { top: '0%', scale: 1, opacity: 1, duration: 2, ease: "power2.inOut" }
        )
        .to(
          introText5Ref.current,
          { opacity: 0, duration: 0.5, ease: "power2.inOut" },
          '-=1'
        )
        .set(
          '.intro-6',
          { opacity: 1, onComplete: () => { if (!isJumping) setTriggerIntro6(true) } }, '-=0.1'
        )

      // ======================
      // 6 animation
      // ======================
      tl.addLabel("intro-6")
        .to(
          meteor.current,
          { top: '150%', opacity: 0.5, scale: 1.8, duration: 0.3, ease: "power2.inOut" }
        )
        .to('.intro-6', { opacity: 0, duration: 0.3 })
        .set(document.body.querySelector('.footer'), {color: '#B7AFFF'})
        .to(
          meteor.current,
          {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
            // onUpdate() {
            //   if (this.progress() === 1 && Math.abs(window.scrollY - 10000) < 500) {
            //     window.scrollTo({
            //       top: 10000,
            //     })
            //   }
            // }
          }
        )
      tl.addLabel("intro-7")

    }, introRef)
    })
    return () => ctx.revert()
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
          ref={introBgVideo}
        />
        <div className="intro-4 text-upper text--info ">
          <div className="text-title" ref={intro4Ref}>Time Capsules</div>
        </div>
      </div>
      <div className="ia-container">
        <div className="intro-counter lg text--info text-light text-title" aria-live="polite" aria-atomic="true">{progress}%</div>
        <div className="intro-1" ref={intro1Ref}>
          <div className="lg text-title text--info text-light mb-2"  ref={titleRef}>WE ARE MADE <br/>OF STARDUST</div>
          <p className="h6 text--info mb-0 text-light" ref={textRef}>A tale of beginnings <br/>by Isadora Agency</p>
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
          <video src={isSafari ? meteorVideo : meteorVideoW} autoPlay loop muted playsInline className="w-100 h-100" />
        </div>
      </div>
    </div>
  )
}
