
import Intro from './components/Intro/Intro.jsx';
import Navigation from './components/Navigation/Navigation.jsx';
import './assets/styles/main.scss';

import TimeCapsules from "./components/TimeCapsules/TimeCapsules.jsx";
import {useEffect, useState} from "react";
import LenisProvider from "./LenisProvider";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Menu from "./components/Menu/Menu.jsx";

import MeteoriteTypes from "./components/TypeMeteorites/TypeMeteorites.jsx";
import TypeMeteorites from "./components/TypeMeteorites/TypeMeteorites.jsx";

gsap.registerPlugin(ScrollTrigger);


function App({onComplete}) {
  const [navActive, setNavActive] = useState(false)

  const [menuItems, setMenuItems] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false);

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



  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch('/data/meteorites.json')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      });

  }, []);


  const toggleNav = (e)=>{
    setNavActive(e);
  }

  return (

    <>

      <Menu list={menuItems}  />



      <Intro progress={progress} isLoaded={isLoaded} animationComplete={animationComplete} toggleAnimationComplete={toggleAnimationComplete}></Intro>


        {
          items && (() => {

            const firstItem = items[0];
            const components = [
              <TimeCapsules
                key={firstItem?.slug || 0}
                isLoaded={animationComplete}
                index={0}
                item={firstItem}
                items={items}
                toggleNav={toggleNav}
                lastTimeCapsule={items.length === 1}
              />
            ];


            if (items.length > 1) {
              components.push(
                <div key="black-bg-container" style={{background: '#000'}}>
                  {items.slice(1).map((item, idx) => {
                    const actualIndex = idx + 1;
                    return (
                      <TimeCapsules
                        key={item?.slug || actualIndex}
                        isLoaded={animationComplete}
                        index={actualIndex}
                        item={item}
                        items={items}
                        toggleNav={toggleNav}
                        lastTimeCapsule={actualIndex + 1 === items.length}
                      />
                    );
                  })}
                </div>
              );
            }

            return components;
          })()

        }


      <Navigation isLoaded={isLoaded} navActive={navActive}></Navigation>



      <TypeMeteorites isLoaded={animationComplete}></TypeMeteorites>


    </>
  )
}

export default App
