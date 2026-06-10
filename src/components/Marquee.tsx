"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

      let hovered = false;

      const pause = () => {
        hovered = true;
        gsap.to(tween, { timeScale: 0, duration: 0.6, ease: "power2.out" });
      };
      const resume = () => {
        hovered = false;
        gsap.to(tween, { timeScale: 1, duration: 0.6, ease: "power2.in" });
      };

      container.addEventListener("mouseenter", pause);
      container.addEventListener("mouseleave", resume);

      // Scroll velocity makes the strip race — fast flicks feel alive
      ScrollTrigger.create({
        onUpdate: (self) => {
          if (hovered) return;
          const boost = gsap.utils.clamp(
            1,
            6,
            1 + Math.abs(self.getVelocity()) / 350,
          );
          tween.timeScale(boost);
          gsap.to(tween, {
            timeScale: 1,
            duration: 1.4,
            ease: "power2.out",
            overwrite: true,
          });
        },
      });
    },
    { scope: containerRef },
  );

  const items = [...skills, ...skills];

  return (
    <div
      ref={containerRef}
      className="marquee-strip"
      style={{ background: "var(--bg)" }}
    >
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
            {i % 2 === 1 ? (
              <span
                className="serif-it"
                style={{
                  fontSize: 16,
                  letterSpacing: "0.01em",
                  color: "var(--ink2)",
                }}
              >
                {skill}
              </span>
            ) : (
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
            )}
            <span
              style={{
                display: "inline-block",
                marginLeft: 12,
                fontSize: 9,
                color: "var(--accent)",
                lineHeight: 1,
              }}
            >
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
