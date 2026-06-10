import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const scrollToEl = (el: Element | null) => {
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
};

export const stopLenis = () => lenis?.stop();
export const startLenis = () => lenis?.start();
