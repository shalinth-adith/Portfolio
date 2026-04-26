"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const skills = [
  "SwiftUI",
  "iOS Engineering",
  "App Store",
  "Animations",
  "CoreData",
  "Firebase",
  "Xcode",
  "UIKit",
  "AVFoundation",
  "CloudKit",
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 24,
        ease: "none",
      });

      const container = containerRef.current;
      if (!container) return;

      const pause = () => gsap.to(tween, { timeScale: 0, duration: 0.6, ease: "power2.out" });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.6, ease: "power2.in" });

      container.addEventListener("mouseenter", pause);
      container.addEventListener("mouseleave", resume);
    },
    { scope: containerRef }
  );

  const items = [...skills, ...skills];

  return (
    <div ref={containerRef} className="marquee-strip" style={{ background: "var(--bg)" }}>
      <div
        ref={trackRef}
        style={{ display: "flex", width: "max-content", gap: 0 }}
      >
        {items.map((skill, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "0 32px",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink3)",
              }}
            >
              {skill}
            </span>
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "var(--ink)",
                marginLeft: 8,
                opacity: 0.4,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
