
import './TimeCapsules.scss';
import {useState, useEffect, useRef} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export default function TimeCapsules({isLoaded, index = 1}) {
  const timeCapsules = useRef(null);
  const timeCapsulesContainer = useRef(null);
  const timeCapsulesBg = useRef(null);
  const timeCapsulesHeading = useRef(null);
  const timeCapsulesTitle = useRef(null);
  const timeCapsulesMeta = useRef(null);
  const timeCapsulesVideo = useRef(null);
  const timeCapsulesDesc2 = useRef(null);
  const timeCapsulesDesc1 = useRef(null);
  const timeCapsulesSpec = useRef(null);

  // Ref для хранения экземпляра ScrollTrigger
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(timeCapsulesBg.current, {scale: 1})
      gsap.set(timeCapsules.current, { opacity: 0})
      gsap.set(timeCapsulesMeta.current, { opacity: 0})

      if (isLoaded) {
        // Создаем второй timeline с ScrollTrigger - но с опцией disable: true
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: timeCapsules.current,
            start: 'top top',
            end: () => window.innerHeight * 4,
            scrub: true,
            pin: true,
            // Отключаем ScrollTrigger сначала
            disable: true,
            onRefresh: self => {
              // Сохраняем экземпляр ScrollTrigger для последующего включения
              scrollTriggerRef.current = self;
            }
          }
        });

        tl2.to(timeCapsulesHeading.current, {y: 0, top: 0, ease: 'power3.out'})
          .to(timeCapsulesTitle.current, {scale: 1, ease: 'power3.out'}, "<")
          .to(timeCapsulesVideo.current, { scale: 1,  ease: 'power3.out'}, '<')
          .to(timeCapsulesMeta.current, {opacity: 1, duration: 0.2, ease: 'power3.out'})
          .to(timeCapsulesDesc1.current, { y: '-50%', opacity: 1,  ease: 'power3.out'}, '<')
          .to(timeCapsulesDesc1.current, { y: '-150%', opacity: 0,  ease: 'power3.out'})
          .to(timeCapsulesSpec.current, { y: 0, opacity: 1,  ease: 'power3.out'}, '<')
          .to(timeCapsulesSpec.current, { y: '-150%', opacity: 0,  ease: 'power3.out'})
          .to(timeCapsulesDesc2.current, { y: '-50%', opacity: 1,  ease: 'power3.out'});

        // Первая анимация (tl) - запускается автоматически без скролла
        const tl = gsap.timeline({
          onComplete: () => {
            // После завершения первой анимации, включаем ScrollTrigger
            if (scrollTriggerRef.current) {
              scrollTriggerRef.current.enable();
              // Обновляем ScrollTrigger
              ScrollTrigger.refresh();
            }
          }
        });

        tl.set(timeCapsules.current, { opacity: 1})
          .to(timeCapsulesBg.current, {scale: 3, duration: 1, ease: 'power3.out'})
          .to(timeCapsulesContainer.current, { opacity: 1, duration: 0.5 });
      }
    }, timeCapsules);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div className='time-capsules' ref={timeCapsules}>
      <div className="time-capsules-bg" ref={timeCapsulesBg}></div>
      <div className="ia-container" ref={timeCapsulesContainer}>
        <div className="time-capsules__inner">
          <div className="time-capsules-heading" ref={timeCapsulesHeading}>
            <div className="time-capsules-title" ref={timeCapsulesTitle}>Nakhla</div>
            <div className="time-capsules-meta" ref={timeCapsulesMeta}>
              <div>
                <div className="p"><strong>Fall place: </strong></div>
                <div className='p'>Abu Hommos, Egypt</div>
              </div>
              <div>
                <div className="p">
                  <strong>Fall date: </strong>
                </div>
                <div className="p">February 28, 2021</div>
              </div>
              <div>
                <div className="p"><strong>Age: </strong></div>
                <div className="p">1.3 Billion years old</div>
              </div>
            </div>
          </div>

          <div className="time-capsules__container">
            <div className="time-capsules__spec text--info" ref={timeCapsulesSpec}>
              <ul>
                <li className="text-light p3">
                  <div className="p3 mb-0 text-medium">Type</div>
                  Achondrite
                </li>
                <li className="text-light p3">
                  <div className="p3 mb-0 text-medium">Class</div>
                  Martian meteorite
                </li>
                <li className="text-light p3">
                  <div className="p3 mb-0 text-medium">Observed fall</div>
                  Yes
                </li>
                <li className="text-light p3">
                  <div className="p3 mb-0 text-medium">Found date</div>
                  June 28, 1911
                </li>
              </ul>
            </div>
            <div className="time-capsules-video" ref={timeCapsulesVideo}>
              <video
                src="/videos/mars-rock-nakhla.mp4"
                playsInline
                muted
                loop
                autoPlay
                type="video/mp4"
                aria-hidden="true">
              </video>
            </div>
            <div className="time-capsules__desc text--info">
              <div className="time-capsules__desc-1" ref={timeCapsulesDesc1}>
                <div className="time-capsules__desc-first">
                  <p>This specimen may look ordinary, but it has extraordinary origins. It is a particularly large Martian meteorite - one of less than 70 known. About 11 million years ago, a large asteroid or comet impact on Mars was powerful enough to throw material into space. Some of this material eventually landed on Earth as meteorites.</p>
                </div>
                <div className="time-capsules__desc-second" >
                  <p>We know it is from Mars as we can compare its chemistry to information collected by space probes that have been there. This one was actually seen falling to Earth in Egypt in 1911.</p>

                  <p>You can see the melted black fusion crust on the surface, which formed as it travelled through the Earth's atmosphere