import './TimeCapsules.scss';
import DOMPurify from "dompurify";
import {useState, useEffect, useRef} from "react";
// import gsap from "gsap";
import {gsap, ScrollTrigger, ScrollToPlugin, MotionPathPlugin} from "gsap/all";
import VideoModal from "../VideoModal/VideoModal.jsx";
import {useDecodeText} from "../../hooks/useDecodeText.js";
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);
export default function TimeCapsules({isLoaded, index = 0, lastTimeCapsule, toggleNav, item, items, handleActiveItem, className = '' }) {
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
  const timeCapsulesComp = useRef(null);
  const videoFall = useRef(null);

  const [isVideo, setIsVideo] = useState(false);
  const [timeCapsulesTitleActive, setTimeCapsulesTitleActive] = useState(false);

  const options = {
    iterations: 8,
    speed: 0.05,
    stagger: 0.1,
    blured: 5,
    changeDelay: 0.1,
    opacity: 0.9,
  };
  useDecodeText(timeCapsulesTitle, timeCapsulesTitleActive, options);

  const toggleVideo = (e)=>{
    setIsVideo(e);
  }

  useEffect(() => {
    const ctx = gsap.context(() => {

      if(item){
      if(index == 0) {
        gsap.set(timeCapsulesBg.current, {scale: 1})
      }

      gsap.set(timeCapsulesContainer.current, {opacity: 0 })
        gsap.set(timeCapsules.current, { opacity: 0})

      gsap.set(timeCapsulesTitle.current, {opacity: 0})
      gsap.set(timeCapsulesSpec.current, { opacity: 0, y: '150%'})

      gsap.set(timeCapsulesMeta.current, { opacity: 0})
      gsap.set(timeCapsulesHeading.current, { top: '50%'})
      gsap.set(timeCapsulesComp.current, { opacity: 0, y: '150%'})
      if(videoFall.current) {
        gsap.set(videoFall.current, {opacity: 0})
      }
      if (isLoaded) {

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: timeCapsules.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.5,
            onEnter: () => {handleActiveItem(index); toggleNav(true);

            },
            onEnterBack: () => {handleActiveItem(index); index == 0 && toggleNav(false)},
            onLeaveBack: () => handleActiveItem(index - 1 >= 0 ? index - 1 : 0)
          }
        });


          if(index == 0) {
            tl.set(timeCapsules.current, { opacity: 1})
            tl.to(timeCapsulesBg.current, {
              scale: 3,
              duration: 0.1,
              ease: 'power3.out'
            })
            tl.to(timeCapsulesContainer.current, {opacity: 1 })
          }



        // gsap.set('.time-capsules-bg', {scale: 5})
        const tl2 = gsap.timeline({
          scrollTrigger: {

            trigger: timeCapsules.current,
            start: 'top top',
            end: '+=400%',
            scrub: true,
            pin: true,
            pinSpacing: false,
            id: "TimeCapsules"+item.slug,
            anticipatePin: 1,


            onEnter: () => {
              toggleNav(true);
            },
            onLeaveBack: () =>  toggleNav(true),
            onLeave: () => {
              lastTimeCapsule && toggleNav(false)
              setTimeCapsulesTitleActive(false)
            }
          }
        });
        tl2.to(timeCapsules.current, { opacity: 1})
        tl2.set(timeCapsulesContainer.current, {opacity: 1 })
          .set(timeCapsulesTitle.current, {opacity: 1, onComplete: () => {setTimeCapsulesTitleActive(true)}}, '<')
          .to({}, {duration: 0.5})
          .to(timeCapsulesHeading.current, { top: "0%", ease: 'power3.out'}, )
          .to(timeCapsulesTitle.current, {scale: 1, ease: 'power3.out'}, "<")
          .to(timeCapsulesVideo.current, { scale: 1,  ease: 'power3.out'}, '<')
          .to(timeCapsulesMeta.current, {opacity: 1, duration: 0.2, ease: 'power3.out'})
          if(videoFall.current) {
            tl2.to(videoFall.current, {opacity: 1, duration: 0.2, ease: 'power3.out'}, "<")
          }
          tl2.to(timeCapsulesDesc1.current, { y: '-50%', opacity: 1,  ease: 'power3.out'}, '<')
          .to(timeCapsulesDesc1.current, { y: '-150%', opacity: 0,  ease: 'power3.out'})
          .to(timeCapsulesSpec.current, { y: '-50%', opacity: 1,  ease: 'power3.out'}, '<')
          .to(timeCapsulesSpec.current, { y: '-150%', opacity: 0,  ease: 'power3.out'})
          .to(timeCapsulesComp.current, { y: '-50%', opacity: 1,  ease: 'power3.out'}, '<')
          .to(timeCapsulesComp.current, { y: '-150%', opacity: 0,  ease: 'power3.out'})
          .to(timeCapsulesDesc2.current, { y: '-50%', opacity: 1,  ease: 'power3.out'},"<")
            if(index+1 !== items.length) {
              tl2.to(timeCapsulesVideo.current, {
                motionPath: {
                  path: [
                    {x: "0%", y: "0%"},
                    {x: "20%", y: "50%"},
                    {x: "50%", y: "50%"},
                    {x: "100%", y: "0%"}
                  ],
                  curviness: 1.5
                }, scale: 0.5, ease: 'power3.out'
              })
            }else{
              tl2.to(timeCapsulesVideo.current, {
               scale: 5
              })
            }
            if(index == 0){
              tl2.to(timeCapsulesContainer.current, {opacity: 0, ease: 'power3.out'}, '<')
            }else{
              tl2.to(timeCapsules.current, {opacity: 0, ease: 'power3.out'}, '<')
            }


          }
        }
     }, timeCapsules)

    return () => ctx.revert();
  }, [isLoaded])

  function formatDate(dateString) {
    // Check if dateString is in the format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateString || !dateRegex.test(dateString)) {
      return dateString; // Return original if not in expected format
    }

    const [year, month, day] = dateString.split('-');

    // Create a date object and format it
    const date = new Date(year, parseInt(month) - 1, day);

    // Format the date as "Month DD, YYYY"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  return (



    item && (
      <>
        <div className={`time-capsules ${index === 0 ? 'time-capsules-'+index : ''} ${className}`}
             ref={timeCapsules} id={item.slug}>
          {
            index === 0 && <div className="time-capsules-bg" ref={timeCapsulesBg}></div>
          }
          <div className="ia-container" ref={timeCapsulesContainer}>
            <div className="time-capsules__inner">
              <div className="time-capsules-heading" ref={timeCapsulesHeading}>
                <div className="time-capsules-title" ref={timeCapsulesTitle}>{item.title}</div>
                <div className="time-capsules-meta" ref={timeCapsulesMeta}>
                  <div>
                    <div className="p"><strong>Fall place: </strong></div>
                    <div className='p'>{item.fallPlace}</div>
                  </div>
                  <div>
                    <div className="p">
                      <strong>Fall date: </strong>
                    </div>
                    <div className="p">{item.fallDate}</div>
                  </div>
                  <div>
                    <div className="p"><strong>Age: </strong></div>
                    <div className="p" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.old)}} />
                  </div>
                </div>
              </div>

              <div className="time-capsules__container">
                <div className="time-capsules__spec text--info" >
                  <ul ref={timeCapsulesSpec} className="spec">
                    <li className="text-light p3">
                      <div className="p3 mb-0 text-medium">Type</div>
                      {item.type}
                    </li>
                    <li className="text-light p3">
                      <div className="p3 mb-0 text-medium">Class</div>
                      {item.class}
                    </li>
                    <li className="text-light p3">
                      <div className="p3 mb-0 text-medium">Observed fall</div>
                      {
                        item.observedFall ? 'Yes' : 'No'
                      }
                    </li>
                    <li className="text-light p3">
                      <div className="p3 mb-0 text-medium">Found date</div>
                      {formatDate(item.foundDate)}
                    </li>
                  </ul>

                  <div className="time-capsules__desc-2" ref={timeCapsulesDesc2}  dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.short)}} />

                </div>
                <div className="time-capsules-video" ref={timeCapsulesVideo}>
                  {
                    item.videoFall && item.videoFall.src && (
                      <button className="videoFall" ref={videoFall} onClick={()=>{toggleVideo(true)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                          <rect x="0.7" y="0.7" width="37.8" height="37.8" rx="18.9" stroke="url(#paint0_linear_1544_11116)" strokeWidth="1.4"/>
                          <path d="M15.9309 25.8867L15.8228 13.5082C15.813 12.3916 17.0503 11.7135 17.9863 12.3225L27.581 18.5658C28.431 19.1189 28.4292 20.3641 27.5777 20.9148L18.0911 27.05C17.1642 27.6495 15.9405 26.9905 15.9309 25.8867Z" fill="#C8C6FF"/>
                          <defs>
                            <linearGradient id="paint0_linear_1544_11116" x1="19.6" y1="-5.20625" x2="19.6" y2="14.0875" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#908EFF"/>
                              <stop offset="1" stopColor="#E1D7FF"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <span>Watch it falling</span>
                      </button>
                    )
                  }


                  <video
                    src={item.video}
                    playsInline
                    muted
                    loop
                    autoPlay
                    type="video/mp4"
                    aria-hidden="true">
                  </video>
                </div>

                <div className="time-capsules__desc text--info">
                  <div className="time-capsules__desc-1" ref={timeCapsulesDesc1} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.short)}} />

                  <ul ref={timeCapsulesComp} className="comp">
                    {
                      item.composition.map((composition, index) => {
                        return <li className="text-light p3" key={index}>{composition}</li>
                      })
                    }
                  </ul>

                </div>
              </div>
            </div>
          </div>
        </div>
        {item.videoFall && item.videoFall.src && (
          <VideoModal isVideo={isVideo} video={item.videoFall.src} description={item.videoFall.description} source={item.videoFall.source} toggleVideo={toggleVideo} />
        )}
      </>
    )




  )
}