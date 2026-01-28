
import Intro from './components/Intro/Intro.jsx';
import Navigation from './components/Navigation/Navigation.jsx';
import './assets/styles/main.scss';

import TimeCapsules from "./components/TimeCapsules/TimeCapsules.jsx";
import {useEffect, useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Menu from "./components/Menu/Menu.jsx";

import MeteoriteTypes from "./components/TypeMeteorites/TypeMeteorites.jsx";
import TypeMeteorites from "./components/TypeMeteorites/TypeMeteorites.jsx";
import Stardust from "./components/Stardust/Stardust.jsx";

gsap.registerPlugin(ScrollTrigger);


function App({onComplete}) {
  const [items, setItems] = useState([])
  const [navActive, setNavActive] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const [menuItems, setMenuItems] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false);
  const [returningToIntro, setReturningToIntro] = useState(false);

  const handleBackToIntro = () => {
    setReturningToIntro(true);
    // setAnimationComplete(false);

    // Scroll to top to ensure proper positioning
    window.scrollTo(0, 0);
  };

  const toggleMenu = () => setIsOpenMenu(v => !v)
  const toggleAnimationComplete = () => {
    setAnimationComplete(!animationComplete);
  }

  useEffect(() => {
    const handleScroll = (e) => {
      if (!animationComplete) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: false });
    return () => window.removeEventListener('scroll', handleScroll, { passive: false });
  }, [animationComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoaded(true)
          onComplete?.()
          return 100
        }
        return prev + 1
      })
    }, 10)
    return () => clearInterval(interval)

  }, [onComplete])

  useEffect(() => {
    fetch('/data/menu.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data)=>{
        setMenuItems(data);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const handleActiveItem = (e)=>{
    setActiveItem(e);
  }

  useEffect(() => {
    fetch('/data/meteorites.json')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);

      });

  }, []);

  useEffect(() => {
    // Only set active item if we have items and no active item is selected yet
    if (items.length > 0 && activeItem === null) {
      setActiveItem(0);
    } else if (items.length === 0 && activeItem !== null) {
      // Reset active item if items array becomes empty
      setActiveItem(null);
    }
  }, [items, activeItem]);


  const toggleNav = (e)=>{
    setNavActive(e);
  }

  return (

    <>

      <Menu list={menuItems}  />

      <Intro progress={progress} isLoaded={isLoaded} animationComplete={animationComplete} toggleAnimationComplete={toggleAnimationComplete} />

      {items && items.length > 0 && (
        <>
          <TimeCapsules
            key={`capsule-${items[0].slug || 0}`}
            isLoaded={animationComplete}
            index={0}
            item={items[0]}
            items={items}
            toggleNav={toggleNav}
            lastTimeCapsule={items.length === 1}
            handleActiveItem={handleActiveItem}
          />

          {items.length > 1 && (
            <div key="black-bg-container" style={{background: '#000'}}>
              {items.slice(1).map((item, idx) => {
                const actualIndex = idx + 1;
                return (
                  <TimeCapsules
                    key={`capsule-${item.slug || actualIndex}`}
                    isLoaded={animationComplete}
                    index={actualIndex}
                    item={item}
                    items={items}
                    toggleNav={toggleNav}
                    lastTimeCapsule={actualIndex + 1 === items.length}
                    handleActiveItem={handleActiveItem}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      {
        activeItem > -1 && <Navigation isLoaded={isLoaded} navActive={navActive} activeItem={activeItem} />
      }

      <TypeMeteorites isLoaded={animationComplete} />





      <Stardust isLoaded={animationComplete} onBackToIntro={handleBackToIntro} />

    </>
  )
}

export default App
