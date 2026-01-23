import './Intro.scss';
import {useState, useEffect, useRef} from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDecodeText } from "../../hooks/useDecodeText";
import meteor from '/images/meteor.webp';
import videoIntro from '/videos/intro-bg.mp4';
gsap.registerPlugin(ScrollTrigger);

export default function Intro({progress, isLoaded, animationComplete=false, toggleAnimationComplete}) {

  const introRef = useRef(null);
  const intro1Ref = useRef(null);
  const intro2Ref = useRef(null);
  const intro3Ref = useRef(null);



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
      if (animationComplete) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top top',
            end: () => window.innerHeight * 6,
            scrub: true,
            pin: true,
            // pinSpacing: false,
            id: "intro-scroll",
            // markers: true,
            invalidateOnRefresh: true
          }
        });

        tl
          .fromTo(intro1Ref.current, {y: '-50%', opacity: 1},{y: -200, opacity: 0})
          .to('.intro-bg', {filter: 'blur(0px)', ease: 'power3.out'}, '<')
          .to(intro2Ref.current,  {y: '-50%', opacity: 1})
          .to(intro2Ref.current, {y: -200, opacity: 0})
          .to(intro3Ref.current, {y: '-50%', opacity: 1})
          .to(intro3Ref.current, {y: -200, opacity: 0})
          .to('.intro-bg', {width: '100%', height: '70%', borderRadius: '50vh', duration: 0.5})
          .to('.intro-4 div', {x: 0, duration: 0.5}, '<')
          .set('.intro-4 div', {opacity: 0})
          .to('.intro-bg', {width: '40%', height: '30%', borderRadius: '30vh', duration: 0.5})
          .to('.intro-bg', {width: '90px', height: '90px', borderRadius: '30vh', duration: 0.5})
          .to('.intro-bg', {opacity: 0, duration: 0.5})
          .to('.intro-5', {y: '0', opacity: '1',  duration: 0.5})
          .to('.intro-meteor', {top: '50%', opacity: '1',  duration: 0.5})
          .to('.intro-5', {y: '-100%', opacity: '0',  duration: 0.5})
          .to('.intro-6', {y: '-50%', opacity: '1',  duration: 0.5})
          .to('.intro-meteor', {top: '100%', opacity: 0.5, duration: 1}, "<")
          .to('.intro-6', { opacity: '0',  duration: 0.3})

          .to('.intro-meteor', {top: '110%', opacity: 0,   duration: 0.3, onComplete(){
              window.scrollTo({
                top: window.innerHeight * 7,
                behavior: 'smooth'
              });
            }}, "<")

        // .to('.intro-meteor', {top: '110%', opacity: 0,   duration: 0.2, ease: 'power3.out'})

      }
    }, introRef)
    return () => ctx.revert();
  }, [animationComplete])




  const titleRef = useRef(null);
  const textRef = useRef(null);
  useDecodeText(titleRef, isLoaded);
  useDecodeText(textRef, isLoaded);


  useEffect(() => {
    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    ro.observe(introRef.current);

    return () => ro.disconnect();
  }, []);
  return (
    <>

    <div className="intro" ref={introRef} role="region" aria-label="Introduction sequence">
      <div className="intro-bg" aria-hidden="true">
        <video
          src={videoIntro}
          playsInline
          muted
          loop
          autoPlay
          type="video/mp4"
          aria-hidden="true"
        ></video>
      </div>
      <div className="ia-container">
          <div className="intro-counter lg text--info text-light text-title" aria-live="polite" aria-atomic="true"
          >{progress}%</div>

          <div className="intro-1" ref={intro1Ref}>
            <div className="lg text-title text--info text-light mb-2"  ref={titleRef}>WE ARE MADE OF STARDUST</div>
            <p className="h6 text--info" ref={textRef}>A tale of beginnings by Isadora Agency</p>
          </div>
          <div className="intro-2" ref={intro2Ref}>
            <div className="fz-5 text-upper text--info text-title ">ACCORDING TO Planetary scientistS and stardust expertS, nearly all the elements in the human body were made in a star and many have come through several supernovas.</div>
          </div>
          <div className="intro-3" ref={intro3Ref}>
            <div className="fz-5 text-upper text--info text-title">THEY KNOW THIS THANKS TO THE STUDY OF METEORITES.</div>
          </div>


          <div className="intro-4 text-upper text--info ">
            <div className="text-title">Time Capsules</div>
          </div>

          <div className="intro-5 fz-5 text-title text-upper">
            Meteorites are far older than any terrestrial rock, acting as snapshots of the solar system before planets even existed.
          </div>

        <div className="intro-6 fz-5 text-title text-upper">
          So in a way they are like Time Capsules, this site is dedicated to them.
        </div>
          <div className="intro-meteor">
            <img src={meteor} alt="meteor" aria-hidden="true"/>
          </div>
      </div>
    </div>
    </>
  )
}
