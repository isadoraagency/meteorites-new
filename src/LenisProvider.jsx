import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }) {
  useEffect(() => {
    const root = document.querySelector('#lenis-root')

    const lenis = new Lenis({
      wrapper: window,
      content: root,
      smooth: true,
      lerp: 0.08,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // 🔥 ВАЖНО: scrollerProxy НА ТОТ ЖЕ КОНТЕЙНЕР
    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    ScrollTrigger.defaults({ scroller: root })

    lenis.on('scroll', ScrollTrigger.update)

    ScrollTrigger.refresh()

    return () => {
      lenis.destroy()
    }
  }, [])

  return children
}
