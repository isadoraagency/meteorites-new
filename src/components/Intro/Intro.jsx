import './Intro.scss';

import {useState, useEffect, useRef} from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDecodeText } from "../../hooks/useDecodeText";
import meteorImg from '/images/meteor.webp';
import videoIntro from '/videos/intro-bg.mp4';
gsap.registerPlugin(ScrollTrigger);

export default function Intro({progress, isLoaded, animationComplete=false, toggleAnimationComplete, isReturningToIntro = false}) {

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
      gsap.set(intro1Ref.current,{opacity: 0})
      gsap.set(meteor,{scale: 0.6})

      if (animationComplete) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top top',
            end: () => window.innerHeight * 6,
            scrub: 1.5,
            pin: true,
            // pinSpacing: false,
            id: "intro-scroll",
            // markers: true,
            invalidateOnRefresh: true
          }
        });

        tl
          .fromTo(intro1Ref.current, {y: '-50%', opacity: 1},{y: -200, opacity: 0, ease: "power2.inOut"
          })
          .to(introBg.current, {filter: 'blur(0px)', ease: 'power3.out'}, '<')
          .to(intro2Ref.current,  {opacity: 1, ease: "power2.inOut", onStart: () => setTriggerIntro2(true)})
          .to(intro2Ref.current, {y: '-60%', opacity: 0, ease: "power2.inOut"})
          .to(intro3Ref.current, {y: '-50%', opacity: 1, ease: "power2.inOut", onStart: () => setTriggerIntro3(true)})
          .to(intro3Ref.current, {y: '-60%', opacity: 0, ease: "power2.inOut"})
          .to(introBg.current, {width: '100%', height: '70%', borderRadius: '50vh', duration: 1, ease: "power2.inOut"})
          .to(intro4Ref.current, {x: '0%', duration: 1, ease: "power2.inOut"}, '<')
          .to(intro4Ref.current, {opacity: 0, x: '-50%', duration: 1, ease: "power2.inOut" })
          .to(introBg.current, {width: '40%', height: '30%', borderRadius: '30vh', duration: 1, ease: "power2.inOut"}, "<")
          .to(introBg.current, {width: '90px', height: '90px', borderRadius: '30vh', duration: 0.5, ease: "power2.inOut"})
          .to(introBg.current, {opacity: 0, duration: 0.5, ease: "power2.inOut"})

          .to(introText5Ref.current, {y: '0', opacity: '1',  duration: 0.5, ease: "power2.inOut", onStart: () => setTriggerIntro5(true)})
          .to(meteor.current, {top: '40%', scale: 1, opacity: '1',  duration: 2, ease: "power2.inOut"}, "<")
          .to(introText5Ref.current, {y: '-50%', opacity: '0',  duration: 0.5, ease: "power2.inOut"}, '-=1')
          .to('.intro-6', {y: '-50%', opacity: '1',  duration: 0.5, ease: "power2.inOut", onStart: () => setTriggerIntro6(true)},'-=.7' )
          .to(meteor.current, {top: '100%', opacity: 0.5, scale: 1.8, duration: 0.3, ease: "power2.inOut"})
          .to('.intro-6', { opacity: '0',  duration: 0.3, ease: "power2.inOut"})

          .to(meteor.current, {top: '110%', opacity: 0,   duration: 0.3 , ease: "power2.inOut", onComplete(){
            window.scrollTo({
              top: window.innerHeight * 7,
              behavior: 'smooth'
            });
          }}, "<")
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

    <div className="intro" ref={introRef} role="region" aria-label="Introduction sequence">
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
          <p className="h6 text--info" ref={textRef}>A tale of beginnings by Isadora Agency</p>
        </div>
        <div className="intro-2" ref={intro2Ref}>
          <div className="fz-5 text-upper text--info text-title" ref={introText2Ref}>ACCORDING TO Planetary scientistS and stardust expertS, nearly all the elements in the human body were made in a star and many have come through several supernovas.</div>
        </div>
        <div className="intro-3" ref={intro3Ref}>
          <div className="fz-5 text-upper text--info text-title" ref={introText3Ref}>THEY KNOW THIS THANKS TO THE STUDY OF METEORITES.</div>
        </div>
        <div className="intro-5 fz-5 text-title text-upper" ref={introText5Ref}>
          Meteorites are far older than any terrestrial rock, acting as snapshots of the solar system before planets even existed.
        </div>
        <div className="intro-6 fz-5 text-title text-upper" ref={introText6Ref}>
          So in a way they are like Time Capsules, this site is dedicated to them.
        </div>
        <div className="intro-meteor" ref={meteor}>
          <img src={meteorImg} alt="meteor" aria-hidden="true"/>
        </div>
      </div>
    </div>
  )
}
