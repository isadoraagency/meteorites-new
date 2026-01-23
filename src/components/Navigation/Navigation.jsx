import {useState, useEffect, useRef} from "react";
import './Navigation.scss';

export default function Navigation ({navActive}){
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('/data/meteorites.json')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        // const currentItem = data.find((p) => p.slug === slug);
        // setItem(currentItem);

      });

  }, []);
  return (
    <nav className={`meteorite-nav ${navActive ? 'active' : ''}`}>
      <ul>
        {
          items.map((el, i) => (
              <li className="" key={el.slug}>
                <button className="meteorite-link" onClick={()=>setItem(el)}>
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