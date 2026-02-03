import './About.scss'
import {AnimatePresence, motion} from "framer-motion";
import DOMPurify from "dompurify";
import React, {useEffect, useState} from "react";
export default function About({isOpen, handleMenuItemClick}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/about.json')
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
    <AnimatePresence >
      {isOpen && (
        <motion.div
          className="about"
          initial={{opacity: 0, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0, scale: 0}}
          transition={{duration: 0.5}}
        >
          <div className="about__close close" aria-label="close" onClick={()=>handleMenuItemClick('close')}><i></i></div>
          <div className="ia-container">
            <div className="about__in">
              <img className="mb-3" width='182' src='/images/ida-logo.svg' alt='IDA Logo' />
              {
                data?.text && (
                  <motion.div
                    initial={{opacity: 0, filter: 'blur(5px)', y: '50px'}}
                    animate={{opacity: 1, filter: 'blur(0)', y: 0}}
                    exit={{opacity: 0, scale: 0}}
                    transition={{duration: 0.5, delay: 0.5}}
                    className="content-entry "
                    dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data.text)}}/>
                )
              }
              <motion.div
                initial={{opacity: 0, filter: 'blur(5px)', y: '50px'}}
                animate={{opacity: 1, filter: 'blur(0)', y: 0}}
                exit={{opacity: 0, scale: 0}}
                transition={{duration: 0.5, delay: 0.7}}
              >
              <svg className="mb-2" xmlns="http://www.w3.org/2000/svg" width="56" height="76" viewBox="0 0 56 76" fill="none">
                <path className="starPulse" d="M10.8452 35.259C23.7792 41.7409 24.3213 43.3142 17.9872 61.1063C17.9592 61.1832 18.0956 61.2391 18.1306 61.1657C26.0316 44.0134 27.5216 43.2652 41.3055 47.6599C41.3964 47.6879 41.4384 47.583 41.3544 47.5411C28.4204 41.0591 27.8783 39.4858 34.2124 21.6938C34.2404 21.6168 34.104 21.5609 34.069 21.6343C26.168 38.7866 24.678 39.5348 10.8941 35.1436C10.8032 35.1156 10.7612 35.2205 10.8452 35.2625V35.259Z" fill="url(#paint0_linear_1605_3916)"/>
                <path className="starPulse" d="M6.61691 9.76575C11.4357 12.1245 11.6362 12.6973 9.27783 19.1652C9.26689 19.1937 9.31792 19.215 9.3325 19.1865C12.2777 12.9499 12.8318 12.676 17.9641 14.2734C17.9969 14.284 18.0151 14.2449 17.9823 14.2307C13.1635 11.8755 12.9594 11.3027 15.3214 4.83477C15.3323 4.80631 15.2813 4.78497 15.2667 4.81343C12.3215 11.0501 11.7674 11.324 6.63514 9.72662C6.60233 9.71594 6.58411 9.75508 6.61691 9.76931V9.76575Z" fill="url(#paint1_linear_1605_3916)"/>
                <path className="starPulse" d="M28.7158 65.5261C32.2425 67.2953 32.3902 67.723 30.6639 72.5755C30.6561 72.5949 30.695 72.6105 30.7027 72.5911C32.8568 67.9135 33.2651 67.7074 37.0212 68.905C37.0445 68.9128 37.0561 68.8855 37.0328 68.8739C33.5062 67.1047 33.3584 66.677 35.0848 61.8245C35.0926 61.805 35.0537 61.7895 35.0459 61.8089C32.8918 66.4865 32.4836 66.6926 28.7275 65.495C28.7042 65.4872 28.6925 65.5144 28.7158 65.5261Z" fill="url(#paint2_linear_1605_3916)"/>
                <path className="starPulse" d="M47.4087 36.8893C49.9562 38.1663 50.0629 38.4766 48.815 41.9811C48.8085 41.9973 48.8376 42.007 48.8441 41.994C50.3991 38.6157 50.6933 38.4669 53.4089 39.3334C53.4251 39.3398 53.4348 39.3172 53.4186 39.3107C50.8711 38.0337 50.7644 37.7234 52.0123 34.2189C52.0188 34.2028 51.9897 34.1931 51.9832 34.206C50.4282 37.5844 50.134 37.7331 47.4184 36.8667C47.4022 36.8602 47.3925 36.8828 47.4087 36.8893Z" fill="url(#paint3_linear_1605_3916)"/>
                <defs>
                  <linearGradient id="paint0_linear_1605_3916" x1="26.0998" y1="21.6" x2="26.0998" y2="68.4703" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F40FF"/>
                    <stop offset="1" stopColor="#000745"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_1605_3916" x1="12.2996" y1="4.79999" x2="12.2996" y2="21.8437" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F40FF"/>
                    <stop offset="1" stopColor="#000745"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_1605_3916" x1="32.8743" y1="61.8" x2="32.8743" y2="74.5828" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F40FF"/>
                    <stop offset="1" stopColor="#000745"/>
                  </linearGradient>
                  <linearGradient id="paint3_linear_1605_3916" x1="50.4137" y1="34.2" x2="50.4137" y2="43.432" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F40FF"/>
                    <stop offset="1" stopColor="#000745"/>
                  </linearGradient>
                </defs>
              </svg>
              </motion.div>
              <motion.div
                initial={{opacity: 0, filter: 'blur(5px)', y: '50px'}}
                animate={{opacity: 1, filter: 'blur(0)', y: 0}}
                exit={{opacity: 0, scale: 0}}
                transition={{duration: 0.5, delay: 0.9}}
              >
                <a href="https://isadoradigitalagency.com/" target="_blank" rel="noreferrer" className="ia-btn">
                  Let’s Talk!
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}