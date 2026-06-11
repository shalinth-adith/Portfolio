"use client";

import { useEffect, useRef } from "react";

/**
 * Retro-futuristic perspective grid floor — horizontal lines race from the
 * horizon toward the viewer, vertical lines converge on a vanishing point.
 * Sits at the bottom of its parent section, fading out toward the horizon.
 * Theme-aware (reads --accent / --ink3) and reduced-motion safe.
 */
export default function WarpGrid({ style }: { style?: React.CSSProperties }) {
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
    let offset = 0;

    let accentRGB = "240, 81, 56";
    let lineRGB = "136, 136, 128";
    const toRGB = (hex: string, fallback: string) => {
      const m = hex.match(/^#?([0-9a-f]{6})$/i);
      if (!m) return fallback;
      const n = parseInt(m[1], 16);
      return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    };
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      accentRGB = toRGB(cs.getPropertyValue("--accent").trim(), accentRGB);
      lineRGB = toRGB(cs.getPropertyValue("--ink3").trim(), lineRGB);
    };
    readTheme();
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

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
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const horizon = height * 0.18; // grid starts below this line
      const cx = width / 2;
      const rows = 14;
      const cols = 24;

      // Horizontal lines, exponentially spaced for perspective depth.
      // `offset` slides them toward the viewer; each line loops at the horizon.
      for (let i = 0; i <= rows; i++) {
        const t = (i + offset) / rows; // 0 at horizon → 1 at bottom edge
        if (t > 1) continue;
        const y = horizon + Math.pow(t, 2.6) * (height - horizon);
        const alpha = Math.pow(t, 1.6) * 0.32;
        ctx.strokeStyle = `rgba(${lineRGB}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical lines converging on the vanishing point
      for (let i = -cols / 2; i <= cols / 2; i++) {
        const xBottom = cx + (i / (cols / 2)) * width * 0.85;
        const grad = ctx.createLinearGradient(cx, horizon, xBottom, height);
        grad.addColorStop(0, `rgba(${lineRGB}, 0)`);
        grad.addColorStop(1, `rgba(${lineRGB}, 0.22)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, horizon);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Glowing horizon line
      const hGrad = ctx.createLinearGradient(0, 0, width, 0);
      hGrad.addColorStop(0, `rgba(${accentRGB}, 0)`);
      hGrad.addColorStop(0.5, `rgba(${accentRGB}, 0.5)`);
      hGrad.addColorStop(1, `rgba(${accentRGB}, 0)`);
      ctx.strokeStyle = hGrad;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = `rgba(${accentRGB}, 0.8)`;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(width, horizon);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const step = () => {
      if (!running || !visible) return;
      offset = (offset + 0.0035) % 1;
      draw();
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

    if (reduced) draw();
    else rafId = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
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
        // Soften the grid so headline text stays readable over it
        maskImage:
          "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 30%, #000 75%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 30%, #000 75%)",
        ...style,
      }}
    />
  );
}
