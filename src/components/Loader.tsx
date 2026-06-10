"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function Loader() {
  const [done, setDone] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const letters = loaderRef.current?.querySelectorAll<HTMLSpanElement>(".ltr");
      if (!letters) return;

      const tl = gsap.timeline();

      // Letters blur + rise in
      tl.fromTo(
        letters,
        { y: 28, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.045,
          duration: 0.75,
          ease: "power3.out",
          delay: 0.15,
        }
      );

      // Hold
      tl.to({}, { duration: 0.4 });

      // Letters blur + float out upward
      tl.to(letters, {
        y: -24,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.03,
        duration: 0.55,
        ease: "power3.in",
      });

      // Panel exits
      tl.to(loaderRef.current, {
        yPercent: -100,
        duration: 0.75,
        ease: "power4.inOut",
        onComplete: () => setDone(true),
      }, "-=0.1");
    },
    { scope: loaderRef }
  );

  if (done) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: "var(--ink)", zIndex: 9000 }}
    >
      <div>
        {"Shalinth Adithyan".split("").map((char, i) => (
          <span
            key={i}
            className="ltr inline-block"
            style={{
              fontSize: "clamp(42px, 7vw, 100px)",
              fontWeight: 200,
              letterSpacing: "-0.04em",
              color: "var(--bg)",
              lineHeight: 1,
              opacity: 0,
              whiteSpace: char === " " ? "pre" : "normal",
            }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
        <span
          className="ltr serif-it inline-block"
          style={{
            fontSize: "clamp(42px, 7vw, 100px)",
            letterSpacing: "-0.04em",
            color: "var(--accent)",
            lineHeight: 1,
            opacity: 0,
          }}
        >
          .
        </span>
      </div>
    </div>
  );
}
