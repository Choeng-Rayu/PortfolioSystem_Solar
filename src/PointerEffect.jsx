import React, { useEffect } from 'react';
import './PointerEffect.css';

function PointerEffect() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const pointer = document.getElementById('pointer-effect');
      if (pointer) {
        pointer.style.left = `${e.pageX}px`;
        pointer.style.top = `${e.pageY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div id="pointer-effect"></div>;
}

export default PointerEffect;