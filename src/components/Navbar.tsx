"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { scrollToEl, scrollToTop } from "@/utils/scroll";
import ThemeToggle from "./ThemeToggle";

gsap.registerPlugin(useGSAP);

const links = ["About Me", "Portfolio", "Services", "Blog"];

export default function Navbar({ openBooking }: { openBooking: () => void }) {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        ".nav-item",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.6,
          ease: "power2.out",
          delay: 1.6,
        },
      );
    },
    { scope: navRef },
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => document.removeEventListener("touchmove", prevent);
  }, [menuOpen]);

  // Magnetic logo
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const onMove = (e: MouseEvent) => {
      const rect = logo.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      gsap.to(logo, {
        x: (e.clientX - cx) * 0.35,
        y: (e.clientY - cy) * 0.35,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(logo, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
    };

    logo.addEventListener("mousemove", onMove);
    logo.addEventListener("mouseleave", onLeave);
    return () => {
      logo.removeEventListener("mousemove", onMove);
      logo.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const idMap: Record<string, string> = {
    "about me": "about",
    portfolio: "portfolio",
    services: "services",
    blog: "blog",
  };

  const scrollTo = (id: string) => {
    const key = id.toLowerCase();
    const sectionId = idMap[key] ?? key.replace(/\s+/g, "-");
    scrollToEl(document.getElementById(sectionId));
  };

  const menuOverlay = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "var(--bg)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <button
        onClick={() => setMenuOpen(false)}
        aria-label="Close menu"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          lineHeight: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {links.map((link) => (
        <button
          key={link}
          onClick={() => {
            scrollTo(link);
            setMenuOpen(false);
          }}
          style={{
            fontSize: 32,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--ink)",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {link}
        </button>
      ))}

      <button
        onClick={() => {
          openBooking();
          setMenuOpen(false);
        }}
        style={{
          marginTop: 8,
          fontSize: 15,
          fontWeight: 400,
          background: "var(--accent)",
          color: "#FFF8F4",
          border: "none",
          cursor: "pointer",
          padding: "12px 32px",
          borderRadius: 999,
          letterSpacing: "0.01em",
        }}
      >
        Book A Call
      </button>
    </div>
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
      style={{
        padding: "20px 48px",
        background: scrolled ? "var(--glass)" : "var(--bg)",
        borderBottom: scrolled
          ? "1px solid var(--line)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="nav-item">
        <button
          ref={logoRef}
          onClick={() => scrollToTop()}
          aria-label="Home"
          style={{ display: "block", lineHeight: 0 }}
        >
          <svg
            className="logo-star"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
          >
            <path
              d="M14 2L15.9 10.6L23 7.2L19.4 13.8L27 14L19.4 14.2L23 20.8L15.9 17.4L14 26L12.1 17.4L5 20.8L8.6 14.2L1 14L8.6 13.8L5 7.2L12.1 10.6L14 2Z"
              fill="var(--ink)"
            />
          </svg>
        </button>
      </div>

      <ul
        className="hidden md:flex items-center"
        style={{ gap: 36, listStyle: "none" }}
      >
        {links.map((link) => (
          <li key={link} className="nav-item">
            <button
              onClick={() => scrollTo(link)}
              className="nav-link"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "var(--ink)",
                opacity: 0.7,
                background: "none",
                border: "none",
                cursor: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              {link}
            </button>
          </li>
        ))}
      </ul>

      <div
        className="nav-item hidden md:flex"
        style={{ alignItems: "center", gap: 14 }}
      >
        <ThemeToggle />
        <button
          className="nav-cta"
          style={{ cursor: "none" }}
          onClick={openBooking}
        >
          Book A Call
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 10L10 2M10 2H4M10 2V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Theme toggle + hamburger — mobile only, hidden when menu is open */}
      {!menuOpen && (
        <div className="flex md:hidden items-center" style={{ gap: 12 }}>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              lineHeight: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="var(--ink)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Portal: renders directly into document.body, above all GSAP stacking contexts.
          menuOpen can only become true after a client-side click, so document is always available here. */}
      {menuOpen && createPortal(menuOverlay, document.body)}
    </nav>
  );
}
