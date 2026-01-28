import {useState, useEffect, useRef} from "react";
import './Navigation.scss';
import {gsap, ScrollToPlugin} from 'gsap/all';

gsap.registerPlugin(ScrollToPlugin)
export default function Navigation ({navActive, activeItem}){
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('/data/meteorites.json')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);

        setItem(data[0]);

      });

  }, []);

  const moveToItem = (e, el) => {
    e.preventDefault();
    gsap.to(window, {duration: 0, scrollTo: {y: el}});
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