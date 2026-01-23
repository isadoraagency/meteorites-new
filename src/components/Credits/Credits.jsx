import React, {useEffect, useState} from "react";
import DOMPurify from "dompurify";
import {AnimatePresence, motion} from 'framer-motion';
// import {useMediaQuery} from "react-responsive";
import './Credits.scss';
export default function Credits ({handleMenuItemClick, isOpen }){
  const [data, setData] = useState(null);
  // const isMobile = useMediaQuery({
  //   query: '(max-width: 812px)'
  // })

  useEffect(() => {
    fetch('/data/credits.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then(setData)
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{opacity: 0, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0, scale: 0}}
          transition={{duration: 0.5}}
          className="credits"
        >
          <div className="credits__close close" aria-label="close" onClick={()=>handleMenuItemClick('close')}><i></i></div>
          <div className="ia-container">
            <div className="credits__in">

              {
                data?.text && (
                  <div className="content-entry "
                       dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data.text)}}/>
                )
              }
              <svg className="mb-2" xmlns="http://www.w3.org/2000/svg" width="65" height="88" viewBox="0 0 65 88" fill="none">
                <g clipPath="url(#clip0_1598_1329)">
                  <path className="starPulse" d="M0.0904751 35.6171C25.8809 48.5472 26.9619 51.6856 14.3317 87.1771C14.2759 87.3305 14.5479 87.4421 14.6177 87.2956C30.3723 53.0804 33.3433 51.5879 60.8285 60.3544C61.0098 60.4102 61.0935 60.201 60.9261 60.1173C35.1356 47.1872 34.0546 44.0488 46.6849 8.55732C46.7407 8.40389 46.4687 8.2923 46.3989 8.43876C30.6443 42.654 27.6733 44.1465 0.188113 35.3869C0.00678514 35.3311 -0.0769048 35.5404 0.0904751 35.6241L0.0904751 35.6171Z" fill="url(#paint0_linear_1598_1329)"/>
                  <path className="starPulse"  d="M3.31973 9.73594C12.5396 14.3598 12.9231 15.4826 8.41087 28.1617C8.38994 28.2175 8.48758 28.2593 8.51548 28.2035C14.1506 15.9778 15.2107 15.4408 25.0303 18.5722C25.0931 18.5931 25.1279 18.5164 25.0652 18.4885C15.8453 13.8716 15.4548 12.7488 19.974 0.0697482C19.995 0.0139549 19.8973 -0.0278901 19.8694 0.0279032C14.2343 12.2536 13.1742 12.7906 3.3546 9.65922C3.29183 9.6383 3.25696 9.71502 3.31973 9.74291V9.73594Z" fill="url(#paint1_linear_1598_1329)"/>
                  <path className="starPulse"  d="M30.763 75.307C37.0886 78.4803 37.3536 79.2474 34.2571 87.9512C34.2431 87.986 34.3129 88.0139 34.3268 87.9791C38.1905 79.5892 38.9228 79.2195 45.6599 81.3676C45.7017 81.3815 45.7226 81.3327 45.6808 81.3118C39.3552 78.1385 39.0902 77.3714 42.1867 68.6676C42.2007 68.6327 42.1309 68.6048 42.117 68.6397C38.2533 77.0296 37.521 77.3993 30.784 75.2512C30.7421 75.2373 30.7212 75.2861 30.763 75.307Z" fill="url(#paint2_linear_1598_1329)"/>
                  <path className="starPulse"  d="M51.9017 41.4056C57.3974 44.1604 57.6275 44.8299 54.9355 52.3899C54.9215 52.4248 54.9843 52.4457 54.9982 52.4178C58.3528 45.1298 58.9875 44.809 64.8458 46.6781C64.8806 46.692 64.9016 46.6432 64.8667 46.6293C59.371 43.8745 59.1409 43.2049 61.8329 35.645C61.8469 35.6101 61.7841 35.5892 61.7702 35.6171C58.4156 42.9051 57.7809 43.2259 51.9226 41.3568C51.8878 41.3428 51.8668 41.3917 51.9017 41.4056Z" fill="url(#paint3_linear_1598_1329)"/>
                </g>
                <defs>
                  <linearGradient id="paint0_linear_1598_1329" x1="30.5083" y1="8.3703" x2="30.5083" y2="101.867" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F40FF"/>
                    <stop offset="1" stopColor="#000745"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_1598_1329" x1="14.1924" y1="0.0015564" x2="14.1924" y2="33.4124" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F40FF"/>
                    <stop offset="1" stopColor="#000745"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_1598_1329" x1="38.2219" y1="68.6237" x2="38.2219" y2="91.5516" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F40FF"/>
                    <stop offset="1" stopColor="#000745"/>
                  </linearGradient>
                  <linearGradient id="paint3_linear_1598_1329" x1="58.3842" y1="35.6041" x2="58.3842" y2="55.52" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F40FF"/>
                    <stop offset="1" stopColor="#000745"/>
                  </linearGradient>
                  <clipPath id="clip0_1598_1329">
                    <rect width="64.8806" height="88" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <p className="fz-6">This site was made of stardust by</p>
              <a href="https://isadoradigitalagency.com/" target="_blank" rel="noreferrer">
                <img src="/images/ida-logo.svg" alt="IDA Logo"/>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}