"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RED = "var(--color-red-600)";

const works = [
  {
    id: "01",
    category: "Photo Editing",
    title: "Cinematic Retouch",
    description:
      "High-end portrait retouching with mood-driven colour science and natural skin textures.",
    tags: ["Retouching", "Color Grading"],
  },
  {
    id: "02",
    category: "Video Editing",
    title: "Cinematic Cuts",
    description:
      "Fast-paced edits built for engagement in promos, ads, and long-form content with sharp sound design.",
    tags: ["Promos", "Long-form", "Sound Design"],
  },
  {
    id: "03",
    category: "Shorts",
    title: "Viral Short-Form",
    description:
      "Punchy, scroll-stopping short-form videos optimised for Reels, YouTube Shorts, and TikTok.",
    tags: ["Reels", "YT Shorts", "TikTok"],
  },
  {
    id: "04",
    category: "Thumbnail Design",
    title: "Click-Worthy Thumbnails",
    description:
      "Bold, high-contrast thumbnails designed to maximise click-through rates across platforms.",
    tags: ["YouTube", "Clickbait-Free", "CTR"],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Subtle parallax on video
      gsap.to(videoRef.current, {
        y: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* ── Video background ── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/frames/herobg-2.webm"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-110"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.78) 100%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      {/* ── Foreground content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 md:py-32">
        {/* Section heading */}
        <div ref={headingRef} className="mb-12 md:mb-20">
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-red-600 uppercase block mb-3">
            What We Offer
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <h2
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-normal text-white leading-none"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Our{" "}
              <span className="text-red-600">
                Services
              </span>
            </h2>
            <p className="hidden sm:block text-sm text-neutral-400 max-w-xs font-mono tracking-wide leading-relaxed">
              High-end post-production, photo editing, short-form edits, and thumbnail design.
            </p>
          </div>
          {/* Red accent bar */}
          <div className="mt-6 md:mt-8 h-px w-12 md:w-16 bg-red-600" />
        </div>

        {/* Works grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {works.map((work, i) => (
            <div
              key={work.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 30% 50%, color-mix(in srgb, ${RED} 9%, transparent) 0%, transparent 70%)`,
                }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-red-600"
              />

              <div className="relative z-10 p-5 md:p-8">
                {/* Number + category row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-red-600">
                    {work.category}
                  </span>
                  <span className="text-5xl font-extrabold text-white/10 leading-none select-none">
                    {work.id}
                  </span>
                </div>

                <h3
                  className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-red-100 transition-colors duration-300"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {work.title}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed mb-6 group-hover:text-neutral-300 transition-colors duration-300">
                  {work.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-red-600/25 text-red-600/80 bg-red-600/10 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Arrow */}
                  <span className="text-red-600/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-lg">
                    ↗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
