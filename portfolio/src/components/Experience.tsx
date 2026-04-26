"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Project {
  company: string;
  period: string;
  role: string;
  tags: string[];
  link?: string;
  dark?: boolean;
  expanded?: boolean;
  expandedText?: string;
}

const appProjects: Project[] = [
  {
    company: "Huddle",
    period: "2025 - 2026",
    role: "Social space for closer circles, built around presence and low-pressure connection.",
    tags: ["SwiftUI", "Social"],
    link: "https://github.com/shalinth-adith/Huddle",
  },
  {
    company: "Expense Tracker Pro",
    period: "2025 — 2026",
    role: "Personal finance made calm. Charts that don't lecture, exports that just work.",
    tags: ["SwiftUI", "CoreData"],
    link: "https://github.com/shalinth-adith/ExpenseTrackerPro",
  },
  {
    company: "The Routine",
    period: "2025",
    role: "Open-source SwiftUI component library — opinionated, animated, and delightful.",
    tags: ["Library", "Open Source"],
    link: "https://github.com/shalinth-adith/TheRoutine",
    dark: true,
  },
  {
    company: "Music Player",
    period: "2026",
    role: "Ambient player exploring fluid gestures, blur layers, and album art as the UI.",
    tags: ["SwiftUI", "AVFoundation"],
    link: "https://github.com/shalinth-adith/MusicPlayer",
  },
];

const workItems: Project[] = [
  {
    company: "iOS Developer Intern",
    period: "2026",
    role: "Built production Swift features, collaborated with designers, shipped to App Store.",
    tags: ["Swift", "UIKit"],
  },
];

export default function Experience({ openBooking }: { openBooking: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(2);

  useGSAP(
    () => {
      const st = { trigger: sectionRef.current, start: "top 72%" };

      gsap.fromTo(
        ".exp-header-el",
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: st }
      );

      gsap.fromTo(
        ".exp-row",
        { x: -36, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.08, duration: 0.75, ease: "power3.out", scrollTrigger: { ...st, start: "top 68%" } }
      );

      // Row hover effects
      document.querySelectorAll<HTMLElement>(".exp-row").forEach((row) => {
        const company = row.querySelector<HTMLElement>(".exp-company");
        row.addEventListener("mouseenter", () => {
          gsap.to(row, { paddingLeft: 12, duration: 0.3, ease: "power2.out" });
          if (company) gsap.to(company, { letterSpacing: "0.01em", duration: 0.3 });
        });
        row.addEventListener("mouseleave", () => {
          gsap.to(row, { paddingLeft: 0, duration: 0.3 });
          if (company) gsap.to(company, { letterSpacing: "-0.02em", duration: 0.3 });
        });
      });
    },
    { scope: sectionRef }
  );

  const toggle = (i: number) => {
    if (activeIndex === i) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(i);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      style={{ padding: "100px 48px 100px 104px", background: "var(--bg)" }}
    >
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 60 }}>
        <div>
          <div className="exp-header-el section-label" style={{ opacity: 0 }}>
            <span className="dot" />
            Experiences
          </div>
          <h2
            className="exp-header-el"
            style={{
              fontWeight: 300,
              fontSize: "clamp(34px, 4.2vw, 56px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
              color: "var(--ink)",
              opacity: 0,
            }}
          >
            Explore My iOS<br />Journey
          </h2>
        </div>
        <div className="exp-header-el" style={{ opacity: 0 }}>
          <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.72, marginBottom: 18 }}>
            Over the past 3+ years, I&apos;ve shipped apps across domains — from social tools to finance to open-source libraries.
          </p>
          <button
            className="link-arrow"
            style={{ color: "var(--ink)", background: "none", border: "none", cursor: "none" }}
            onClick={openBooking}
          >
            Book A Call
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", color: "var(--ink3)", textTransform: "uppercase", marginBottom: 12 }}>
          Projects
        </div>
        <div style={{ borderTop: "1px solid var(--line)" }}>
          {appProjects.map((proj: Project, i: number) => (
            <div
              key={proj.company}
              className="exp-row"
              style={{ opacity: 0, cursor: "none", paddingLeft: 0 }}
              onClick={() => {
                if (proj.expanded) toggle(i);
                else if (proj.link) {
                  const a = document.createElement("a");
                  a.href = proj.link;
                  a.target = "_blank";
                  a.rel = "noopener noreferrer";
                  a.click();
                }
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", alignItems: "center", gap: 24 }}>
                <div>
                  <div
                    className="exp-company"
                    style={{ fontSize: 18, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em", transition: "letter-spacing 0.3s", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {proj.company}
                    {proj.link && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
                        <path d="M2 10L10 2M10 2H4M10 2V8" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>•</span>
                    {proj.period}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.5 }}>{proj.role}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  {proj.tags.map((tag: string) => (
                    <span key={tag} className={proj.dark ? "badge badge-dark" : "badge"}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", color: "var(--ink3)", textTransform: "uppercase", marginBottom: 12 }}>
          Work
        </div>
        <div style={{ borderTop: "1px solid var(--line)" }}>
          {workItems.map((proj: Project) => (
            <div
              key={proj.company}
              className="exp-row"
              style={{ opacity: 0, paddingLeft: 0 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", alignItems: "center", gap: 24 }}>
                <div>
                  <div
                    className="exp-company"
                    style={{ fontSize: 18, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em", transition: "letter-spacing 0.3s" }}
                  >
                    {proj.company}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>•</span>
                    {proj.period}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.5 }}>{proj.role}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  {proj.tags.map((tag: string) => (
                    <span key={tag} className="badge">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
