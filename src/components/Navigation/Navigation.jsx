import {useState, useEffect} from "react";
import './Navigation.scss';
import {gsap, ScrollToPlugin, ScrollTrigger} from 'gsap/all';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
export default function Navigation ({navActive, activeItem}){
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
    if (st) {
      gsap.to(window, {duration: 0.8, scrollTo: {y: st.start}, ease: "power2.inOut"});
    } else {
      gsap.to(window, {duration: 0.8, scrollTo: {y: el}, ease: "power2.inOut"});
    }
  }

  return (
    <nav className={`meteorite-nav ${navActive ? 'active' : ''}`}>
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
    </nav>
  );
}