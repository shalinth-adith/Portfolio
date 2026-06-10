"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Post {
  tag: string;
  readTime: string;
  title: string;
  date: string;
  url: string;
  cover: string | null;
}

// Shape of the dev.to articles API response (fields we use)
interface DevToArticle {
  title: string;
  url: string;
  tag_list: string[];
  reading_time_minutes: number;
  readable_publish_date: string;
  cover_image: string | null;
  social_image: string | null;
}

// Shown while loading and if the network request fails
const FALLBACK_POSTS: Post[] = [
  {
    tag: "SWIFTUI",
    readTime: "5 min read",
    title: "Building buttery-smooth animations with matchedGeometryEffect",
    date: "",
    url: "https://dev.to/t/swiftui",
    cover: null,
  },
  {
    tag: "IOS",
    readTime: "5 min read",
    title: "Designing offline-first iOS apps that users actually trust",
    date: "",
    url: "https://dev.to/t/ios",
    cover: null,
  },
  {
    tag: "SWIFT",
    readTime: "5 min read",
    title: "App Store Connect secrets every indie developer should know",
    date: "",
    url: "https://dev.to/t/swift",
    cover: null,
  },
];

// Generative art per card slot — used when an article has no image yet
const CARD_ART = [
  { bgColor: "#A8B8D0", accentColor: "#E03030" },
  { bgColor: "#D8A8B0", accentColor: "#E04060" },
  { bgColor: "#B0C0B0", accentColor: "#408040" },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<Post[] | null>(null); // null = loading

  // Top Swift articles of the rolling week — the list shifts every day
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          "https://dev.to/api/articles?tag=swift&top=7&per_page=6",
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error(`dev.to responded ${res.status}`);
        const data: DevToArticle[] = await res.json();
        const mapped: Post[] = data.slice(0, 3).map((a) => ({
          title: a.title,
          url: a.url,
          tag: (a.tag_list?.[0] ?? "swift").toUpperCase(),
          readTime: `${a.reading_time_minutes || 4} min read`,
          date: a.readable_publish_date ?? "",
          cover: a.cover_image || a.social_image || null,
        }));
        if (!cancelled) setPosts(mapped.length === 3 ? mapped : FALLBACK_POSTS);
      } catch {
        if (!cancelled) setPosts(FALLBACK_POSTS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      const st = { trigger: sectionRef.current, start: "top 72%" };

      gsap.fromTo(
        ".blog-header-el",
        { y: 40, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: st,
        },
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
        },
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
    { scope: sectionRef },
  );

  const slots: (Post | null)[] = posts ?? [null, null, null];

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="blog-section"
      style={{
        padding: "100px 48px",
        background: "var(--bg2)",
        textAlign: "center",
      }}
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
        iOS Insights &amp;{" "}
        <span className="serif-it" style={{ fontSize: "1.06em" }}>
          Dev Notes
        </span>
      </h2>

      <p
        className="blog-header-el"
        style={{
          fontSize: 14,
          color: "var(--ink2)",
          marginTop: 14,
          opacity: 0,
        }}
      >
        Fresh picks from the iOS community — updated daily via{" "}
        <a
          href="https://dev.to/t/swift"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline", textUnderlineOffset: 3 }}
        >
          dev.to
        </a>
      </p>

      {/* Cards */}
      <div
        className="blog-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginTop: 48,
          textAlign: "left",
        }}
      >
        {slots.map((post, i) => (
          <a
            key={i}
            className="blog-card"
            href={post?.url ?? "https://dev.to/t/swift"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ opacity: 0, cursor: "none", display: "block" }}
            aria-label={post ? `Read: ${post.title}` : "Loading article"}
          >
            {/* Cover image, generative art fallback, or loading shimmer */}
            <div
              className="blog-card-media"
              style={{ height: 200, overflow: "hidden", position: "relative" }}
            >
              {post === null ? (
                <div
                  className="skeleton"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : post.cover ? (
                <img
                  src={post.cover}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
                  }}
                />
              ) : (
                <svg
                  viewBox="0 0 400 200"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                  style={{
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
                    display: "block",
                  }}
                >
                  <rect width="400" height="200" fill={CARD_ART[i].bgColor} />
                  <ellipse
                    cx="200"
                    cy="185"
                    rx="100"
                    ry="55"
                    fill={CARD_ART[i].bgColor}
                    opacity="0.55"
                  />
                  <ellipse
                    cx="200"
                    cy="85"
                    rx="50"
                    ry="50"
                    fill={CARD_ART[i].accentColor}
                    opacity="0.22"
                  />
                  <ellipse
                    cx="200"
                    cy="82"
                    rx="28"
                    ry="28"
                    fill={CARD_ART[i].accentColor}
                    opacity="0.88"
                  />
                </svg>
              )}
            </div>
            <div style={{ padding: "18px 20px 22px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                {post === null ? (
                  <>
                    <span
                      className="skeleton"
                      style={{ width: 70, height: 22, borderRadius: 999 }}
                    />
                    <span
                      className="skeleton"
                      style={{ width: 80, height: 14, borderRadius: 4 }}
                    />
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                        border: "1px solid rgba(240, 81, 56, 0.25)",
                        padding: "4px 10px",
                        borderRadius: 999,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {post.tag}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--ink3)" }}>
                      {post.readTime}
                      {post.date ? ` · ${post.date}` : ""}
                    </span>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{
                        marginLeft: "auto",
                        opacity: 0.45,
                        flexShrink: 0,
                      }}
                    >
                      <path
                        d="M2 10L10 2M10 2H4M10 2V8"
                        stroke="var(--ink)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </div>
              {post === null ? (
                <>
                  <span
                    className="skeleton"
                    style={{
                      display: "block",
                      width: "100%",
                      height: 14,
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  />
                  <span
                    className="skeleton"
                    style={{
                      display: "block",
                      width: "65%",
                      height: 14,
                      borderRadius: 4,
                    }}
                  />
                </>
              ) : (
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "var(--ink)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.title}
                </h3>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
