"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const stack = ["Swift", "SwiftUI", "Xcode", "Firebase", "CoreData", "Figma", "AVFoundation", "CloudKit"];

const bullets = [
  "With 1+ years of Swift experience, I build intuitive, user-focused iOS apps that solve real problems and deliver seamless digital experiences.",
  "I thrive on the intersection of design and code — blending SwiftUI precision with an eye for detail to create apps that feel alive.",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const st = { trigger: sectionRef.current, start: "top 72%" };

      // Section label + title
      gsap.fromTo(
        ".about-label, .about-title",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: st }
      );

      // Left text column
      gsap.fromTo(
        ".about-left",
        { x: -32, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { ...st, start: "top 75%" } }
      );

      // Stack pills pop in with bounce
      gsap.fromTo(
        ".stack-pill",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.045,
          duration: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: { ...st, start: "top 68%" },
        }
      );

      // Middle stat card scale up
      gsap.fromTo(
        ".stat-card-wrap",
        { scale: 0.94, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st }
      );

      // Counter animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 65%",
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: 4,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              if (counterRef.current) counterRef.current.textContent = `${Math.round(obj.val)}`;
            },
          });
        },
      });

      // Mini photo clip reveal
      gsap.fromTo(
        ".photo-mini-wrap",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: { ...st, start: "top 60%" },
        }
      );

      // Right bullets stagger
      gsap.fromTo(
        ".bullet-row",
        { x: 32, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out", scrollTrigger: { ...st, start: "top 68%" } }
      );

      // Gallery clip reveals
      gsap.fromTo(
        ".gal-clip",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          stagger: 0.15,
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".gallery-strip", start: "top 80%" },
        }
      );

      // Gallery tilt on hover
      document.querySelectorAll<HTMLElement>(".gal-item").forEach((item) => {
        item.addEventListener("mousemove", (e: MouseEvent) => {
          const r = item.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          gsap.to(item, {
            rotateY: x * 7,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 800,
          });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(item, { rotateY: 0, scale: 1, duration: 0.5, ease: "power3.out" });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
      style={{ padding: "100px 48px 100px 104px", background: "var(--bg)" }}
    >
      {/* Label + Title */}
      <div className="about-label section-label" style={{ opacity: 0 }}>
        <span className="dot" />
        About Me
      </div>
      <h2
        className="about-title"
        style={{
          fontWeight: 300,
          fontSize: "clamp(34px, 4.2vw, 56px)",
          letterSpacing: "-0.025em",
          lineHeight: 1.08,
          color: "var(--ink)",
          marginBottom: 56,
          opacity: 0,
        }}
      >
        iOS Developer &amp;<br />SwiftUI Craftsman
      </h2>

      {/* 3-col grid */}
      <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, alignItems: "start" }}>

        {/* Left — Text + Stack */}
        <div className="about-left" style={{ opacity: 0 }}>
          <p style={{ fontSize: 14.5, color: "var(--ink2)", lineHeight: 1.72 }}>
            I specialise in turning ideas into apps that live in your pocket. My approach blends clean SwiftUI architecture with obsessive attention to animation and feel.
          </p>
          <br />
          <p style={{ fontSize: 14.5, color: "var(--ink2)", lineHeight: 1.72 }}>
            I&apos;m a fresh iOS developer who believes great apps should feel like magic — not manuals. I build with SwiftUI and spend way too much time getting the animations just right.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 32 }}>
            {stack.map((s) => (
              <div key={s} className="stack-item stack-pill" style={{ opacity: 0 }}>
                <span className="stack-dot" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Middle — Stat card + mini photo */}
        <div className="stat-card-wrap" style={{ opacity: 0 }}>
          <div className="stat-card">
            <div
              style={{
                width: 44, height: 44, background: "var(--white)", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="var(--ink)" strokeWidth="1.5" />
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="var(--ink)" strokeWidth="1.5" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", lineHeight: 1 }}>
              <span ref={counterRef} style={{ fontSize: 52, fontWeight: 200, letterSpacing: "-0.04em" }}>0</span>
              <span style={{ fontSize: 52, fontWeight: 200, letterSpacing: "-0.04em" }}>+</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.55, marginTop: 10 }}>
              Apps shipped to the App Store, used by real people
            </p>
          </div>

          {/* Mini photo */}
          <div
            className="photo-mini-wrap"
            style={{
              marginTop: 16, borderRadius: "var(--radius)", overflow: "hidden",
              position: "relative", aspectRatio: "3/4", background: "#c4c0ba",
              clipPath: "inset(100% 0 0 0)",
            }}
          >
            <img
              src={`${base}/about.jpg`}
              alt="Shalinth"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
            <div
              style={{
                position: "absolute", top: 12, right: 12,
                width: 36, height: 36, background: "white", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right — Bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26, paddingTop: 8 }}>
          {bullets.map((text, i) => (
            <div key={i} className="bullet-row" style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: 0 }}>
              <div
                style={{
                  width: 30, height: 30, flexShrink: 0, borderRadius: "50%",
                  background: "var(--black)", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
                  transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { rotate: 90, scale: 1.15, duration: 0.4, ease: "back.out(1.7)" })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { rotate: 0, scale: 1, duration: 0.4, ease: "power3.out" })}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.65 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Strip */}
      <div
        className="gallery-strip"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr 1fr",
          height: 420,
          marginTop: 48,
          borderRadius: "var(--radius)",
          overflow: "hidden",
          gap: 4,
        }}
      >
        {[
          { src: `${base}/gallery-expense.jpg`, alt: "Expense Tracker Pro", fit: "contain" as const },
          { src: `${base}/gallery-huddle.jpg`, alt: "Huddle", fit: "contain" as const },
          { src: `${base}/gallery-routine.jpg`, alt: "The Routine", fit: "cover" as const },
        ].map((item, i) => (
          <div key={i} className="gal-item gal-clip" style={{ clipPath: "inset(0 100% 0 0)", position: "relative", overflow: "hidden", background: "#111" }}>
            <img
              src={item.src}
              alt={item.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: item.fit,
                objectPosition: "center center",
                display: "block",
                transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
                filter: "grayscale(100%) contrast(1.05)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.15)", pointerEvents: "none" }} />
            <div className="gal-btn">
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
