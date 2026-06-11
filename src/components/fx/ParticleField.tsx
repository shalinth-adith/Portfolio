"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Mouse-reactive constellation canvas. Fills its nearest positioned ancestor.
 * Reads --accent / --ink3 from the document so it follows theme switches,
 * pauses when offscreen, and renders a single static frame under
 * prefers-reduced-motion.
 */
export default function ParticleField({
  density = 14000,
  linkDist = 110,
  maxCount = 110,
  style,
}: {
  density?: number;
  linkDist?: number;
  maxCount?: number;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let rafId = 0;
    let running = true;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    // Theme colors, refreshed whenever data-theme flips
    let accent = "#F05138";
    let nodeColor = "136, 136, 128";
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      accent = cs.getPropertyValue("--accent").trim() || "#F05138";
      const ink3 = cs.getPropertyValue("--ink3").trim();
      // hex → "r, g, b" for rgba() line strokes
      const m = ink3.match(/^#?([0-9a-f]{6})$/i);
      if (m) {
        const n = parseInt(m[1], 16);
        nodeColor = `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
      }
    };
    readTheme();
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const seed = () => {
      const target = Math.min(
        maxCount,
        Math.max(36, Math.round((width * height) / density)),
      );
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 0.8 + Math.random() * 1.5,
      }));
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(); // static frame still adapts to new size
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Links first so nodes paint on top
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.34;
            ctx.strokeStyle = `rgba(${nodeColor}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const near = dm < 130;
        ctx.fillStyle = near ? accent : `rgba(${nodeColor}, 0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r * 1.6 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      if (!running || !visible) return;

      for (const p of particles) {
        // Gentle repulsion bubble around the cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 0.01) {
          const force = ((130 - dist) / 130) * 0.6;
          p.vx += (dx / dist) * force * 0.12;
          p.vy += (dy / dist) * force * 0.12;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        // Keep a slow ambient drift alive after damping
        if (Math.abs(p.vx) < 0.06) p.vx += (Math.random() - 0.5) * 0.03;
        if (Math.abs(p.vy) < 0.06) p.vy += (Math.random() - 0.5) * 0.03;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      draw();
      rafId = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && running && !reduced) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(step);
      }
    });
    io.observe(canvas);

    if (reduced) {
      draw();
    } else {
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
      rafId = requestAnimationFrame(step);
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [density, linkDist, maxCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
