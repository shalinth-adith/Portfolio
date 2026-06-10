"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

class TextScramble {
  private el: HTMLElement;
  private chars: string;
  private queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>;
  private frame: number;
  private frameReq: number;
  private resolve!: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.queue = [];
    this.frame = 0;
    this.frameReq = 0;
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const lines = newText.split("\n");
    const oldLines = this.el.innerHTML.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").split("\n");
    const oldText = oldLines.join("\n").split("");
    const newFlat = lines.join("\n").split("");
    const len = Math.max(oldText.length, newFlat.length);
    const promise = new Promise<void>((res) => (this.resolve = res));
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = oldText[i] || "";
      const to = newFlat[i] || "";
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 18);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameReq);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update() {
    let output = "";
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, start, end } = this.queue[i];
      let { char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        if (to === "\n") output += "<br/>";
        else output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:var(--accent)">${char}</span>`;
      } else {
        if (from === "\n") output += "<br/>";
        else output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameReq = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

export default function CTA({ openBooking }: { openBooking: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      // Text scramble on enter
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 65%",
        once: true,
        onEnter: () => {
          const el = headingRef.current;
          if (!el) return;
          const original = el.getAttribute("data-text") || el.innerText;
          const scrambler = new TextScramble(el);
          scrambler.setText(original);
        },
      });

      // Subtitle + link stagger in
      gsap.fromTo(
        ".cta-fade",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        }
      );

      // Magnetic CTA link
      const ctaLink = sectionRef.current?.querySelector<HTMLElement>(".cta-link");
      if (ctaLink) {
        ctaLink.addEventListener("mousemove", (e: MouseEvent) => {
          const r = ctaLink.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          gsap.to(ctaLink, {
            x: (e.clientX - cx) * 0.4,
            y: (e.clientY - cy) * 0.4,
            duration: 0.4,
            ease: "power2.out",
          });
        });
        ctaLink.addEventListener("mouseleave", () => {
          gsap.to(ctaLink, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        padding: "100px 48px",
        textAlign: "center",
        background: "var(--bg2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orbiting rings */}
      <div className="cta-orb" />
      <div className="cta-orb-2" />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 5 }}>
        <h2
          ref={headingRef}
          data-text={"Got an App Idea?\nLet's Build It!"}
          style={{
            fontSize: "clamp(30px, 3.8vw, 50px)",
            fontWeight: 300,
            letterSpacing: "-0.025em",
            color: "var(--ink)",
            marginBottom: 14,
            lineHeight: 1.2,
          }}
        >
          Got an App Idea?<br />Let&apos;s Build It!
        </h2>

        <p
          className="cta-fade"
          style={{ fontSize: 14.5, color: "var(--ink2)", maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.7, opacity: 0 }}
        >
          I&apos;m always excited to collaborate on new iOS projects. Whether you&apos;re starting from scratch or need a SwiftUI specialist to level up an existing app.
        </p>

        <button
          className="cta-fade cta-link link-arrow"
          onClick={openBooking}
          style={{ fontSize: 15, color: "var(--ink)", opacity: 0, display: "inline-flex", background: "none", border: "none", cursor: "none" }}
        >
          Book A Call
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
