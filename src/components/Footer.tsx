"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navLinks = ["Home", "About Me", "Portfolio", "Services", "Blog"];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const st = { trigger: sectionRef.current, start: "top 85%" };

      // Email slides in from left
      gsap.fromTo(
        emailRef.current,
        { x: -70, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: "power3.out", scrollTrigger: st }
      );

      // Nav links stagger up
      gsap.fromTo(
        ".footer-link",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: "power2.out", scrollTrigger: st }
      );

      // Bottom text fade
      gsap.fromTo(
        ".footer-bottom-text",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { ...st, start: "top 80%" } }
      );
    },
    { scope: sectionRef }
  );

  const scrollTo = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const el = document.getElementById(id === "home" ? "home" : id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={sectionRef}
      className="footer-section"
      style={{ background: "var(--black)", padding: "56px 48px 36px", position: "relative", overflow: "hidden" }}
    >
      {/* Subtle grid lines */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute", top: 0, bottom: 0,
              left: `${i * 20}%`, borderLeft: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "1px solid rgba(255,255,255,0.04)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Nav links row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 28,
            paddingBottom: 32,
            listStyle: "none",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link}
              className="footer-link"
              onClick={() => scrollTo(link)}
              style={{
                fontSize: 14, color: "rgba(255,255,255,0.55)",
                background: "none", border: "none", cursor: "none",
                transition: "color 0.2s, transform 0.2s",
                opacity: 0,
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { color: "#fff", x: 4, duration: 0.2 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { color: "rgba(255,255,255,0.55)", x: 0, duration: 0.2 });
              }}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Large email */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 32, marginBottom: 32 }}>
          <a
            ref={emailRef}
            href="mailto:shalinth.adith@outlook.com"
            className="footer-email"
            style={{ opacity: 0 }}
          >
            shalinth.adith@outlook.com
          </a>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom-text"
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            fontSize: 12,
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.04em",
            opacity: 0,
          }}
        >
          <span>© 2026 Shalinth Adithyan · India</span>
          <span>iOS Developer · Built with SwiftUI energy</span>
        </div>
      </div>
    </footer>
  );
}
