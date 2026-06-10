"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.4,
      },
    });
  });

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}
