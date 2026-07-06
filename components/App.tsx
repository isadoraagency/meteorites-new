"use client";

import Intro from "./Intro/Intro";
import Navigation from "./Navigation/Navigation";

import TimeCapsules from "./TimeCapsules/TimeCapsules";
import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Menu from "./Menu/Menu";
import Cursor from "./Cursor/Cursor";
import TypeMeteorites from "./TypeMeteorites/TypeMeteorites";
import Stardust from "./Stardust/Stardust";
import ScrollProgress from "./ScrollProgress/ScrollProgress";
import Footer from "./Footer/Footer";
import type { MenuData } from "../types/content";
import type { StoryblokStory } from "../types/storyblok";
import SiteTheme from "./SiteTheme/SiteTheme";
import { getHeroBlock, getMeteoritesFromStory, getStardustSectionFromStory, getTypeMeteoritesSectionFromStory } from "../lib/storyblok-utils";
import { useStoryblokState } from "@storyblok/react";

gsap.registerPlugin(ScrollTrigger);

interface AppProps {
  menu: MenuData;
  // Full story payload from the Storyblok CDN — typed loosely until all blocks are mapped.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialStory?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialGlobalConfig?: any;
  onComplete?: () => void;
}

function App({ menu, initialStory, initialGlobalConfig, onComplete }: AppProps) {
  const story = useStoryblokState(initialStory ?? null) as StoryblokStory | null;
  const hero = getHeroBlock(story);
  const items = useMemo(() => getMeteoritesFromStory(story), [story]);
  const typeMeteoritesSection = useMemo(
    () => getTypeMeteoritesSectionFromStory(story),
    [story]
  );
  const stardustSection = useMemo(
    () => getStardustSectionFromStory(story),
    [story]
  );
  const [navActive, setNavActive] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);
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

  const handleActiveItem = (e: number | null) => {
    setActiveItem(e);
  };

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
      <SiteTheme initialConfig={initialGlobalConfig} />
      <Cursor />
      <Menu list={menu} />

      <Intro
        hero={hero}
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
          items={items}
          isLoaded={isLoaded}
          navActive={navActive}
          activeItem={activeItem}
          handleActiveItem={handleActiveItem}
          setIsJumping={setIsJumping}
        />
      )}
      {typeMeteoritesSection && (
        <TypeMeteorites
          isLoaded={animationComplete}
          className="type-meteorites-section"
          isJumping={isJumping}
          toggleNav={toggleNav}
          title={typeMeteoritesSection.title}
          description={typeMeteoritesSection.description}
          items={typeMeteoritesSection.items}
        />
      )}

      {stardustSection && (
        <Stardust
          isLoaded={animationComplete}
          onBackToIntro={handleBackToIntro}
          className="stardust-section"
          quote={stardustSection.quote}
          quoteAttribution={stardustSection.quoteAttribution}
          creatorsIntro={stardustSection.creatorsIntro}
          creators={stardustSection.creators}
          buttonLabel={stardustSection.buttonLabel}
        />
      )}

      {animationComplete && <ScrollProgress progress={progress} />}
    </>
  );
}

export default App;
