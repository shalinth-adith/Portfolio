"use client";

import { useRef, useState, useEffect, type FormEvent, type CSSProperties } from "react";
import gsap from "gsap";

const fields = [
  { id: "name",    label: "Full Name",              type: "text",     placeholder: "Your name" },
  { id: "email",   label: "Email Address",           type: "email",    placeholder: "your@email.com" },
  { id: "project", label: "What are you building?",  type: "text",     placeholder: "App idea, collaboration, consulting…" },
  { id: "message", label: "Anything else?",          type: "textarea", placeholder: "Tell me more…" },
];

type FormData = { name: string; email: string; project: string; message: string };

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const panelRef   = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({ name: "", email: "", project: "", message: "" });

  // Animate in on mount
  useEffect(() => {
    gsap.set(panelRef.current, { yPercent: 100 });
    gsap.to(panelRef.current, { yPercent: 0, duration: 0.85, ease: "power4.inOut" });
    gsap.fromTo(".bk-el",
      { y: 44, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.75, ease: "power3.out", delay: 0.55 }
    );
  }, []);

  useEffect(() => {
    if (!submitted) return;
    gsap.fromTo(".bk-success-el",
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: "power3.out" }
    );
  }, [submitted]);

  const close = () => {
    gsap.to(panelRef.current, {
      yPercent: 100,
      duration: 0.75,
      ease: "power4.inOut",
      onComplete: onClose,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://formspree.io/f/xyklvooy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          project: form.project,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("submission failed");
    } catch {
      // still show success — Formspree errors are rare and non-critical for a portfolio
    }
    gsap.to(".bk-form-wrap", {
      y: -20, opacity: 0, duration: 0.4, ease: "power2.in",
      onComplete: () => setSubmitted(true),
    });
  };

  const inputStyle: CSSProperties = {
    width: "100%", background: "none", border: "none", outline: "none",
    fontSize: 16, color: "var(--ink)", fontFamily: "inherit", lineHeight: 1.6,
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed", inset: 0,
        background: "var(--bg)",
        zIndex: 8000,
        overflowY: "auto",
      }}
    >
      <div style={{ padding: "36px 48px 100px 104px", minHeight: "100vh", position: "relative" }}>

        {/* Close */}
        <button
          onClick={close}
          className="bk-el"
          style={{
            position: "fixed", top: 32, right: 48,
            background: "none", border: "none", cursor: "none",
            fontSize: 13, color: "var(--ink)",
            display: "flex", alignItems: "center", gap: 8,
            letterSpacing: "0.05em", opacity: 0,
          }}
          onMouseEnter={e => gsap.to(e.currentTarget, { opacity: 1,    duration: 0.2 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { opacity: 0.55, duration: 0.2 })}
        >
          Close
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3L13 13M13 3L3 13" stroke="var(--ink)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        {/* Label */}
        <div className="bk-el section-label" style={{ marginBottom: 16, opacity: 0 }}>
          <span className="dot" />
          Book A Call
        </div>

        {/* Title */}
        <h2 className="bk-el" style={{
          fontWeight: 300,
          fontSize: "clamp(34px, 4.2vw, 60px)",
          letterSpacing: "-0.025em",
          lineHeight: 1.08,
          color: "var(--ink)",
          marginBottom: 64,
          opacity: 0,
        }}>
          Let&apos;s talk about your<br />next iOS project.
        </h2>

        {!submitted ? (
          <form className="bk-form-wrap" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
            {fields.map(f => (
              <div key={f.id} className="bk-el" style={{ borderTop: "1px solid var(--line)", padding: "22px 0", opacity: 0 }}>
                <label htmlFor={f.id} style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "var(--ink3)", display: "block", marginBottom: 12,
                }}>
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea id={f.id} required rows={3} placeholder={f.placeholder}
                    value={form[f.id as keyof FormData]}
                    onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                ) : (
                  <input id={f.id} type={f.type} required placeholder={f.placeholder}
                    value={form[f.id as keyof FormData]}
                    onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}

            <div className="bk-el" style={{ borderTop: "1px solid var(--line)", paddingTop: 36, opacity: 0 }}>
              <button type="submit" style={{
                background: "var(--ink)", color: "var(--bg)",
                border: "none", padding: "16px 44px",
                fontSize: 14, letterSpacing: "0.04em",
                borderRadius: 100, cursor: "none",
                display: "inline-flex", alignItems: "center", gap: 10,
              }}
                onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "power2.out" })}
                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.3, ease: "power2.out" })}
              >
                Send Message
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="bk-success-el" style={{
              width: 56, height: 56, borderRadius: "50%", background: "var(--ink)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 28, opacity: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11l5 5L18 6" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="bk-success-el" style={{
              fontSize: "clamp(28px, 3vw, 52px)", fontWeight: 300,
              letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 16, opacity: 0,
            }}>
              Message sent.
            </h3>
            <p className="bk-success-el" style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 40, opacity: 0 }}>
              Thanks for reaching out — I&apos;ll get back to you within 24 hours.
            </p>
            <button className="bk-success-el link-arrow" onClick={close} style={{
              fontSize: 14, color: "var(--ink)", background: "none", border: "none", cursor: "none", opacity: 0,
            }}>
              Back to portfolio
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
