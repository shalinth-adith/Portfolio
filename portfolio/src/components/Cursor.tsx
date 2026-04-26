"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const DARK_DOT   = "#1a1a1a";
const DARK_RING  = "rgba(26,26,26,0.5)";
const LIGHT_DOT  = "#ffffff";
const LIGHT_RING = "rgba(255,255,255,0.7)";

function getBgUnderCursor(x: number, y: number): string | null {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  let target: Element | null = el;
  let depth = 0;
  while (target && depth < 10) {
    const bg = getComputedStyle(target).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
    target = target.parentElement;
    depth++;
  }
  return null;
}

function isDarkColor(color: string): boolean {
  const m = color.match(/\d+/g);
  if (!m || m.length < 3) return false;
  const [r, g, b] = m.map(Number);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.25;
}

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId: number;
    let inDark = false;
    let hovering = false;

    const setDark = (dark: boolean) => {
      if (dark === inDark) return;
      inDark = dark;
      if (dark) {
        gsap.to(dot,  { backgroundColor: LIGHT_DOT,  duration: 0.25, ease: "power2.out" });
        gsap.to(ring, { borderColor: LIGHT_RING,      duration: 0.25, ease: "power2.out" });
      } else {
        gsap.to(dot,  { backgroundColor: DARK_DOT,   duration: 0.25, ease: "power2.out" });
        gsap.to(ring, { borderColor: hovering ? "rgba(26,26,26,0.18)" : DARK_RING, duration: 0.25, ease: "power2.out" });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: "power2.out" });
      const bg = getBgUnderCursor(mouseX, mouseY);
      if (bg) setDark(isDarkColor(bg));
    };

    const lerp = () => {
      ringX += (mouseX - ringX) * 0.11;
      ringY += (mouseY - ringY) * 0.11;
      gsap.set(ring, { x: ringX, y: ringY });
      rafId = requestAnimationFrame(lerp);
    };

    const onHoverIn = () => {
      hovering = true;
      const ringColor = inDark ? "rgba(255,255,255,0.35)" : "rgba(26,26,26,0.18)";
      gsap.to(ring, { scale: 1.6, borderColor: ringColor, duration: 0.35, ease: "power2.out" });
      gsap.to(dot,  { scale: 0.5, duration: 0.2 });
    };

    const onHoverOut = () => {
      hovering = false;
      const ringColor = inDark ? LIGHT_RING : DARK_RING;
      gsap.to(ring, { scale: 1, borderColor: ringColor, duration: 0.35, ease: "power2.out" });
      gsap.to(dot,  { scale: 1, duration: 0.2 });
    };

    const onDown = () => gsap.to(dot, { scale: 0.3, duration: 0.15 });
    const onUp   = () => gsap.to(dot, { scale: 1,   duration: 0.15 });

    const onLeaveWindow = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2, ease: "power2.out" });
    };
    const onEnterWindow = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2, ease: "power2.out" });
    };

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    rafId = requestAnimationFrame(lerp);

    const addListeners = () => {
      document
        .querySelectorAll("a, button, [data-cursor], .stack-item, .blog-card, .gal-item, .exp-row, .badge, .badge-dark")
        .forEach((el) => {
          el.addEventListener("mouseenter", onHoverIn);
          el.addEventListener("mouseleave", onHoverOut);
        });
    };
    const timer = setTimeout(addListeners, 600);

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
