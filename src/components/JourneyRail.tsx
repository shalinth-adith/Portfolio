"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToEl } from "@/utils/scroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "portfolio", label: "Work" },
  { id: "blog", label: "Blog" },
  { id: "services", label: "Let's Talk" },
];

export default function JourneyRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rail = railRef.current;
      if (!rail) return;

      const dotEls = Array.from(
        rail.querySelectorAll<HTMLElement>(".rail-dot"),
      );
      let fracs: number[] = SECTIONS.map(() => 0);

      // Map each section's document position to a 0..1 fraction of total scroll,
      // so the thread tip crosses a dot exactly as its section enters view
      const place = () => {
        const max = ScrollTrigger.maxScroll(window) || 1;
        fracs = SECTIONS.map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return 0;
          const top = el.getBoundingClientRect().top + window.scrollY;
          return gsap.utils.clamp(0, 1, (top - window.innerHeight * 0.4) / max);
        });
        dotEls.forEach((d, i) => {
          d.style.top = `${fracs[i] * 100}%`;
        });
      };

      const apply = (p: number) => {
        gsap.set(fillRef.current, { scaleY: p });
        gsap.set(starRef.current, { top: `${p * 100}%`, rotation: p * 540 });
        dotEls.forEach((d, i) =>
          d.classList.toggle("active", p >= fracs[i] - 0.001),
        );
      };

      place();
      apply(window.scrollY / (ScrollTrigger.maxScroll(window) || 1));

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => apply(self.progress),
        onRefresh: () => {
          place();
          apply(window.scrollY / (ScrollTrigger.maxScroll(window) || 1));
        },
      });

      // Drift in after the loader finishes
      gsap.fromTo(
        rail,
        { opacity: 0, x: 16 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power2.out", delay: 2.4 },
      );
    },
    { scope: railRef },
  );

  return (
    <div
      ref={railRef}
      className="journey-rail"
      style={{ opacity: 0 }}
      aria-hidden="false"
    >
      <div className="rail-track" />
      <div ref={fillRef} className="rail-fill" />
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          className="rail-dot"
          aria-label={`Scroll to ${label}`}
          onClick={() => scrollToEl(document.getElementById(id))}
        >
          <span className="rail-label">{label}</span>
        </button>
      ))}
      <div ref={starRef} className="rail-star" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 2L15.9 10.6L23 7.2L19.4 13.8L27 14L19.4 14.2L23 20.8L15.9 17.4L14 26L12.1 17.4L5 20.8L8.6 14.2L1 14L8.6 13.8L5 7.2L12.1 10.6L14 2Z"
            fill="var(--accent)"
          />
        </svg>
      </div>
    </div>
  );
}
