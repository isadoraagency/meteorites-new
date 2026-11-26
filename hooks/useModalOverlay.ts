import { useEffect } from "react";

/**
 * Custom hook to handle body overlay and scroll preservation when a modal is open.
 * Adds 'overlayed' class to html and body, and sets margin-top on #wrapper.
 * 
 * @param isOpen - Boolean indicating if the modal is open.
 */
export function useModalOverlay(isOpen: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const wrapper = document.getElementById("wrapper");
    
    let scrollY = 0;

    if (isOpen) {
      // Save current scroll position
      scrollY = window.scrollY;
      
      // Add classes
      html.classList.add("overlayed");
      body.classList.add("overlayed");
      
      // Set margin-top on wrapper to prevent jumping to top
      if (wrapper) {
        wrapper.style.marginTop = `-${scrollY}px`;
      }
    } else {
      // Get the scroll position from the wrapper's margin-top (removing the minus sign)
      if (wrapper && wrapper.style.marginTop) {
        scrollY = parseInt(wrapper.style.marginTop || "0") * -1;
      }

      // Remove classes
      html.classList.remove("overlayed");
      body.classList.remove("overlayed");
      
      // Reset margin-top
      if (wrapper) {
        wrapper.style.marginTop = "";
      }

      // Restore scroll position
      if (scrollY > 0) {
        window.scrollTo(0, scrollY);
      }
    }

    // Cleanup on unmount
    return () => {
      if (isOpen) {
        html.classList.remove("overlayed");
        body.classList.remove("overlayed");
        if (wrapper) {
          wrapper.style.marginTop = "";
        }
      }
    };
  }, [isOpen]);
}
