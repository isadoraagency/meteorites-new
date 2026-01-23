import { AnimatePresence, motion} from 'framer-motion'
import './Menu.scss'

import {useState} from "react";
import Sources from "../Sources/Sources.jsx";
import Credits from "../Credits/Credits.jsx";
import About from "../About/About.jsx";

export default function Menu({ list }) {
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const toggleMenu = () => setIsOpenMenu(v => !v)

  const [activeModal, setActiveModal] = useState('close');

  const handleMenuItemClick = (action) => {

    if (action !== 'close') {
      setActiveModal(action);
    }else{
      setActiveModal("close");
    }



    alert(activeModal)
  };

  return (
    <div className="menu-container">
      <button
        className={isOpenMenu ? 'menu-button menu-button--open' : 'menu-button'}
        onClick={toggleMenu}
        aria-label="menu button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="76" viewBox="0 0 56 76" fill="none">
          <path className="starPulse" d="M10.8452 35.259C23.7792 41.7409 24.3213 43.3142 17.9872 61.1063C17.9592 61.1832 18.0956 61.2391 18.1306 61.1657C26.0316 44.0134 27.5216 43.2652 41.3055 47.6599C41.3964 47.6879 41.4384 47.583 41.3544 47.541C28.4204 41.0591 27.8783 39.4858 34.2124 21.6938C34.2404 21.6168 34.104 21.5609 34.069 21.6343C26.168 38.7866 24.678 39.5348 10.8941 35.1436C10.8032 35.1156 10.7612 35.2205 10.8452 35.2624V35.259Z" fill="url(#paint0_linear_1544_10384)"/>
          <path className="starPulse" d="M6.6174 9.76576C11.4362 12.1245 11.6367 12.6973 9.27832 19.1652C9.26738 19.1937 9.31841 19.215 9.33299 19.1866C12.2782 12.9499 12.8323 12.676 17.9646 14.2734C17.9974 14.284 18.0156 14.2449 17.9828 14.2307C13.164 11.8755 12.9599 11.3027 15.3219 4.83479C15.3328 4.80632 15.2818 4.78498 15.2672 4.81344C12.322 11.0501 11.7679 11.324 6.63563 9.72663C6.60282 9.71596 6.58459 9.75509 6.6174 9.76932V9.76576Z" fill="url(#paint1_linear_1544_10384)"/>
          <path className="starPulse" d="M28.7163 65.5261C32.243 67.2953 32.3907 67.723 30.6643 72.5755C30.6566 72.595 30.6955 72.6105 30.7032 72.5911C32.8573 67.9135 33.2656 67.7074 37.0216 68.905C37.045 68.9128 37.0566 68.8856 37.0333 68.8739C33.5067 67.1047 33.3589 66.677 35.0853 61.8245C35.0931 61.805 35.0542 61.7895 35.0464 61.8089C32.8923 66.4865 32.484 66.6926 28.728 65.495C28.7047 65.4872 28.693 65.5144 28.7163 65.5261Z" fill="url(#paint2_linear_1544_10384)"/>
          <path className="starPulse" d="M47.4082 36.8893C49.9557 38.1663 50.0624 38.4766 48.8145 41.9811C48.808 41.9972 48.8371 42.0069 48.8436 41.994C50.3986 38.6156 50.6928 38.4669 53.4084 39.3333C53.4246 39.3398 53.4343 39.3172 53.4181 39.3107C50.8706 38.0337 50.7639 37.7234 52.0118 34.2189C52.0183 34.2028 51.9892 34.1931 51.9827 34.206C50.4277 37.5844 50.1335 37.7331 47.4179 36.8667C47.4017 36.8602 47.392 36.8828 47.4082 36.8893Z" fill="url(#paint3_linear_1544_10384)"/>
          <defs>
            <linearGradient id="paint0_linear_1544_10384" x1="26.0998" y1="21.6" x2="26.0998" y2="68.4703" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F40FF"/>
              <stop offset="1" stopColor="#000745"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1544_10384" x1="12.3001" y1="4.8" x2="12.3001" y2="21.8438" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F40FF"/>
              <stop offset="1" stopColor="#000745"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1544_10384" x1="32.8748" y1="61.8" x2="32.8748" y2="74.5828" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F40FF"/>
              <stop offset="1" stopColor="#000745"/>
            </linearGradient>
            <linearGradient id="paint3_linear_1544_10384" x1="50.4132" y1="34.2" x2="50.4132" y2="43.432" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F40FF"/>
              <stop offset="1" stopColor="#000745"/>
            </linearGradient>
          </defs>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20.5097 20.839L12.378 28.9707L11.3173 27.91L19.449 19.7783L11.3173 11.6466L12.378 10.5859L20.5097 18.7177L28.2879 10.9395L29.3485 12.0001L21.5704 19.7783L29.3485 27.5565L28.2879 28.6172L20.5097 20.839Z" fill="url(#paint0_linear_1544_10233)"/>
          <defs>
            <linearGradient id="paint0_linear_1544_10233" x1="28.6414" y1="28.2636" x2="8.55518" y2="8.17735" gradientUnits="userSpaceOnUse">
              <stop stopColor="#000D84"/>
              <stop offset="1" stopColor="#4F40FF"/>
            </linearGradient>
          </defs>
        </svg>
      </button>
      <AnimatePresence >
        {isOpenMenu && (
          <motion.div
            key="menu-root"
          >
          <motion.div
              key="overlay"
              className="main-menu-overlay"
              initial={{
                width: '6.4rem',
                height: '6.4rem',
                borderRadius: '64rem 64rem 64rem 0',
                opacity: 0,
                left: 0,
                bottom: 0,
              }}
              animate={{
                width: '100vw',
                height: '100vh',
                borderRadius: 0,
                opacity: 1,
              }}
              exit={{
                width: '6.4rem',
                height: '6.4rem',
                borderRadius: '64rem 64rem 64rem 0',
                opacity: 0,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            ></motion.div>
            <motion.div
              key="menu"
              className="main-menu"
              initial={{ x: '50%', y: '50%', opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ x: '50%', y: '50%', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            >
              <div className="ia-container">
                <div className="main-menu__in text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="76" viewBox="0 0 56 76" fill="none">
                    <path className="starPulse" d="M10.8452 35.259C23.7792 41.7409 24.3213 43.3142 17.9872 61.1063C17.9592 61.1832 18.0956 61.2391 18.1306 61.1657C26.0316 44.0134 27.5216 43.2652 41.3055 47.6599C41.3964 47.6879 41.4384 47.583 41.3544 47.541C28.4204 41.0591 27.8783 39.4858 34.2124 21.6938C34.2404 21.6168 34.104 21.5609 34.069 21.6343C26.168 38.7866 24.678 39.5348 10.8941 35.1436C10.8032 35.1156 10.7612 35.2205 10.8452 35.2624V35.259Z" fill="url(#paint0_linear_1544_10384)"/>
                    <path className="starPulse" d="M6.6174 9.76576C11.4362 12.1245 11.6367 12.6973 9.27832 19.1652C9.26738 19.1937 9.31841 19.215 9.33299 19.1866C12.2782 12.9499 12.8323 12.676 17.9646 14.2734C17.9974 14.284 18.0156 14.2449 17.9828 14.2307C13.164 11.8755 12.9599 11.3027 15.3219 4.83479C15.3328 4.80632 15.2818 4.78498 15.2672 4.81344C12.322 11.0501 11.7679 11.324 6.63563 9.72663C6.60282 9.71596 6.58459 9.75509 6.6174 9.76932V9.76576Z" fill="url(#paint1_linear_1544_10384)"/>
                    <path className="starPulse" d="M28.7163 65.5261C32.243 67.2953 32.3907 67.723 30.6643 72.5755C30.6566 72.595 30.6955 72.6105 30.7032 72.5911C32.8573 67.9135 33.2656 67.7074 37.0216 68.905C37.045 68.9128 37.0566 68.8856 37.0333 68.8739C33.5067 67.1047 33.3589 66.677 35.0853 61.8245C35.0931 61.805 35.0542 61.7895 35.0464 61.8089C32.8923 66.4865 32.484 66.6926 28.728 65.495C28.7047 65.4872 28.693 65.5144 28.7163 65.5261Z" fill="url(#paint2_linear_1544_10384)"/>
                    <path className="starPulse" d="M47.4082 36.8893C49.9557 38.1663 50.0624 38.4766 48.8145 41.9811C48.808 41.9972 48.8371 42.0069 48.8436 41.994C50.3986 38.6156 50.6928 38.4669 53.4084 39.3333C53.4246 39.3398 53.4343 39.3172 53.4181 39.3107C50.8706 38.0337 50.7639 37.7234 52.0118 34.2189C52.0183 34.2028 51.9892 34.1931 51.9827 34.206C50.4277 37.5844 50.1335 37.7331 47.4179 36.8667C47.4017 36.8602 47.392 36.8828 47.4082 36.8893Z" fill="url(#paint3_linear_1544_10384)"/>
                    <defs>
                      <linearGradient id="paint0_linear_1544_10384" x1="26.0998" y1="21.6" x2="26.0998" y2="68.4703" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F40FF"/>
                        <stop offset="1" stopColor="#000745"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_1544_10384" x1="12.3001" y1="4.8" x2="12.3001" y2="21.8438" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F40FF"/>
                        <stop offset="1" stopColor="#000745"/>
                      </linearGradient>
                      <linearGradient id="paint2_linear_1544_10384" x1="32.8748" y1="61.8" x2="32.8748" y2="74.5828" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F40FF"/>
                        <stop offset="1" stopColor="#000745"/>
                      </linearGradient>
                      <linearGradient id="paint3_linear_1544_10384" x1="50.4132" y1="34.2" x2="50.4132" y2="43.432" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F40FF"/>
                        <stop offset="1" stopColor="#000745"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  {list && (
                    <div>
                      <ul className="main-menu__top">
                        {list[0].large.map((item, i) => (
                          <li className="h5" key={`large-item-${i}`}>
                            <button>{item.title}</button>
                          </li>
                        ))}
                      </ul>

                      <ul className="main-menu__bottom">
                        {list[0].small.map((item, i) => (
                          <li className="p1" key={`small-item-${i}`}>
                            <button onClick={()=>handleMenuItemClick(item.action)}>{item.title}</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="main-menu__side p2 mb-0">
                    This site was made of stardust at{' '}
                    <a
                      href="https://isadoradigitalagency.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="/images/ida-logo.svg"
                        alt="Isadora Digital Agency"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        <Sources key="sources-modal"
                  isOpen={ activeModal === 'openSources'} handleMenuItemClick={handleMenuItemClick}/>
        <Credits key="credits-modal"
                 isOpen={ activeModal === 'openCredits' ? true : false} handleMenuItemClick={handleMenuItemClick}/>
        <About key="about-modal"
                isOpen={ activeModal === 'openAbout'} handleMenuItemClick={handleMenuItemClick}/>

      </AnimatePresence>
    </div>
  )
}