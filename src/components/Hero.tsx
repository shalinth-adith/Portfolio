"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LOADER_OFFSET = 1.5; // seconds after page load

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLHeadingElement>(null);
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: LOADER_OFFSET });

      // Sidebar text fade in
      tl.fromTo(
        ".hero-side-text",
        { opacity: 0 },
        { opacity: 1, stagger: 0.2, duration: 0.6, ease: "power2.out" },
        0
      );

      // Stats count-up
      const animCount = (el: HTMLSpanElement | null, target: number) => {
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          delay: LOADER_OFFSET + 0.1,
          ease: "power2.out",
          onUpdate: () => { el.textContent = `+${Math.round(obj.val)}`; },
        });
      };
      animCount(stat1Ref.current, 4);
      animCount(stat2Ref.current, 1);

      // Photo clip reveal (right side)
      tl.fromTo(
        photoRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1.25, ease: "power4.inOut" },
        0.1
      );

      // Photo scale settle
      tl.fromTo(
        photoRef.current?.querySelector(".photo-inner") as Element,
        { scale: 1.08 },
        { scale: 1, duration: 1.4, ease: "power3.out" },
        0.1
      );

      // "Hello" letters stagger up
      const letters = helloRef.current?.querySelectorAll<HTMLSpanElement>(".letter");
      if (letters) {
        tl.fromTo(
          letters,
          { y: "110%" },
          { y: "0%", stagger: 0.065, duration: 0.85, ease: "power3.out" },
          0.3
        );
      }

      // Tagline + scroll indicator
      tl.fromTo(
        ".hero-fade",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: "power2.out" },
        0.8
      );

      // Parallax on scroll
      gsap.to(photoRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      });

      // Subtle parallax on "Hello" text
      gsap.to(helloRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-grid"
      style={{
        minHeight: "100vh",
        paddingTop: 80,
        display: "grid",
        gridTemplateColumns: "56px 1fr",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg)",
      }}
    >
      {/* Left sidebar */}
      <div
        className="hero-sidebar"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "48px 0",
          borderRight: "1px solid var(--line)",
        }}
      >
        <span
          className="hero-side-text rotate-text"
          style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink3)", opacity: 0 }}
        >
          iOS developer
        </span>
        <span
          className="hero-side-text rotate-text"
          style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--ink3)", opacity: 0 }}
        >
          2026
        </span>
      </div>

      {/* Main content */}
      <div
        className="hero-content"
        style={{
          position: "relative",
          padding: "40px 48px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Stats */}
        <div style={{ display: "flex", gap: 48, position: "relative", zIndex: 5 }}>
          <div className="hero-fade" style={{ opacity: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)" }}>
              <span ref={stat1Ref}>+0</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4 }}>Apps shipped</div>
          </div>
          <div className="hero-fade" style={{ opacity: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)" }}>
              <span ref={stat2Ref}>+0</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4 }}>Years of Swift</div>
          </div>
        </div>

        {/* Right photo — absolute */}
        <div
          ref={photoRef}
          className="hero-photo"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "50%",
            zIndex: 1,
            overflow: "hidden",
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          <div className="photo-inner" style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* Gradient fade-left */}
            <div
              style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: 200,
                background: "linear-gradient(to right, var(--bg), transparent)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
            {/* Gradient fade-bottom */}
            <div
              style={{
                position: "absolute",
                left: 0, right: 0, bottom: 0,
                height: 220,
                background: "linear-gradient(to top, var(--bg), transparent)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
            {/* Gradient fade-right */}
            <div
              style={{
                position: "absolute",
                top: 0, right: 0, bottom: 0,
                width: 120,
                background: "linear-gradient(to left, var(--bg), transparent)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Hero.jpg`}
              alt="Shalinth Adithyan"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
          </div>
        </div>

        {/* Hello + tagline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 5 }}>
          <h1
            ref={helloRef}
            className="hero-hello"
            style={{
              fontSize: "clamp(100px, 14vw, 190px)",
              fontWeight: 200,
              letterSpacing: "-0.045em",
              lineHeight: 0.9,
              color: "var(--ink)",
              userSelect: "none",
            }}
          >
            {"Hello".split("").map((char, i) => (
              <span
                key={i}
                style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
              >
                <span className="letter" style={{ display: "inline-block", transform: "translateY(110%)" }}>
                  {char}
                </span>
              </span>
            ))}
          </h1>
          <p
            className="hero-fade"
            style={{ fontSize: 16, fontWeight: 400, color: "var(--ink2)", marginTop: 18, opacity: 0 }}
          >
            — It&apos;s Shalinth Adithyan, an iOS developer
          </p>
        </div>

        {/* Scroll down */}
        <button
          className="hero-fade"
          style={{
            background: "none",
            border: "none",
            cursor: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            color: "var(--ink2)",
            opacity: 0,
            position: "relative",
            zIndex: 5,
            padding: 0,
          }}
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        >
          Scroll down{" "}
          <span className="scroll-arrow">↓</span>
        </button>
      </div>
    </section>
  );
}
