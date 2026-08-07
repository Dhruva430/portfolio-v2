"use client";

import React, { useCallback, useRef } from "react";
import gsap from "gsap";
import CanvasScrubber from "./CanvasScrubber";
import { scrollToElement } from "@/lib/lenis";

export default function MainSequence() {
  const overlayRef    = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLDivElement>(null);
  const hintRef       = useRef<HTMLDivElement>(null);
  const progressRef   = useRef<HTMLDivElement>(null);
  const headerRef     = useRef<HTMLElement>(null);
  const servicesOverlayRef = useRef<HTMLDivElement>(null);
  const hasAutoAdvancedRef = useRef(false);

  // The last frame has landed. Take over the rest of the scroll: the dissolve
  // tail plays out under the auto-advance and the viewer is delivered to the
  // services section instead of being left to scroll out of the black.
  const handleSequenceComplete = useCallback(() => {
    if (hasAutoAdvancedRef.current) return;

    const target = document.getElementById("services");
    if (!target) return;

    // Reduced motion still gets taken to the section — it just skips the
    // travel rather than doing nothing at all.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      // They already carried themselves in on momentum — pulling them back to
      // the top of the section would feel like the page fighting them.
      if (rect.top < window.innerHeight * 0.5) return;

      hasAutoAdvancedRef.current = true;
      // Covers the dissolve tail plus the hero clearing the viewport, so it
      // needs longer than a plain section-to-section jump.
      scrollToElement(target, { duration: 1.2, immediate: reducedMotion });
    });
  }, []);

  const handleProgress = useCallback((progress: number) => {
    const title     = titleRef.current;
    const hint      = hintRef.current;
    const bar       = progressRef.current;
    const header    = headerRef.current;
    const svcOverlay = servicesOverlayRef.current;
    if (!title || !hint || !bar) return;

    // ── First overlay (title + header) ──
    const fadeStart = 0.04;
    const fadeEnd   = 0.32;
    const titleOpacity =
      progress <= fadeStart ? 1
      : progress >= fadeEnd ? 0
      : 1 - (progress - fadeStart) / (fadeEnd - fadeStart);

    const titleY       = progress * -36;
    const hintOpacity  = Math.max(0, 1 - progress * 4.5);
    const headerOpacity = titleOpacity;

    gsap.set(title,  { opacity: titleOpacity, y: titleY });
    gsap.set(hint,   { opacity: hintOpacity,  y: progress * 14 });
    if (header) gsap.set(header, { opacity: headerOpacity, y: titleY });
    gsap.set(bar,    { scaleX: progress });

    // ── Services overlay: "What I Do" ──
    // Fades IN: 0.30 → 0.54 | Holds: 0.54 → 0.78 | Fades OUT: 0.78 → 0.94
    const svcFadeIn  = { start: 0.30, end: 0.54 };
    const svcFadeOut = { start: 0.78, end: 0.94 };
    let svcOpacity = 0;
    if (progress >= svcFadeIn.start && progress <= svcFadeIn.end) {
      svcOpacity = (progress - svcFadeIn.start) / (svcFadeIn.end - svcFadeIn.start);
    } else if (progress > svcFadeIn.end && progress < svcFadeOut.start) {
      svcOpacity = 1;
    } else if (progress >= svcFadeOut.start && progress <= svcFadeOut.end) {
      svcOpacity = 1 - (progress - svcFadeOut.start) / (svcFadeOut.end - svcFadeOut.start);
    }

    if (svcOverlay) gsap.set(svcOverlay, { opacity: svcOpacity });
  }, []);

  const services = [
    { title: "Backend",    desc: "Go and Node APIs, Postgres data modelling, Redis, RBAC" },
    { title: "Full Stack", desc: "Whole features owned from schema to interface" },
    { title: "Frontend",   desc: "React and Next.js interfaces built for real payloads" },
    { title: "Shopify",    desc: "Custom themes, private apps, and headless storefronts" },
  ];

  return (
    <section id="home" className="relative w-full bg-black">
      <CanvasScrubber
        framePath="main"
        totalFrames={66}
        scrollMultiplier={1.2}
        onProgress={handleProgress}
        onComplete={handleSequenceComplete}
        priority
      >
        {/* ── First overlay: title + role ── */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end py-6 sm:py-10 px-5 sm:px-10 mix-blend-difference"
        >
          {/* header "Full Stack Developer · Est 2026" */}
          <header
            ref={headerRef}
            className="w-full flex items-end justify-between"
          >
            <div className="flex flex-col gap-4">
              <span className="text-[9px] font-mono text-neutral-500 tracking-[0.25em] uppercase">
                Full Stack Developer · Est. 2026
              </span>
            </div>
          </header>

          {/* Bottom: title block */}
          <div className="flex flex-col gap-0">
            <div ref={titleRef} className="will-change-transform">
              {/* Stacked: the full name on one line spans the whole frame and
                  sits over the artwork. Two lines keep it in the lower-left. */}
              <h1
                className="text-[clamp(2.25rem,8vw,6rem)] font-extrabold tracking-tighter text-white drop-shadow-2xl leading-[0.88]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                <span className="block">Dhruva</span>
                <span className="block text-red-500">Kushwaha</span>
              </h1>
              <p className="mt-4 text-xs md:text-sm font-mono tracking-[0.35em] text-neutral-400 uppercase">
                Full Stack Developer · Backend Focused
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {services.map((s, i) => (
                  <span
                    key={s.title}
                    className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2"
                  >
                    {i > 0 && <span className="text-red-700">·</span>}
                    {s.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress + scroll hint */}
            <div ref={hintRef} className="w-full mt-8">
              <div
                ref={progressRef}
                className="h-px w-full origin-left bg-red-500/60 mb-5"
                style={{ transform: "scaleX(0)" }}
              />
              <footer className="flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                <span className="flex items-center gap-2">
                  <span className="inline-block animate-bounce">↓</span>
                  Scroll to explore my work
                </span>
                <div className="hidden md:flex items-center gap-6">
                  <span>Go · TypeScript · Postgres · Next.js</span>
                  <span className="text-neutral-700">|</span>
                  <span>Bhopal, India</span>
                </div>
              </footer>
            </div>
          </div>
        </div>

        {/* ── Services overlay: bottom-left on mobile, bottom-center on desktop ── */}
        <div
          ref={servicesOverlayRef}
          className="pointer-events-none absolute inset-0 z-25 flex flex-col items-start justify-end px-6 sm:px-10 pb-10 sm:pb-16 sm:items-center sm:justify-end"
          style={{ opacity: 0 }}
        >
          {/* Label */}
          <p className="text-xs sm:text-[12px] font-mono tracking-[0.35em] text-red-500 sm:text-white uppercase mb-3 sm:mb-6 text-left sm:text-center">
            What I Do
          </p>

          {/* Services — stacked on mobile, inline/wrap on desktop */}
          <div className="flex flex-col items-start gap-3 sm:gap-y-4 sm:gap-x-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center w-full sm:w-auto">
            {services.map((s, i) => (
              <div key={s.title} className="flex items-start sm:items-center">
                {/* Divider between items on desktop */}
                {i > 0 && <div className="hidden sm:block w-px h-8 bg-neutral-700 mx-4 md:mx-8" />}
                <div className="text-left sm:text-center">
                  <h3
                    className="text-xl sm:text-lg md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-[11px] tracking-wider text-neutral-400 sm:text-neutral-100 uppercase">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Red accent line */}
          <div className="mt-4 sm:mt-6 w-12 h-px bg-red-600 self-start sm:self-center" />
        </div>
      </CanvasScrubber>
    </section>
  );
}
