import { useEffect, useRef } from 'react';
import './Cursor.scss';

const Cursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const onMouseMove = (e) => {
      cursor.style.top = e.clientY + 'px';
      cursor.style.left = e.clientX + 'px';
    };

    const onMouseEnter = (e) => {
      const el = e.target;
      if (el.nodeType === 1 && el.matches && el.matches('a, button, input[type="submit"]')) {
        cursor.classList.add('hover');
      }
    };

    const onMouseLeave = (e) => {
      const el = e.target;
      if (el.nodeType === 1 && el.matches && el.matches('a, button, input[type="submit"]')) {
        cursor.classList.remove('hover');
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter, true);
    document.addEventListener('mouseleave', onMouseLeave, true);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter, true);
      document.removeEventListener('mouseleave', onMouseLeave, true);
    };
  }, []);

  return <div className="cursor" ref={cursorRef}></div>;
};

export default Cursor;