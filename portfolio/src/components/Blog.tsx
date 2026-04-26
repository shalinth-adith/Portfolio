"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Post {
  tag: string;
  readTime: string;
  title: string;
  bgColor: string;
  accentColor: string;
}

const posts: Post[] = [
  {
    tag: "SWIFTUI",
    readTime: "5 min read",
    title: "Building buttery-smooth animations with matchedGeometryEffect",
    bgColor: "#A8B8D0",
    accentColor: "#E03030",
  },
  {
    tag: "IOS DEV",
    readTime: "5 min read",
    title: "Designing offline-first iOS apps that users actually trust",
    bgColor: "#D8A8B0",
    accentColor: "#E04060",
  },
  {
    tag: "APP STORE",
    readTime: "5 min read",
    title: "App Store Connect secrets every indie developer should know",
    bgColor: "#B0C0B0",
    accentColor: "#408040",
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = { trigger: sectionRef.current, start: "top 72%" };

      gsap.fromTo(
        ".blog-header-el",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: st }
      );

      gsap.fromTo(
        ".blog-card",
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { ...st, start: "top 68%" },
        }
      );

      // Tilt on hover
      document.querySelectorAll<HTMLElement>(".blog-card").forEach((card) => {
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotateX: -y * 8,
            rotateY: x * 8,
            y: -8,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 600,
            boxShadow: "0 24px 48px -16px rgba(26,26,26,0.18)",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            boxShadow: "none",
          });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="blog"
      style={{ padding: "100px 48px", background: "var(--bg2)", textAlign: "center" }}
    >
      {/* Label */}
      <div
        className="blog-header-el section-label"
        style={{ margin: "0 auto 24px", opacity: 0 }}
      >
        <span className="dot" />
        Blog
      </div>

      <h2
        className="blog-header-el"
        style={{
          fontWeight: 300,
          fontSize: "clamp(34px, 4.2vw, 56px)",
          letterSpacing: "-0.025em",
          lineHeight: 1.08,
          color: "var(--ink)",
          opacity: 0,
        }}
      >
        iOS Insights &amp; Dev Notes
      </h2>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginTop: 48,
          textAlign: "left",
        }}
      >
        {posts.map((post, i) => (
          <article key={i} className="blog-card" style={{ opacity: 0 }}>
            {/* Image placeholder */}
            <div style={{ height: 200, overflow: "hidden" }}>
              <svg
                viewBox="0 0 400 200"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                style={{ width: "100%", height: "100%", transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)", display: "block" }}
              >
                <rect width="400" height="200" fill={post.bgColor} />
                <ellipse cx="200" cy="185" rx="100" ry="55" fill={post.bgColor} opacity="0.55" />
                <ellipse cx="200" cy="85" rx="50" ry="50" fill={post.accentColor} opacity="0.22" />
                <ellipse cx="200" cy="82" rx="28" ry="28" fill={post.accentColor} opacity="0.88" />
              </svg>
            </div>
            <div style={{ padding: "18px 20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    background: "var(--black)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 999,
                    letterSpacing: "0.06em",
                  }}
                >
                  {post.tag}
                </span>
                <span style={{ fontSize: 13, color: "var(--ink3)" }}>{post.readTime}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.5, color: "var(--ink)" }}>
                {post.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
