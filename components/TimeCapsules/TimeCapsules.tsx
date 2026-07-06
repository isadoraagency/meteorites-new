"use client";

import "./TimeCapsules.scss";
import { sanitizeHtml } from "../../lib/sanitizeHtml";
import { useState, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ScrollToPlugin, MotionPathPlugin } from "gsap/all";
import VideoModal from "../VideoModal/VideoModal";
import { useDecodeText } from "../../hooks/useDecodeText";
import type { Meteorite } from "../../types/content";

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);

interface TimeCapsulesProps {
  isLoaded: boolean;
  index?: number;
  lastTimeCapsule: boolean;
  toggleNav: (value: boolean) => void;
  item: Meteorite;
  items?: Meteorite[];
  activeItem: number | null;
  handleActiveItem: (index: number) => void;
  isJumping: boolean;
  className?: string;
}

export default function TimeCapsules({
  isLoaded,
  index = 0,
  lastTimeCapsule,
  toggleNav,
  item,
  activeItem,
  handleActiveItem,
  isJumping,
  className = "",
}: TimeCapsulesProps) {
  const timeCapsules = useRef<HTMLDivElement>(null);
  const timeCapsulesContainer = useRef<HTMLDivElement>(null);
  const timeCapsulesBg = useRef<HTMLDivElement>(null);
  const timeCapsulesHeading = useRef<HTMLDivElement>(null);
  const timeCapsulesTitle = useRef<HTMLDivElement>(null);
  const timeCapsulesMeta = useRef<HTMLDivElement>(null);
  const timeCapsulesVideo = useRef<HTMLDivElement>(null);
  const timeCapsulesVideoBG = useRef<HTMLDivElement>(null);
  const timeCapsulesDesc2 = useRef<HTMLDivElement>(null);
  const timeCapsulesDesc1 = useRef<HTMLDivElement>(null);
  const timeCapsulesSpec = useRef<HTMLUListElement>(null);
  const timeCapsulesComp = useRef<HTMLDivElement>(null);
  const timeCapsulesReadMore = useRef<HTMLDivElement>(null);

  const videoFall = useRef<HTMLButtonElement>(null);

  const [isVideo, setIsVideo] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [timeCapsulesTitleActive, setTimeCapsulesTitleActive] = useState(false);

  const options = {
    iterations: 8,
    speed: 0.05,
    stagger: 0.1,
    blured: 5,
    changeDelay: 0.1,
    opacity: 0,
  };
  useDecodeText(timeCapsulesTitle, timeCapsulesTitleActive, options);

  const toggleVideo = (e: boolean) => {
    setIsVideo(e);
  };

  const toggleRead = () => {
    setIsRead(!isRead);
  };

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isMobile } = context.conditions as Record<string, boolean>;

          if (item) {
            if (index == 0) {
              gsap.set(timeCapsulesBg.current, { scale: 1 });
            }

            gsap.set(timeCapsulesContainer.current, { opacity: 0 });
            gsap.set(timeCapsules.current, { opacity: 0 });

            gsap.set(timeCapsulesTitle.current, {
              opacity: 1,
              scale: isMobile ? 1.2 : 3,
            });
            gsap.set(timeCapsulesSpec.current, { opacity: 0, y: "150%" });

            gsap.set(timeCapsulesMeta.current, { opacity: 0 });
            gsap.set(timeCapsulesHeading.current, { top: "50%", y: "-50%" });
            gsap.set(timeCapsulesComp.current, { opacity: 0, y: "150%" });

            if (isMobile) {
              gsap.set(".time-capsules__container", { top: "50%", y: "-50%" });
            }

            if (videoFall.current) {
              gsap.set(videoFall.current, { opacity: 0 });
            }
            if (isLoaded) {
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: timeCapsules.current,
                  start: "top center",
                  end: "top top",
                  scrub: 1,
                  snap: isJumping
                    ? undefined
                    : {
                        snapTo: "labelsDirectional",
                        duration: { min: 0.3, max: 0.5 },
                        ease: "power2.out",
                      },
                  onEnter: () => {
                    if (!isJumping) {
                      toggleNav(true);
                    }
                  },
                },
              });

              if (index == 0) {
                tl.set(timeCapsules.current, { opacity: 1 });
                tl.to(timeCapsulesBg.current, {
                  scale: 5,
                  duration: 0.1,
                  ease: "power3.out",
                });
              }

              const tl2 = gsap.timeline({
                scrollTrigger: {
                  trigger: timeCapsules.current,
                  start: "top top",
                  end: "+=10000",
                  scrub: 1,
                  pin: true,
                  pinSpacing: false,
                  id: "TimeCapsules" + item.slug,
                  anticipatePin: 1,
                  snap: isJumping
                    ? undefined
                    : {
                        snapTo: "labelsDirectional",
                        duration: { min: 0.3, max: 2 },
                        ease: "power2.out",
                      },
                  onEnter: () => {
                    if (!isJumping) {
                      toggleNav(true);
                    }
                  },
                  onUpdate: (self) => {
                    if (!isJumping && self.isActive) {
                      if (
                        self.direction === -1 &&
                        self.progress < 0.98 &&
                        activeItem !== index
                      ) {
                        handleActiveItem(index);
                      } else if (
                        self.direction === 1 &&
                        self.progress > 0.02 &&
                        activeItem !== index
                      ) {
                        handleActiveItem(index);
                      }
                    }
                  },
                  onEnterBack: () => {
                    if (!isJumping) {
                      toggleNav(true);
                      handleActiveItem(index);
                    }
                  },
                  onLeaveBack: () => {
                    if (!isJumping && index === 0) {
                      toggleNav(false);
                    }
                  },
                  onLeave: () => {
                    if (!isJumping && lastTimeCapsule) {
                      toggleNav(false);
                    }
                  },
                },
              });
              tl2.addLabel("timecapsules-1");
              tl2.set(timeCapsulesContainer.current, { opacity: 1 });

              if (index !== 0) {
                tl2.to(timeCapsules.current, { opacity: 1, duration: 0.02 });
              } else {
                tl2.set(timeCapsules.current, { opacity: 1 });
              }
              tl2
                .set(
                  timeCapsulesTitle.current,
                  {
                    opacity: 1,
                    onComplete: () => {
                      if (!isJumping) setTimeCapsulesTitleActive(true);
                    },
                    onReverseComplete: () => {
                      if (!isJumping) setTimeCapsulesTitleActive(true);
                    },
                  },
                  "<"
                )

                .addLabel("timecapsules-2")
                .to(timeCapsulesHeading.current, { top: "0%", y: "0%", ease: "power3.out" })
                .to(timeCapsulesTitle.current, { scale: 1, ease: "power3.out" }, "<")
                .to(timeCapsulesVideoBG.current, { opacity: 0, ease: "power3.out" }, "<")
                .to(timeCapsulesVideo.current, { scale: 1, ease: "power3.out" }, "<")
                .to(timeCapsulesMeta.current, {
                  opacity: 1,
                  duration: 0.2,
                  ease: "power3.out",
                });
              if (videoFall.current) {
                tl2.to(
                  videoFall.current,
                  { opacity: 1, duration: 0.2, ease: "power3.out" },
                  "<"
                );
              }

              if (!isMobile) {
                tl2.to(
                  timeCapsulesDesc1.current,
                  { y: "-50%", opacity: 1, ease: "power3.out" },
                  "<"
                );
              }

              if (isMobile) {
                tl2.addLabel("timecapsules-3-0");
                tl2.to(timeCapsulesDesc1.current, {
                  y: "-50%",
                  opacity: 1,
                  ease: "power3.out",
                });
                tl2
                  .to(
                    timeCapsulesMeta.current,
                    { opacity: 0, duration: 0.2, ease: "power3.out" },
                    "<"
                  )
                  .to(".time-capsules__container", { top: "150px", y: "0%", ease: "power3.out" }, "<");
              }
              tl2.addLabel("timecapsules-3");
              tl2
                .to(timeCapsulesDesc1.current, { y: "-650%", opacity: 0, ease: "power3.out" })
                .to(timeCapsulesDesc2.current, { y: "0%", opacity: 1, ease: "power3.out" }, "<")

                .addLabel("timecapsules-4")

                .to(timeCapsulesDesc2.current, { y: "-150%", opacity: 0, ease: "power3.out" })
                .to(timeCapsulesSpec.current, { y: "-50%", opacity: 1, ease: "power3.out" }, "<")

                .addLabel("timecapsules-5")
                .to(timeCapsulesSpec.current, { y: "-150%", opacity: 0, ease: "power3.out" })
                .to(timeCapsulesComp.current, { y: "-50%", opacity: 1, ease: "power3.out" }, "<")

                .addLabel("timecapsules-6");

              if (videoFall.current) {
                tl2.set(videoFall.current, { opacity: 0 });
              }
              tl2.to(timeCapsulesVideo.current, {
                scale: 5,
              });
              if (index == 0) {
                tl2.to(timeCapsulesContainer.current, { opacity: 0, ease: "power3.out" }, "<");
              } else {
                tl2.to(timeCapsules.current, { opacity: 0, ease: "power3.out" }, "<");
              }
              tl2.addLabel("timecapsules-7");
            }
          }
        }
      );
    }, timeCapsules);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [isLoaded]);

  function formatDate(dateString: string) {
    // Check if dateString is in the format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateString || !dateRegex.test(dateString)) {
      return dateString; // Return original if not in expected format
    }

    const [year, month, day] = dateString.split("-");

    // Create a date object and format it
    const date = new Date(Number(year), parseInt(month) - 1, Number(day));

    // Format the date as "Month DD, YYYY"
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    item && (
      <>
        <div
          className={`time-capsules ${index === 0 ? "time-capsules-" + index : ""} ${className}`}
          ref={timeCapsules}
          id={item.slug}
        >
          {index === 0 && <div className="time-capsules-bg" ref={timeCapsulesBg}></div>}
          <div className="ia-container" ref={timeCapsulesContainer}>
            <div className="time-capsules__inner">
              <div className="time-capsules-heading" ref={timeCapsulesHeading}>
                <div className="time-capsules-title" ref={timeCapsulesTitle}>
                  {item.title}
                </div>
                <div className="time-capsules-meta" ref={timeCapsulesMeta}>
                  <div>
                    <div className="p">
                      <strong>Fall place:</strong>&nbsp;
                    </div>
                    <div className="p"> {item.fallPlace}</div>
                  </div>
                  <div>
                    <div className="p">
                      <strong>Fall date:</strong>&nbsp;
                    </div>
                    <div className="p">{item.fallDate}</div>
                  </div>
                  <div>
                    <div className="p">
                      <strong>Age:</strong>&nbsp;
                    </div>
                    <div
                      className="p"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.old) }}
                    />
                  </div>
                </div>
              </div>

              <div className="time-capsules__container">
                <div className="time-capsules__spec text--info">
                  <ul ref={timeCapsulesSpec} className="spec">
                    <li className="text-light p2">
                      <div className="p2 mb-0 text-bold">Type</div>
                      {item.type}
                    </li>
                    <li className="text-light p2">
                      <div className="p2 mb-0 text-bold">Class</div>
                      {item.class}
                    </li>
                    <li className="text-light p2">
                      <div className="p2 mb-0 text-bold">Observed fall</div>
                      {item.observedFall ? "Yes" : "No"}
                    </li>
                    <li className="text-light p2">
                      <div className="p2 mb-0 text-bold">Found date</div>
                      {formatDate(item.foundDate)}
                    </li>
                  </ul>
                </div>
                <div className="time-capsules-video" ref={timeCapsulesVideo}>
                  {item.videoFall && item.videoFall.src && (
                    <button
                      className="videoFall"
                      ref={videoFall}
                      onClick={() => {
                        toggleVideo(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                      >
                        <rect
                          x="0.7"
                          y="0.7"
                          width="37.8"
                          height="37.8"
                          rx="18.9"
                          stroke="url(#paint0_linear_1544_11116)"
                          strokeWidth="1.4"
                        />
                        <path
                          d="M15.9309 25.8867L15.8228 13.5082C15.813 12.3916 17.0503 11.7135 17.9863 12.3225L27.581 18.5658C28.431 19.1189 28.4292 20.3641 27.5777 20.9148L18.0911 27.05C17.1642 27.6495 15.9405 26.9905 15.9309 25.8867Z"
                          fill="#C8C6FF"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_1544_11116"
                            x1="19.6"
                            y1="-5.20625"
                            x2="19.6"
                            y2="14.0875"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#908EFF" />
                            <stop offset="1" stopColor="#E1D7FF" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span>Watch it falling</span>
                    </button>
                  )}

                  <video playsInline muted loop autoPlay>
                    <source src={item.video} type="video/mp4" />
                  </video>
                  <div className="time-capsules-video__after" ref={timeCapsulesVideoBG}></div>
                </div>

                <div className="time-capsules__desc text--info">
                  <div className="time-capsules__desc-1" ref={timeCapsulesDesc1}>
                    <div
                      className={`${isRead ? "active" : ""} time-capsules__read`}
                      ref={timeCapsulesReadMore}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.about) }}
                    />
                    <button className="time-capsules__read-more" onClick={toggleRead}>
                      Read {isRead ? "less" : "more"}
                    </button>
                  </div>

                  <div className="time-capsules__desc-2" ref={timeCapsulesDesc2}>
                    <div className="meteorite-capsule__line">
                      <div className="meteorite-capsule__line-cut">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="230"
                          height="139"
                          viewBox="0 0 230 139"
                          fill="none"
                        >
                          <path
                            d="M49.4982 3V2.5H49.1466L49.0277 2.83095L49.4982 3ZM224.333 3C224.333 4.47276 225.527 5.66667 227 5.66667C228.473 5.66667 229.667 4.47276 229.667 3C229.667 1.52724 228.473 0.333333 227 0.333333C225.527 0.333333 224.333 1.52724 224.333 3ZM1.47056 138.169L49.9688 3.16905L49.0277 2.83095L0.529443 137.831L1.47056 138.169ZM49.4982 3.5H227V2.5H49.4982V3.5Z"
                            fill="#C8C6FF"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.short) }}
                    ></div>
                  </div>
                  <div className="time-capsules__composite" ref={timeCapsulesComp}>
                    <div className="time-capsules__composite-title p1 text-bold mb-1">
                      Composition
                    </div>
                    <ul className="comp">
                      {item.composition.map((composition, i) => (
                        <li className="text-light p2" key={i}>
                          {composition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {item.videoFall && item.videoFall.src && (
          <VideoModal
            isVideo={isVideo}
            video={item.videoFall.src}
            description={item.videoFall.description}
            source={item.videoFall.source}
            toggleVideo={toggleVideo}
          />
        )}
      </>
    )
  );
}
