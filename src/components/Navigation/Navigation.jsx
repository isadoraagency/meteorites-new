import {useState, useEffect} from "react";
import './Navigation.scss';
import {gsap, ScrollToPlugin, ScrollTrigger} from 'gsap/all';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
export default function Navigation ({navActive, activeItem, handleActiveItem, setIsJumping}){
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('/data/meteorites.json')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      });

  }, []);

  const moveToItem = (e, el) => {
    e.preventDefault();
    const st = ScrollTrigger.getById("TimeCapsules" + el.replace('#', ''));
    const targetIndex = items.findIndex(item => '#' + item.slug === el);
    
    setIsJumping(true);

    // Short delay before setting isJumping to false
    // This gives time for the onUpdate/onEnter callbacks to fire and be ignored if necessary
    // or to finish their execution before isJumping becomes false
    const onComplete = () => {
      // Small delay for ScrollTrigger to stabilize after instant jump
      setTimeout(() => {
        if (targetIndex !== -1) {
          handleActiveItem(targetIndex);
        }
        
        // Ensure all ScrollTriggers are updated to the correct state
        ScrollTrigger.refresh();
        
        // Sometimes one refresh is not enough after an instant jump if animations depend on it
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
        
        setTimeout(() => {
          setIsJumping(false);
        }, 400); // Slightly longer delay to ensure everything settled
      }, 50);
    };

    if (st) {
      gsap.to(window, {
        duration: 0,
        scrollTo: {y: st.start},
        onComplete: onComplete
      });
    } else {
      gsap.to(window, {
        duration: 0,
        scrollTo: {y: el},
        onComplete: onComplete
      });
    }
  }

  return (
    <nav className={`meteorite-nav ${navActive ? 'active' : ''}`}>
      <div className="meteorite-nav__inner">
        <ul>
          {
            items.map((el, i) => (
                <li className={`${i === activeItem ? 'active' : ''}`} key={el.slug}>
                  <button className="meteorite-link"  onClick={(e)=>{moveToItem(e, '#'+el.slug)} }>
                    <span>
                      <img src={el.image} alt={el.title}/>
                      <img src={el.shadow} alt="shadow"/>
                    </span>
                  </button>
                </li>
              )
            )
          }
        </ul>
      </div>
    </nav>
  );
}