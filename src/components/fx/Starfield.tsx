"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  drift: number;
}

interface Streak {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 → 0
}

/**
 * Deep-space finale: twinkling stars with slow parallax drift plus
 * occasional shooting-star streaks. Designed for the dark footer.
 * Pauses offscreen; renders a static sky under prefers-reduced-motion.
 */
export default function Starfield({ style }: { style?: React.CSSProperties }) {
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
    let rafId = 0;
    let visible = true;
    let running = true;
    let stars: Star[] = [];
    let streaks: Streak[] = [];
    let nextStreakAt = performance.now() + 1800;

    const ACCENT = "255, 122, 92"; // warm spark matching the site accent

    const seed = () => {
      const count = Math.min(
        160,
        Math.max(50, Math.round((width * height) / 5200)),
      );
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.3,
        baseAlpha: 0.25 + Math.random() * 0.55,
        twinkleSpeed: 0.4 + Math.random() * 1.4,
        twinklePhase: Math.random() * Math.PI * 2,
        drift: 0.02 + Math.random() * 0.07,
      }));
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(0);
    };

    const spawnStreak = () => {
      // Always enter from the top-left half, flying down-right
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.35;
      const speed = 7 + Math.random() * 5;
      streaks.push({
        x: Math.random() * width * 0.7,
        y: -10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const twinkle = reduced
          ? 1
          : 0.55 + 0.45 * Math.sin(t * 0.001 * s.twinkleSpeed + s.twinklePhase);
        ctx.fillStyle = `rgba(255, 252, 246, ${s.baseAlpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const sk of streaks) {
        const tail = 14 * sk.life;
        const grad = ctx.createLinearGradient(
          sk.x,
          sk.y,
          sk.x - sk.vx * tail,
          sk.y - sk.vy * tail,
        );
        grad.addColorStop(0, `rgba(${ACCENT}, ${0.9 * sk.life})`);
        grad.addColorStop(0.3, `rgba(255, 252, 246, ${0.5 * sk.life})`);
        grad.addColorStop(1, "rgba(255, 252, 246, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sk.x, sk.y);
        ctx.lineTo(sk.x - sk.vx * tail, sk.y - sk.vy * tail);
        ctx.stroke();
      }
    };

    const step = (t: number) => {
      if (!running || !visible) return;

      for (const s of stars) {
        s.x -= s.drift;
        if (s.x < -4) {
          s.x = width + 4;
          s.y = Math.random() * height;
        }
      }

      if (t > nextStreakAt) {
        spawnStreak();
        nextStreakAt = t + 2200 + Math.random() * 3800;
      }
      streaks = streaks.filter((sk) => {
        sk.x += sk.vx;
        sk.y += sk.vy;
        sk.life -= 0.016;
        return sk.life > 0 && sk.x < width + 60 && sk.y < height + 60;
      });

      draw(t);
      rafId = requestAnimationFrame(step);
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

    if (reduced) draw(0);
    else rafId = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

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
