"use client";

import Intro from "./components/Intro/Intro";
import Navigation from "./components/Navigation/Navigation";

import TimeCapsules from "./components/TimeCapsules/TimeCapsules";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Menu from "./components/Menu/Menu";
import Cursor from "./components/Cursor/Cursor";
import TypeMeteorites from "./components/TypeMeteorites/TypeMeteorites";
import Stardust from "./components/Stardust/Stardust";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress";
import Footer from "./components/Footer/Footer";
import type { Meteorite, MenuData } from "./types/content";

gsap.registerPlugin(ScrollTrigger);

interface AppProps {
  onComplete?: () => void;
}

function App({ onComplete }: AppProps) {
  const [items, setItems] = useState<Meteorite[]>([]);
  const [navActive, setNavActive] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<MenuData | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const handleBackToIntro = () => {
    // Scroll to top to ensure proper positioning
    window.scrollTo(0, 0);
  };

  const toggleAnimationComplete = () => {
    setAnimationComplete(!animationComplete);
  };

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (!animationComplete) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: false });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animationComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          onComplete?.();
          return 100;
        }
        return prev + 1;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    fetch("/data/menu.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data: MenuData) => {
        setMenuItems(data);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const handleActiveItem = (e: number | null) => {
    setActiveItem(e);
  };

  useEffect(() => {
    fetch("/data/meteorites.json")
      .then((response) => response.json())
      .then((data: Meteorite[]) => {
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

  const toggleNav = (e: boolean) => {
    setNavActive(e);
  };
  const formatProgress = (number: number) => {
    return number.toString().padStart(3, "0");
  };

  useEffect(() => {
    if (animationComplete) {
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollableHeight = docHeight - windowHeight;

        const scrollProgress =
          scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

        setProgress(Math.round(scrollProgress));
      };

      handleScroll();

      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [animationComplete]);

  return (
    <>
      <Cursor />
      <Menu list={menuItems} />

      <Intro
        progress={formatProgress(progress)}
        isLoaded={isLoaded}
        animationComplete={animationComplete}
        toggleAnimationComplete={toggleAnimationComplete}
        isJumping={isJumping}
        toggleNav={toggleNav}
      />

      {items && items.length > 0 && (
        <div id="time-capsules">
          <TimeCapsules
            className="time-capsule-0"
            key={`capsule-${items[0].slug || 0}`}
            isLoaded={animationComplete}
            index={0}
            item={items[0]}
            items={items}
            toggleNav={toggleNav}
            lastTimeCapsule={items[0] === items[items.length - 1]}
            handleActiveItem={handleActiveItem}
            activeItem={activeItem}
            isJumping={isJumping}
          />

          {items.length > 1 && (
            <div key="black-bg-container" style={{ background: "#000" }}>
              {items.slice(1).map((item, idx) => {
                const actualIndex = idx + 1;
                return (
                  <TimeCapsules
                    className={`time-capsule-${actualIndex}`}
                    key={`capsule-${item.slug || actualIndex}`}
                    isLoaded={animationComplete}
                    index={actualIndex}
                    item={item}
                    items={items}
                    activeItem={activeItem}
                    toggleNav={toggleNav}
                    lastTimeCapsule={item === items[items.length - 1]}
                    handleActiveItem={handleActiveItem}
                    isJumping={isJumping}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      <Footer isLoaded={animationComplete} />
      {activeItem !== null && activeItem > -1 && (
        <Navigation
          isLoaded={isLoaded}
          navActive={navActive}
          activeItem={activeItem}
          handleActiveItem={handleActiveItem}
          setIsJumping={setIsJumping}
        />
      )}
      <TypeMeteorites
        isLoaded={animationComplete}
        className="type-meteorites-section"
        isJumping={isJumping}
        toggleNav={toggleNav}
      />

      <Stardust
        isLoaded={animationComplete}
        onBackToIntro={handleBackToIntro}
        className="stardust-section"
      />

      {animationComplete && <ScrollProgress progress={progress} />}
    </>
  );
}

export default App;
