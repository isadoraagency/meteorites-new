// Single GSAP entry point for the whole app. Every plugin the site uses is
// registered here exactly once — always import gsap and its plugins from this
// module, never from "gsap", "gsap/all" or plugin subpaths directly.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin, SplitText);

export { gsap, ScrollTrigger, ScrollToPlugin, MotionPathPlugin, SplitText };
